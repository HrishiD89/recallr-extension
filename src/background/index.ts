import type { AppMessage, MessageResponse } from '../types/messages'
import { API_BASE } from '../lib/config'

// TODO(cleanup): remove demo shortcut before shipping.
const DEMO_USER = 'demo'
const DEMO_PASS = 'demo'
const DEMO_TOKEN = 'demo-token'

async function getToken(): Promise<string | null> {
    return new Promise((resolve) => {
        chrome.storage.local.get('token', (r) => {
            resolve((r.token as string | undefined) ?? null)
        })
    })
}

async function forwardAuth(
    endpoint: string,
    username: string,
    password: string,
): Promise<MessageResponse> {
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        const data = (await res.json()) as { token?: string; message?: string }
        if (data.token) await chrome.storage.local.set({ token: data.token })
        return { ok: true, token: data.token, message: data.message }
    } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : 'Network error' }
    }
}

async function handle(msg: AppMessage): Promise<MessageResponse> {
    switch (msg.type) {
        case 'login': {
            // TODO(cleanup): remove demo shortcut before shipping.
            if (msg.username === DEMO_USER && msg.password === DEMO_PASS) {
                await chrome.storage.local.set({ token: DEMO_TOKEN })
                return { ok: true, token: DEMO_TOKEN }
            }
            return forwardAuth(`${API_BASE}/signin`, msg.username, msg.password)
        }

        case 'signup':
            return forwardAuth(`${API_BASE}/signup`, msg.username, msg.password)

        case 'save': {
            const token = await getToken()
            if (!token) return { ok: false, error: 'Not logged in' }
            try {
                const res = await fetch(`${API_BASE}/content`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ url: msg.url }),
                })
                const data = await res.json()
                return { ok: true, data, message: 'URL saved' }
            } catch (e) {
                return { ok: false, error: e instanceof Error ? e.message : 'Network error' }
            }
        }

        case 'chat': {
            const token = await getToken()
            if (!token) return { ok: false, error: 'Not logged in' }
            try {
                const res = await fetch(`${API_BASE}/rag/query`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ query: msg.question }),
                })
                const data = await res.json()
                return { ok: true, data }
            } catch (e) {
                return { ok: false, error: e instanceof Error ? e.message : 'Network error' }
            }
        }

        case 'logout':
            await chrome.storage.local.remove('token')
            return { ok: true }
    }
}

chrome.runtime.onInstalled.addListener(() => {
    console.log('[Recallr] extension installed / updated')
})

chrome.runtime.onMessage.addListener(
    (message: unknown, _sender: chrome.runtime.MessageSender, sendResponse: (response?: MessageResponse) => void) => {
        handle(message as AppMessage)
            .then(sendResponse)
            .catch((e) =>
                sendResponse({ ok: false, error: e instanceof Error ? e.message : 'Unknown error' }),
            )
        return true // Keep async channel open
    },
)