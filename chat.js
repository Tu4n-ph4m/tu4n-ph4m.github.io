document.addEventListener("DOMContentLoaded", () => {
  const barForm = document.getElementById("assistant-bar");
  const input = document.getElementById("assistant-input");
  const messagesContainer = document.getElementById("messages");

  if (!barForm || !input || !messagesContainer) {
    console.warn("Assistant elements missing:", { barForm, input, messagesContainer });
    return;
  }

  const BACKEND_URL = "https://chat-backend-97qa.vercel.app/api";
  let isSending = false;

  barForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (isSending) return;

    const raw = input.value;
    const text = raw.trim();
    if (!text) return;

    isSending = true;
    input.disabled = true;
    input.value = "";

    try {
      await sendMessage(text);
    } catch (err) {
      input.value = raw; // restore draft on failure
      console.error("Assistant send error:", err);
    } finally {
      isSending = false;
      input.disabled = false;
      input.focus();
    }
  });

  async function sendMessage(text) {
    addMessage(text, "user");
    const loadingId = addMessage("Thinking...", "bot");

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    if (!response.ok) {
      removeMessage(loadingId);
      addMessage(`Error: server returned ${response.status}.`, "bot");
      throw new Error(`Backend error ${response.status}`);
    }

    const data = await response.json();
    removeMessage(loadingId);

    const botReply =
      data?.choices?.[0]?.message?.content ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.text ||
      data?.content ||
      "Received an unexpected response format.";

    addMessage(botReply, "bot");
  }

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    div.id = "msg-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    div.innerHTML = `<div class="text">${escapeHtml(text)}</div>`;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return div.id;
  }

  function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
