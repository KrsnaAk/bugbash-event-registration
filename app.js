const app = document.querySelector("#app");
const registrations = [];
function render() {
  app.innerHTML = `<span class="label">Workshop registration</span><h2>Build better Git habits</h2><form id="form" class="stack"><label>Name<input name="name" placeholder="Your name"/></label><label>Email<input name="email" type="email" placeholder="you@example.com"/></label><label>Track<select name="track"><option>Beginner</option><option>Intermediate</option></select></label><button>Reserve my place</button></form><div id="notice" class="muted small"></div><div class="list">${registrations.map((r) => `<article class="item"><strong>${r.name}</strong><span class="pill">${r.track}</span></article>`).join("")}</div>`;
  document.querySelector("#form").onsubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    registrations.push(data);
    document.querySelector("#notice").textContent =
      `Reserved for ${data.name}.`;
    e.currentTarget.reset();
    render();
  };
}
render();


// Added organizer feature: capacity visibility.
function renderCapacity() {
  const host = document.querySelector("#app"); if (!host || document.querySelector("#capacity")) return;
  const capacity = document.createElement("p"); capacity.id = "capacity"; capacity.className = "muted small";
  capacity.textContent = registrations.length + "/30 places reserved"; host.querySelector("h2")?.after(capacity);
}
renderCapacity();
