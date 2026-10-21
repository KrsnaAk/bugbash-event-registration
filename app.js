const app = document.querySelector("#app");
const registrations = [];
const TRACKS = ["Beginner", "Intermediate"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

function render() {
  app.innerHTML = `<span class="label">Workshop registration</span><h2>Build better Git habits</h2>
<form id="form" class="stack" novalidate>
  <label>Name<input name="name" placeholder="Your name" autocomplete="name" required aria-required="true" aria-describedby="name-error"/></label>
  <small id="name-error" class="small" role="alert" style="color:#dc2626"></small>
  <label>Email<input name="email" type="email" placeholder="you@example.com" autocomplete="email" required aria-required="true" aria-describedby="email-error"/></label>
  <small id="email-error" class="small" role="alert" style="color:#dc2626"></small>
  <label>Track<select name="track" aria-describedby="track-error">${TRACKS.map((t) => `<option>${t}</option>`).join("")}</select></label>
  <small id="track-error" class="small" role="alert" style="color:#dc2626"></small>
  <button type="submit">Reserve my place</button>
</form>
<div id="notice" class="muted small" role="status" aria-live="polite"></div>
<div id="list" class="list"></div>`;

  const form = document.querySelector("#form");
  const notice = document.querySelector("#notice");

  form.onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const data = {
      name: String(f.get("name") || "").trim(),
      email: String(f.get("email") || "").trim(),
      track: String(f.get("track") || ""),
    };

    const errors = validate(data);
    showErrors(form, errors);

    if (Object.keys(errors).length) {
      notice.textContent = "";
      const firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      return;
    }

    registrations.push(data);
    form.reset();
    renderList();
    notice.textContent = `Reserved for ${data.name}.`;
    form.querySelector('[name="name"]').focus();
  };

  renderList();
}

function validate(data) {
  const errors = {};
  if (!data.name) errors.name = "Enter your name.";
  if (!data.email) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(data.email))
    errors.email = "Enter a valid email address, like you@example.com.";
  else if (
    registrations.some((r) => r.email.toLowerCase() === data.email.toLowerCase())
  )
    errors.email = "This email is already registered.";
  if (!TRACKS.includes(data.track)) errors.track = "Choose a track.";
  return errors;
}

function showErrors(form, errors) {
  ["name", "email", "track"].forEach((field) => {
    const input = form.querySelector(`[name="${field}"]`);
    const msg = document.querySelector(`#${field}-error`);
    msg.textContent = errors[field] || "";
    if (errors[field]) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  });
}

function renderList() {
  document.querySelector("#list").innerHTML = registrations
    .map(
      (r) =>
        `<article class="item"><strong>${esc(r.name)}</strong><span class="pill">${esc(r.track)}</span></article>`,
    )
    .join("");
}

render();