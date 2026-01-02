document.addEventListener("DOMContentLoaded", () => {
  const barForm = document.getElementById("assistant-bar");
  const input = document.getElementById("assistant-input");

  if (!barForm || !input) {
    console.warn("Missing assistant-bar or assistant-input.");
    return;
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // requestSubmit is best, but not universal
      if (typeof barForm.requestSubmit === "function") {
        barForm.requestSubmit();
      } else {
        // Fallback: fire submit event manually
        barForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      }
    }
  });

  barForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("SUBMIT FIRED"); // remove after confirming

    // ...your existing submit logic...
  });
});
