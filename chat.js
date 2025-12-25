document.addEventListener("DOMContentLoaded", () => {
  // Optional: hide any old key UI if it exists
  const keyContainer = document.getElementById("key-container");
  if (keyContainer) keyContainer.style.display = "none";

  // Embedded assistant elements (under hero)
  const barForm = document.getElementById("assistant-bar");
  const input = document.getElementById("assistant-input");
  const messagesContainer = document.getElementById("messages");

  // If the embedded assistant isn't on the page, exit gracefully
  if (!barForm || !input || !messagesContainer) {
    console.warn("Assistant canvas elements not found. Check index.html IDs.");
    return;
  }

  const BACKEND_URL = "https://chat-backend-97qa.vercel.app/api";

  // Initial greeting (optional)
  addMessage("Hi, I'm Tuan's assistant. Ask me about my research, projects, or publications.", "bot");

  // Submit handler for the search-bar style assistant
  barForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    sendMessage(text);
    input.value = "";
  });

  async function sendMessage(text) {
    // User message
    addMessage(text, "user");

    // Loading placeholder
    const loadingId = addMessage("Thinking...", "bot");

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      removeMessage(loadingId);

      // Robust parsing across common formats
      const botReply =
        data?.choices?.[0]?.message?.content ||
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.text ||
        data?.content ||
        "Received an unexpected response format.";

      addMessage(botReply, "bot");
    } catch (error) {
      removeMessage(loadingId);
      addMessage("Error: server not responding.", "bot");
      console.error("Fetch Error:", error);
    }
  }

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    div.id = "msg-" + Date.now();

    const iconHtml =
  sender === "bot"
    ? '<div class="avatar"><i class="fas fa-network-wired"></i></div>'
    : "";


    div.innerHTML = `
      ${iconHtml}
      <div class="text">${escapeHtml(text)}</div>
    `;

    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return div.id;
  }

  function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // Prevent HTML injection if backend returns markup
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
