document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('messages');
    
    // 1. Hide the Key Input (We don't need it anymore!)
    const keyContainer = document.getElementById('key-container');
    if (keyContainer) keyContainer.style.display = 'none';
    if (chatWindow) chatWindow.style.display = 'flex';

   
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
            // Send message to YOUR Vercel server (not OpenAI directly)
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            // Remove loading spinner
            removeMessage(loadingId);

            if (data.choices && data.choices[0]) {
                // Display the answer from Gemini/Vercel
                addMessage(data.choices[0].message.content, 'bot');
            } else {
                addMessage("Sorry, I'm having trouble connecting.", 'bot');
            }

        } catch (error) {
            removeMessage(loadingId);
            addMessage("Error: Server not responding.", 'bot');
            console.error(error);
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
