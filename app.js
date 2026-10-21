
const app = document.querySelector("#app");

const registrations = [];

function render() {
  app.innerHTML = `
    <span class="label">Workshop registration</span>

    <h2>Build better Git habits</h2>

    <form id="form" class="stack" novalidate>

      <label for="name">
        Name
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          autocomplete="name"
          aria-describedby="name-error"
          required
        />
        <span id="name-error" class="error-message"></span>
      </label>

      <label for="email">
        Email
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
          aria-describedby="email-error"
          required
        />
        <span id="email-error" class="error-message"></span>
      </label>

      <label for="track">
        Track
        <select id="track" name="track" required>
          <option>Beginner</option>
          <option>Intermediate</option>
        </select>
      </label>

      <button type="submit">Reserve my place</button>

    </form>

    <div
      id="notice"
      class="muted small"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    ></div>

    <div class="list"></div>
  `;

  const form = document.querySelector("#form");
  const notice = document.querySelector("#notice");
  const list = document.querySelector(".list");

  // Render participant data safely.
  registrations.forEach(registration => {
    const article = document.createElement("article");
    article.className = "item";

    const name = document.createElement("strong");
    name.textContent = registration.name;

    const track = document.createElement("span");
    track.className = "pill";
    track.textContent = registration.track;

    article.append(name, track);
    list.appendChild(article);
  });

  function showError(input, message) {
    const error = document.querySelector(
      `#${input.id}-error`
    );

    input.setAttribute("aria-invalid", "true");

    error.textContent = message;
  }

  function clearError(input) {
    const error = document.querySelector(
      `#${input.id}-error`
    );

    input.removeAttribute("aria-invalid");

    error.textContent = "";
  }

  const nameInput = form.elements.name;
  const emailInput = form.elements.email;

  // Clear errors when the user edits the field.
  [nameInput, emailInput].forEach(input => {
    input.addEventListener("input", () => {
      clearError(input);
    });
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const track = form.elements.track.value;

    let firstInvalid = null;

    clearError(nameInput);
    clearError(emailInput);

    notice.textContent = "";
    notice.className = "muted small";

    // Name validation
    if (!name) {
      showError(nameInput, "Name is required.");
      firstInvalid = nameInput;
    }

    // Email validation
    if (!email) {
      showError(emailInput, "Email is required.");

      if (!firstInvalid) {
        firstInvalid = emailInput;
      }
    } else if (!emailInput.validity.valid) {
      showError(emailInput, "Enter a valid email address.");

      if (!firstInvalid) {
        firstInvalid = emailInput;
      }
    }

    // Stop registration when validation fails.
    if (firstInvalid) {
      notice.textContent =
        "Please correct the highlighted fields.";

      notice.className = "danger-text small";

      firstInvalid.focus();
      return;
    }

    // Validate track selection.
    if (!["Beginner", "Intermediate"].includes(track)) {
      notice.textContent = "Please select a valid track.";
      notice.className = "danger-text small";
      form.elements.track.focus();
      return;
    }

    // Successful registration
    registrations.push({
      name,
      email,
      track
    });

    // Clear the form without destroying the notice.
    form.reset();

    // Add the new participant safely.
    const article = document.createElement("article");
    article.className = "item";

    const strong = document.createElement("strong");
    strong.textContent = name;

    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = track;

    article.append(strong, pill);
    list.appendChild(article);

    // Confirmation remains visible.
    notice.textContent = `Reserved for ${name}.`;
    notice.className = "ok small";
  });
}

render();
