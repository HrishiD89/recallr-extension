console.log('[Recallr] content script loaded on:', window.location.href)
import { marked } from 'marked';


// Add styles for radial menu and chat window
const style = document.createElement('style')
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes popOut1 {
    from { opacity: 0; transform: translateY(60px) scale(0.5); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  
  @keyframes popOut2 {
    from { opacity: 0; transform: translateY(120px) scale(0.5); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .recallr-loading {
    animation: spin 1s linear infinite;
  }
  
  .recallr-button {
    transition: all 0.2s ease;
  }
  .recallr-button:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(92, 71, 224, 0.4);
  }
  .recallr-button:active {
    transform: scale(0.95);
  }
  
  .recallr-radial-menu {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    z-index: 999999997;
  }
  
  .recallr-menu-item {
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    font-weight: bold;
    font-size: 18px;
    font-family: sans-serif;
    transition: all 0.2s ease;
    user-select: none;
  }
  .recallr-menu-item:hover {
    transform: scale(1.15) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  .recallr-menu-item:active {
    transform: scale(0.95) !important;
  }
  
  .recallr-save-btn {
    background: #10B981;
    bottom: 60px;
    right: 0;
    animation: popOut1 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  
  .recallr-annotate-btn {
    background: #F59E0B;
    bottom: 120px;
    right: 0;
    animation: popOut2 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  /* --- CHAT WINDOW STYLES --- */
  .recallr-chat-panel {
    position: fixed;
    right: 84px;
    bottom: 24px;
    width: 380px;
    height: 520px; 
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    z-index: 999999998;
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideInLeft 0.3s ease forwards;
  }

  .recallr-chat-header {
    padding: 16px;
    background: #5C47E0;
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .recallr-chat-close {
    cursor: pointer;
    font-size: 18px;
    opacity: 0.8;
  }
  .recallr-chat-close:hover {
    opacity: 1;
  }

  .recallr-chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background: #f9fafb;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .recallr-msg {
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 13px;
    line-height: 1.4;
    word-wrap: break-word;
  }

  .recallr-msg-user {
    background: #5C47E0;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }

  .recallr-msg-ai {
    background: white;
    color: #333;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }

  .recallr-msg-loading {
    align-self: flex-start;
    color: #666;
    font-style: italic;
    font-size: 13px;
  }

  .recallr-sources {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e5e7eb;
    font-size: 11px;
    color: #666;
  }

  .recallr-source-link {
    display: inline-block;
    margin-right: 8px;
    margin-top: 4px;
    color: #5C47E0;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 600;
  }

  .recallr-chat-input-area {
    padding: 12px;
    background: white;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 8px;
  }

  .recallr-chat-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-family: sans-serif;
    font-size: 13px;
    resize: none;
    outline: none;
  }
  .recallr-chat-input:focus {
    border-color: #5C47E0;
  }

  .recallr-chat-send {
    background: #5C47E0;
    color: white;
    border: none;
    border-radius: 8px;
    width: 40px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s;
  }
  .recallr-chat-send:hover {
    background: #4c38c7;
  }

  /* --- SAVE PANEL STYLES --- */
  .recallr-save-panel {
    position: fixed;
    right: 84px;
    bottom: 24px;
    width: 320px;
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    z-index: 999999998;
    font-family: sans-serif;
    animation: slideInLeft 0.3s ease forwards;
  }

  .recallr-save-panel h3 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #333;
  }

  .recallr-save-panel input {
    width: 100%;
    padding: 10px;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-family: sans-serif;
    font-size: 13px;
    box-sizing: border-box;
    margin-bottom: 12px;
    outline: none;
  }

  .recallr-save-panel input:focus {
    border-color: #10B981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
  }

  .recallr-save-panel button {
    width: 100%;
    padding: 10px;
    background: #10B981;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: background 0.2s;
  }

  .recallr-save-panel button:hover {
    background: #059669;
  }
`
document.head.appendChild(style)

const div = document.createElement('div')
div.id = 'recallr-content-root'
div.className = 'recallr-button'
div.style.cssText = `
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  background: #5C47E0;
  border-radius: 50%;
  z-index: 999999999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-weight: bold;
  font-size: 18px;
  font-family: sans-serif;
  user-select: none;
`
div.textContent = "Re";

let isLoading = false;
let menuOpen = false;

const closeMenu = () => {
  menuOpen = false;
  const menu = document.getElementById('recallr-radial-menu');
  if (menu) menu.remove();
}

const closeChatPanel = () => {
  const panel = document.getElementById('recallr-chat-panel');
  if (panel) panel.remove();
}

const closeSavePanel = () => {
  const panel = document.getElementById('recallr-save-panel');
  if (panel) panel.remove();
}

const openRadialMenu = () => {
  closeChatPanel();
  closeSavePanel();
  menuOpen = true;
  
  const menu = document.createElement('div')
  menu.id = 'recallr-radial-menu'
  menu.className = 'recallr-radial-menu'
  
  const saveBtn = document.createElement('div')
  saveBtn.className = 'recallr-menu-item recallr-save-btn'
  saveBtn.textContent = 'S'
  saveBtn.onclick = (e) => {
    e.stopPropagation();
    closeMenu();
    openSavePanel(); // Open the input panel instead of immediate save
  }
  
  const annotateBtn = document.createElement('div')
  annotateBtn.className = 'recallr-menu-item recallr-annotate-btn'
  annotateBtn.textContent = 'A'
  annotateBtn.onclick = (e) => {
    e.stopPropagation();
    closeMenu();
    openChatPanel();
  }
  
  menu.appendChild(saveBtn);
  menu.appendChild(annotateBtn);
  document.body.appendChild(menu);
}

const openSavePanel = () => {
  closeChatPanel();
  if (document.getElementById('recallr-save-panel')) return;

  const panel = document.createElement('div')
  panel.id = 'recallr-save-panel'
  panel.className = 'recallr-save-panel'
  
  const title = document.createElement('h3')
  title.textContent = 'Save Content';
  
  const input = document.createElement('input')
  input.type = 'url'
  input.id = 'recallr-save-url-input'
  input.placeholder = 'Enter URL to save'
  input.value = window.location.href; // Pre-fill with current page URL
  
  const submitBtn = document.createElement('button')
  submitBtn.id = 'recallr-save-submit-btn'
  submitBtn.textContent = 'Save URL';

  panel.appendChild(title);
  panel.appendChild(input);
  panel.appendChild(submitBtn);
  document.body.appendChild(panel);
  
  input.focus(); // Focus the input so the user can edit immediately

  const triggerSave = () => {
    const url = input.value.trim();
    if (!url) {
      alert("Please enter a URL");
      return;
    }
    closeSavePanel();
    performSaveWithUrl(url);
  };

  submitBtn.onclick = triggerSave;
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      triggerSave();
    }
  });
}

const openChatPanel = () => {
  closeSavePanel();
  if (document.getElementById('recallr-chat-panel')) return;

  const panel = document.createElement('div')
  panel.id = 'recallr-chat-panel'
  panel.className = 'recallr-chat-panel'
  
  panel.innerHTML = `
    <div class="recallr-chat-header">
      <span>Ask Recallr</span>
      <span class="recallr-chat-close" id="recallr-chat-close-btn">✕</span>
    </div>
    <div class="recallr-chat-messages" id="recallr-chat-messages">
      <div class="recallr-msg recallr-msg-ai">
        Hi! Ask me anything about the content on this page.
      </div>
    </div>
    <div class="recallr-chat-input-area">
      <textarea class="recallr-chat-input" id="recallr-chat-input" placeholder="Type your question..." rows="1"></textarea>
      <button class="recallr-chat-send" id="recallr-chat-send-btn">➤</button>
    </div>
  `
  
  document.body.appendChild(panel);
  
  document.getElementById('recallr-chat-close-btn')!.onclick = closeChatPanel;
  
  const sendBtn = document.getElementById('recallr-chat-send-btn')!;
  const chatInput = document.getElementById('recallr-chat-input') as HTMLTextAreaElement;
  
  const sendMessage = () => {
    const text = chatInput.value.trim();
    if (!text || isLoading) return;
    
    appendMessage(text, 'user');
    chatInput.value = '';
    handleChatMessage(text);
  };

  sendBtn.onclick = sendMessage;
  
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

const appendMessage = (content: string, type: 'user' | 'ai' | 'loading') => {
  const messagesContainer = document.getElementById('recallr-chat-messages');
  if (!messagesContainer) return;

  const msgDiv = document.createElement('div');
  
  if (type === 'loading') {
    msgDiv.className = 'recallr-msg-loading';
    msgDiv.textContent = content;
    msgDiv.id = 'recallr-loading-indicator';
  } else {
    msgDiv.className = `recallr-msg recallr-msg-${type}`;
    msgDiv.innerHTML = content;
  }

  messagesContainer.appendChild(msgDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

const handleChatMessage = (question: string) => {
  isLoading = true;
  appendMessage("Recallr is thinking...", "loading");

  chrome.runtime.sendMessage(
    { type: "chat", url: window.location.href, question },
    (response) => {
      const loadInd = document.getElementById('recallr-loading-indicator');
      if (loadInd) loadInd.remove();
      isLoading = false;

      if (response?.ok && response.data) {
        const aiData = response.data;
        let formattedHtml = marked.parse(aiData.answer || "I couldn't find an answer.") as string;

        if (aiData.sources && aiData.sources.length > 0) {
          formattedHtml += `<div class="recallr-sources"><strong>Sources:</strong><br>`;
          const uniqueSources = Array.from(new Map(aiData.sources.map((s: any) => [s.url, s])).values());
          
          uniqueSources.forEach((source: any, index: number) => {
            formattedHtml += `<span class="recallr-source-link" data-url="${source.url}">Source ${index + 1}</span>`;
          });
          formattedHtml += `</div>`;
        }

        appendMessage(formattedHtml, 'ai');

        setTimeout(() => {
          document.querySelectorAll('.recallr-source-link').forEach(link => {
            const htmlLink = link as HTMLElement;
            htmlLink.onclick = (e: MouseEvent) => {
              const target = e.currentTarget as HTMLElement;
              const url = target.getAttribute('data-url');
              if (url) window.open(url, '_blank');
            };
          });
        }, 50);

      } else {
        appendMessage("Sorry, something went wrong. Please try again.", "ai");
      }
    }
  );
}

// Modified to accept a specific URL rather than always grabbing window.location.href
const performSaveWithUrl = (url: string) => {
  if (isLoading) return;
  
  isLoading = true;
  div.textContent = "↻";
  div.classList.add('recallr-loading');
  
  chrome.runtime.sendMessage(
    { type: "save", url: url }, 
    (response) => {
      isLoading = false;
      div.classList.remove('recallr-loading');
      div.textContent = "Re";
      
      if (response?.ok) {
        alert("Saved to Recallr!");
      } else {
        alert("Save failed: " + response?.error);
      }
    }
  );
}

div.onclick = () => {
  if (isLoading) return;
  
  if (menuOpen) {
    closeMenu();
  } else {
    openRadialMenu();
  }
};

// Close menus when clicking outside
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (target && target !== div && !target.closest('#recallr-radial-menu') && !target.closest('#recallr-chat-panel') && !target.closest('#recallr-save-panel')) {
    closeMenu();
  }
});

document.body.appendChild(div);