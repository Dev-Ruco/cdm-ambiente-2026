const eventDate = new Date("2026-09-30T14:00:00+02:00");
const $ = (id) => document.getElementById(id);

function updateCountdown(){
  const now = new Date();
  let diff = Math.max(0, eventDate - now);
  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);
  $("days").textContent = String(days).padStart(2,"0");
  $("hours").textContent = String(hours).padStart(2,"0");
  $("minutes").textContent = String(minutes).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown,60000);

const form = $("registrationForm");
const modal = $("successModal");
const codeEl = $("registrationCode");
const statusEl = $("formStatus");

function createCode(){
  const n = Math.floor(100000 + Math.random() * 900000);
  return "CDM-" + n;
}

function getRegistrations(){
  try { return JSON.parse(localStorage.getItem("cdm_registrations") || "[]"); }
  catch { return []; }
}

function saveRegistration(data){
  const all = getRegistrations();
  const duplicate = all.find(x => String(x.email).toLowerCase() === String(data.email).toLowerCase());
  if(duplicate) return { duplicate:true, code:duplicate.code };
  const record = {...data, code:createCode(), createdAt:new Date().toISOString()};
  all.push(record);
  localStorage.setItem("cdm_registrations", JSON.stringify(all));
  return { duplicate:false, code:record.code };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  statusEl.textContent = "A registar...";
  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());
  const result = saveRegistration(payload);
  codeEl.textContent = result.code;
  statusEl.textContent = result.duplicate ? "Já existia uma inscrição com este e-mail." : "";
  modal.classList.add("active");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
  if(!result.duplicate) form.reset();
});

document.querySelectorAll("[data-close-modal]").forEach(el => {
  el.addEventListener("click", () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
  });
});

document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && modal.classList.contains("active")){
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
  }
});
