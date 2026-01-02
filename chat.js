// Enter-only submission (explicit + deterministic)
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    barForm.requestSubmit();
  }
});

let isSending = false;

// Submit handler for the search-bar style assistant
barForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isSending) return;

  const raw = input.value;
  const text = raw.trim();
  if (!text) return;

  isSending = true;
  input.disabled = true;

  // Clear immediately (since Enter is your intentional submit)
  input.value = "";

  try {
    await sendMessage(text);
  } catch (err) {
    // Restore the draft so it doesn't "disappear" on failure
    input.value = raw;
    console.error("Assistant send error:", err);
  } finally {
    isSending = false;
    input.disabled = false;
    input.focus();
  }
});

async function sendMessage(text) {
  // User message
  addMessage(text, "user");

  // Loading placeholder
  const loadingId = addMessage("Thinking...", "bot");

  let response;
  try {
    response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
  } catch (err) {
    removeMessage(loadingId);
    addMessage("Error: network issue (could not reach server).", "bot");
    throw err;
  }

  // Handle non-2xx responses explicitly (fetch does not throw on HTTP errors)
  if (!response.ok) {
    removeMessage(loadingId);
    addMessage(`Error: server returned ${response.status}.`, "bot");
    throw new Error(`Backend error ${response.status}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    removeMessage(loadingId);
    addMessage("Error: server returned invalid JSON.", "bot");
    throw err;
  }

  removeMessage(loadingId);

  // Robust parsing across common formats
  const botReply =
    data?.choices?.[0]?.message?.content ||
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    data?.text ||
    data?.content ||
    "Received an unexpected response format.";

  addMessage(botReply, "bot");
}
