# 🧠 Recallr Browser Extension

A powerful Chrome extension that lets you save and search your web browsing history with AI-powered insights.

**Save pages instantly** → **Ask questions** → **Get answers with sources**

## ✨ Features

### 🔐 Authentication
- Secure login/signup with username and password
- Token-based session management
- Persistent authentication across browser restarts

### 💾 Content Saving
- **One-click save** - Floating button on every webpage
- **Full control** - Edit URLs before saving
- Saves current page or any custom URL
- Toast notifications for success/failure

### 🤖 AI-Powered Chat
- **Ask anything** about your saved content
- Powered by RAG (Retrieval-Augmented Generation)
- View AI responses with markdown formatting
- **Source references** - Click to view original pages
- Real-time chat interface with message history

### 🎨 User Interface
- **Floating radial menu** - Click "Re" button to expand
- **S button** (Green) - Save content
- **A button** (Orange) - Chat/Ask questions
- Smooth animations and transitions
- Responsive design that works on all pages

## 🚀 Installation

### Prerequisites
- Chrome Browser (version 90+)
- Node.js 18+ (for development)
- Backend server running on `http://localhost:8080`

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd recallr-extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```
   This generates the extension in the `dist/` folder

4. **Load into Chrome**
   - Open `chrome://extensions`
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked**
   - Select the `dist/` folder
   - Extension is now installed! 🎉

## 📖 Usage

### Saving Content

1. Click the **Re** button (bottom-right corner)
2. Click the **S** (Save) button
3. Edit the URL if needed (pre-filled with current page)
4. Click **Save URL** or press Enter
5. See "Saved to Recallr!" confirmation

### Asking Questions

1. Click the **Re** button
2. Click the **A** (Ask) button
3. Chat panel opens on the right
4. Type your question about saved content
5. Click **➤** or press Ctrl+Enter to send
6. Read the AI response with source links
7. Click sources to open them in new tabs

### Authentication

On first use:
1. Click extension icon in toolbar
2. Enter username and password
3. Click **Login** button
4. Session saved - no need to login again

## 🏗️ Architecture

### File Structure
```
recallr-extension/
├── src/
│   ├── background/
│   │   └── index.ts          # Service worker - handles all API calls
│   ├── content/
│   │   └── index.tsx         # Injected UI - floating button, chat, save panels
│   ├── popup/
│   │   ├── popup.tsx         # Login/auth popup
│   │   └── popup.html        # Popup HTML
│   └── assets/               # Images and resources
├── public/
│   └── screen.png            # Extension icon
├── manifest.json             # Extension configuration
├── package.json              # Dependencies
└── vite.config.ts            # Build configuration
```

### Data Flow

```
Content Script (UI)
    ↓ chrome.runtime.sendMessage()
Service Worker (Background)
    ↓ fetch() with Bearer token
Backend API
    ↓ JSON response
Service Worker
    ↓ sendResponse()
Content Script (Update UI)
```

## 🔌 API Endpoints

All endpoints require authentication with Bearer token:

### Authentication
- **POST** `/api/v1/signin` - Login
  - Body: `{ username, password }`
  - Returns: `{ token, ... }`

- **POST** `/api/v1/signup` - Register
  - Body: `{ username, password }`
  - Returns: `{ token, ... }`

### Content Management
- **POST** `/api/v1/content` - Save a URL
  - Body: `{ url }`
  - Header: `Authorization: Bearer {token}`
  - Returns: `{ ok: true, message, data }`

### Chat/Search
- **POST** `/api/v1/rag/query` - Ask question
  - Body: `{ query }`
  - Header: `Authorization: Bearer {token}`
  - Returns: `{ answer, sources: [{ url, ... }], ... }`

## 🛠️ Development

### Available Scripts

```bash
# Build for production
npm run build

# Watch mode (dev)
npm run dev

# Type check
tsc -b

# ESLint check
npm run lint
```

### Making Changes

1. Edit files in `src/`
2. Run `npm run build` to compile
3. Reload extension in Chrome (`chrome://extensions` → reload button)
4. Check Console (F12) for logs from background/content scripts

### Debugging

**Content Script Logs:**
- Right-click page → **Inspect** → **Console tab**
- All logs prefixed with `[Recallr]`

**Service Worker Logs:**
- Go to `chrome://extensions`
- Click **Details** on Recallr
- Click **Service Worker** link
- See background script console

## 📦 Build Output

After `npm run build`, the `dist/` folder contains:
- `manifest.json` - Extension manifest
- `src/background/` - Service worker bundle
- `src/content/` - Content script bundle
- `src/popup/` - Popup HTML
- `screen.png` - Extension icon
- `assets/` - Built JavaScript files

## 🔐 Security

- Tokens stored in Chrome storage (encrypted by browser)
- All API calls use HTTPS headers
- Bearer token authentication on every request
- No sensitive data in localStorage (uses chrome.storage.local)
- Content script isolated from page JavaScript

## 🤝 Contributing

1. Create a feature branch
2. Make changes and test thoroughly
3. Run `npm run build` to verify
4. Submit pull request

## 📝 License

MIT

## 🐛 Troubleshooting

### Extension not showing up
- Verify `dist/` folder exists after build
- Check `manifest.json` is valid (no TypeScript in dist)
- Reload extension in `chrome://extensions`

### API calls failing
- Verify backend is running on `http://localhost:8080`
- Check token in `chrome://extensions` → Storage → Local Storage
- View Service Worker logs for error details

### UI not appearing
- Check Console (F12) for JavaScript errors
- Verify content script is injected (should see `[Recallr] content script loaded`)
- Refresh the page

### Token expired
- Logout and login again
- Token is refreshed on each login

## 📞 Support

For issues or questions:
1. Check browser console for error messages
2. Review Service Worker logs
3. Verify backend API is responding
4. Check network tab in DevTools for failed requests

---

**Made with ❤️ for better web exploration**
