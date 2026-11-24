// Shared contact form handler (Web3Forms).
// 1. Go to https://web3forms.com, enter your email, and copy the access key it emails you.
// 2. Paste it below. That's the only setup needed.
const WEB3FORMS_KEY = "06fac51a-272a-4c85-8976-9fa25891a152";

document.querySelectorAll("form[data-contact]").forEach((form) => {
  const status = form.querySelector("[data-status]");
  const button = form.querySelector("button[type=submit]");
  const say = (msg, state) => {
    if (!status) return;
    status.textContent = msg;
    status.dataset.state = state;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.querySelector("[name=botcheck]")?.checked) return;

    if (WEB3FORMS_KEY.startsWith("YOUR_")) {
      say("Form not connected yet — add the Web3Forms key in assets/contact.js.", "error");
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    data.access_key = WEB3FORMS_KEY;
    data.subject = `New message from ${data.name || "your site"}`;
    data.from_name = "leozdzd.github.io";

    button.disabled = true;
    say("Sending…", "pending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      form.reset();
      say("Sent. I'll get back to you soon.", "ok");
    } catch (err) {
      say("Something went wrong — try again, or reach me on LinkedIn.", "error");
    } finally {
      button.disabled = false;
    }
  });
});
