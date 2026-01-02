  // Submit handler for the search-bar style assistant
  barForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const raw = input.value;           // preserve what the user typed
    const text = raw.trim();
    if (!text) return;

    // Prevent accidental double-submit / Enter spam
    input.disabled = true;

    // Option A: clear only after we’ve queued the UI message
    // (If you prefer: clear only after backend success, see below.)
    input.value = "";

    try {
      await sendMessage(text);
    } catch (err) {
      // If something went wrong, restore the draft so it doesn’t “disappear”
      input.value = raw;
      console.error(err);
    } finally {
      input.disabled = false;
      input.focus();
    }
  });

  async function sendMessage(text) {
    // User message
    addMessage(text, "user");

    // Loading placeholder
    const loadingId = addMessage("Thinking...", "bot");

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    // Handle non-2xx responses explicitly (fetch does not throw on HTTP errors)
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
