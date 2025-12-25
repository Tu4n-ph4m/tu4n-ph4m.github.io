document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('messages');
    
    // 1. Hide the Key Input (We don't need it anymore!)
    const keyContainer = document.getElementById('key-container');
    if (keyContainer) keyContainer.style.display = 'none';
    const launcherBtn = document.getElementById('chat-launcher');
    addMessage("Hi, I'm Tuan's assistant. How can I help you today?", 'bot');
    // Toggle Logic: Open and close the chat
    if (launcherBtn) {
        launcherBtn.addEventListener('click', () => {
            if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
                chatWindow.style.display = 'flex'; // Show chat
                launcherBtn.innerHTML = '✖';      // Change icon to X
            } else {
                chatWindow.style.display = 'none'; // Hide chat
                launcherBtn.innerHTML = '💬';      // Change icon back to chat bubble
            }
        });
    }
   
    const BACKEND_URL = "https://chat-backend-97qa.vercel.app/api"; 

    // 3. Handle Sending Messages
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

   async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // Add User Message
        addMessage(text, 'user');
        userInput.value = '';

        // Add Loading Spinner
        const loadingId = addMessage('Thinking...', 'bot');

        try {
            // Send message to backend
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            console.log("Server Response:", data); // Check Console if it fails!

            // Remove loading spinner
            removeMessage(loadingId);

            // Handle different possible response formats
            let botReply = "";
            
            if (data.choices && data.choices[0]) {
                botReply = data.choices[0].message.content;
            } else if (data.candidates && data.candidates[0]) { // Standard Gemini format
                botReply = data.candidates[0].content.parts[0].text;
            } else if (data.text) {
                botReply = data.text;
            } else if (data.content) {
                botReply = data.content;
            } else {
                botReply = "Received unexpected format: " + JSON.stringify(data);
            }

            addMessage(botReply, 'bot');

        } catch (error) {
            removeMessage(loadingId);
            addMessage("Error: Server not responding.", 'bot');
            console.error("Fetch Error:", error);
        }
    }

    // --- Helper Functions ---

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        div.id = 'msg-' + Date.now();
        
        // Add icon for bot
        const iconHtml = sender === 'bot' ? '<div class="avatar"><i class="fas fa-robot"></i></div>' : '';
        
        div.innerHTML = `
            ${iconHtml}
            <div class="text">${text}</div>
        `;
        
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return div.id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
});
const assistant = document.getElementById("assistant");
const barForm = document.getElementById("assistant-bar");
const input = document.getElementById("assistant-input");
const closeBtn = document.getElementById("assistant-close");

// Use your existing "messages" container and your existing send logic
// Example: a function you already have like sendMessage(text)
function openAssistant() {
  assistant.classList.add("open");
}
function closeAssistant() {
  assistant.classList.remove("open");
}

barForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  openAssistant();

  // Call your existing send function here:
  // sendMessage(text);
  // If your existing code depends on #user-input, either refactor it to accept "text"
  // or temporarily set that field's value and trigger the existing handler.

  input.value = "";
});

closeBtn.addEventListener("click", closeAssistant);

// Optional: ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAssistant();
});
