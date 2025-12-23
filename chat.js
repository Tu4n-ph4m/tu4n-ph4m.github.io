document.addEventListener('DOMContentLoaded', () => {
    const keyContainer = document.getElementById('key-container');
    const chatWindow = document.getElementById('chat-window');
    const apiKeyInput = document.getElementById('api-key');
    const saveKeyBtn = document.getElementById('save-key-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('messages');

    let apiKey = '';

    // 1. Handle API Key Entry
    saveKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key.startsWith('sk-')) {
            apiKey = key;
            keyContainer.style.display = 'none';
            chatWindow.style.display = 'flex';
        } else {
            alert('Please enter a valid OpenAI API Key (starts with sk-...)');
        }
    });

    // 2. Handle Sending Messages
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // Add User Message to UI
        addMessage(text, 'user');
        userInput.value = '';

        // Add Loading Spinner
        const loadingId = addMessage('Thinking...', 'bot', true);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system", 
                            content: "You are a helpful portfolio assistant for Tu4n-ph4m. You answer questions about his skills (HTML, CSS, JS, React, Python), his projects, and his background. Be concise, professional, and friendly."
                        },
                        { role: "user", content: text }
                    ]
                })
            });

            const data = await response.json();
            
            // Remove loading spinner
            removeMessage(loadingId);

            if (data.error) {
                addMessage("Error: " + data.error.message, 'bot');
            } else {
                const botReply = data.choices[0].message.content;
                addMessage(botReply, 'bot');
            }

        } catch (error) {
            removeMessage(loadingId);
            addMessage("Error connecting to AI.", 'bot');
            console.error(error);
        }
    }

    // Helper: Add Message to UI
    function addMessage(text, sender, isLoading = false) {
        const div = document.createElement('div');
        div.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        const id = 'msg-' + Date.now();
        div.id = id;

        div.innerHTML = `
            ${sender === 'bot' ? '<div class="avatar"><i class="fas fa-robot"></i></div>' : ''}
            <div class="text">${text}</div>
        `;
        
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
});
