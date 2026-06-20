# Frontend Overview — Recallr Extension

This document describes the frontend structure and workflow (UI logic only). CSS files are intentionally omitted.

## Project frontdoor

- `src/content/` — content script that runs in page context (shadow DOM). Minimal UI after refactor.
- `src/popup/` — extension popup UI (primary app interface)
- `src/components/` — reusable React components (Chat pieces, Save form, panels)
- `src/hooks/` — React hooks (auth, chat, panel)
- `src/store/` — Zustand stores for state (auth, chat, panel, popup)
- `src/lib/` — messaging and API helper functions
- `src/background/` — background worker handling API/auth requests

## Key frontend file tree (ignore CSS)

- src/
  - background/
    - index.ts                — Background entry: handles messaging to remote API, token storage
  - content/
    - mount.ts                — Creates shadow host and injects content bundle (mounting helper)
    - index.tsx               — React entry for content script
    - root.tsx                — ContentRoot: now minimal; hydrates auth then returns null (no in-page UI)
  - popup/
    - App.tsx                 — Popup root: handles auth hydration and routes between screens
    - popup.html              — Popup HTML
    - screens/
      - LoginScreen.tsx       — Login UI used when not authenticated
      - DashboardScreen.tsx   — Dashboard after auth (Save / Chat actions)
      - SaveScreen.tsx        — Save URL screen (calls `messaging.save`)
      - ChatScreen.tsx        — Chat screen (uses `MessageList` + `ChatInput`)
  - components/
    - FloatingTrigger/        — (deprecated) in-page floating trigger button
    - RadialMenu/             — (deprecated) in-page radial menu (Save / Ask)
    - SavePanel/              — (deprecated) in-page save panel component (unused by popup)
    - ChatPanel/
      - ChatPanel.tsx         — (deprecated) in-page chat wrapper (unused by popup)
      - MessageList.tsx       — Reused by popup ChatScreen to render messages
      - ChatInput.tsx         — Reused by popup ChatScreen for user input
  - hooks/
    - useAuth.ts               — Auth hook: hydrate, login, logout; reads/writes token
    - useChat.ts               — Chat hook: thin wrapper around `chatStore`
    - usePanel.ts              — (legacy) panel interactions for in-page UI
  - lib/
    - messaging.ts            — Messaging API: `save()`, `chat()`, `login()`, `signup()`, uses `chrome.runtime` to talk to background
  - store/
    - authStore.ts            — Token and auth state
    - chatStore.ts            — Chat history, send logic; uses `messaging.chat`
    - panelStore.ts           — Legacy panel state for in-page panels (radial/save/chat)
    - popupStore.ts           — New popup navigation store (dashboard/save/chat)
  - types/
    - domain.ts               — Shared domain types (PanelKind, ChatMessage)
    - api.ts / messages.ts    — Message and API typings

## Runtime workflow (frontend)

1. Popup opened by user (click extension icon) → `src/popup/App.tsx` loads.
2. `App.tsx` calls `useAuth().hydrate()` to restore token from storage via background.
3. If not authenticated → `LoginScreen` shown; upon successful login token stored and `App` re-renders.
4. If authenticated → `DashboardScreen` shown (default `popupStore.currentScreen` === `dashboard`).
   - User chooses **Save URL** → `popupStore.navigateTo('save')` → `SaveScreen` rendered.
   - User chooses **Chat** → `popupStore.navigateTo('chat')` → `ChatScreen` rendered.
5. `SaveScreen` collects a URL and calls `messaging.save(url)` which forwards the request to `background/index.ts` to perform the API call with the stored token.
6. `ChatScreen` uses `useChat()` (which delegates to `chatStore`) to `send(question, url)`:
   - `chatStore.send` appends local optimistic messages then calls `messaging.chat(question, url)`
   - Background forwards to the RAG/QA endpoint and returns answer + sources
   - `chatStore` appends result message(s) into `messages` which `MessageList` renders
7. Background responses are returned via `messaging` promise resolution; popup UI updates accordingly.

## Notes & Decisions

- In-page UI (FloatingTrigger, RadialMenu, SavePanel, ChatPanel) was intentionally removed from the visible path—those components are kept in the repo but marked deprecated. The popup screens are now the single source of truth for Save and Ask.
- `MessageList.tsx` and `ChatInput.tsx` from `components/ChatPanel/` are reused by `ChatScreen` to avoid duplication.
- State stores (`authStore`, `chatStore`) are shared between contexts; `popupStore` is popup-only navigation state.
- `messaging.ts` abstracts runtime communication so popup and content can both call the same API helpers; background remains the authoritative caller for network/API operations.

## How to test quickly

1. Build and load unpacked extension into the browser.

```bash
npm run build
# then load dist/ in browser extension dev mode
```

2. Open the extension popup and test:
  - Login flow
  - Dashboard → Save URL
  - Dashboard → Chat (ask a question)

## Questions / Next steps

- Remove deprecated in-page components (`FloatingTrigger`, `RadialMenu`, `SavePanel`, `ChatPanel`) or keep them for later reactivation?
- Add persistence (local) for chat history in popup, if desired.

---
Generated by developer assistant.
