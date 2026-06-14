chrome.runtime.onInstalled.addListener(() => {
    console.log('[Recallr] extension installed / updated')
})

chrome.runtime.onMessage.addListener(
    (message: unknown, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
        const msg = message as { type?: string; action?: string; username?: string; password?: string, url?: string, question?: string }

        if (msg.action === "login" || msg.type === "login") {
            fetch("http://localhost:8080/api/v1/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: msg.username, password: msg.password }),
            })
                .then((res) => res.json())
                .then((data) => {
                    chrome.storage.local.set({ token: data.token });
                    sendResponse({ ok: true, token: data.token });
                })
                .catch((err) => sendResponse({ ok: false, error: err.message }));
            return true;
        }

        if (msg.action === "signup" || msg.type === "signup") {
            fetch("http://localhost:8080/api/v1/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: msg.username, password: msg.password }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.token) {
                        chrome.storage.local.set({ token: data.token });
                        sendResponse({ ok: true, token: data.token });
                    } else {
                        sendResponse({ ok: true, message: "User registered successfully" });
                    }
                })
                .catch((err) => sendResponse({ ok: false, error: err.message }));
            return true;
        }

        if (msg.type === "save") {
            chrome.storage.local.get("token", (result) => {
                const token = result.token;
                if (!token) {
                    sendResponse({ ok: false, error: "Not logged in" });
                    return;
                }

                fetch("http://localhost:8080/api/v1/content", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ url: msg.url })
                })
                    .then((res) => res.json())
                    .then((data) => {
                        sendResponse({ ok: true, message: "URL saved", data});
                    })
                    .catch((err) => {
                        sendResponse({ ok: false, error: err.message });
                    });
            });
            return true;
        }

        // --- NEW CHAT HANDLER ---
        if (msg.type === "chat") {
            chrome.storage.local.get("token", (result) => {
                const token = result.token;
                if (!token) {
                    sendResponse({ ok: false, error: "Not logged in" });
                    return;
                }

                // Update this URL to your actual chat/QnA endpoint!
                fetch("http://localhost:8080/api/v1/rag/query", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ query: msg.question })
                })
                    .then((res) => res.json())
                    .then((data) => {
                        // Send the whole data object (which includes .answer and .sources) back to content script
                        sendResponse({ ok: true, data: data });
                    })
                    .catch((err) => {
                        sendResponse({ ok: false, error: err.message });
                    });
            });
            return true; // Keep async channel open
        }

        sendResponse({ ok: true })
        return true
    }
);