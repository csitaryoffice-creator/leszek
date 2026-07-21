const STORAGE_KEY = "leszek_bookings_v1";
const SESSION_KEY = "leszek_admin_session";
const USER_HASH = "2cc43cad7b4f59df14ae3892c85f4f13a0c871c300cf5f1bc3284684f085e7d0";
const USER_HASH_WITH_PERIOD = "d1a3701d244605ef5fd32a97ed52e5fd7153e812e5ebc2378aad112cbba9b833";
const PASSWORD_HASH = "0a83fa95e4dcc1f2e6d5168ae8d7585a2a718d1f9dabc6a7b08c60571219ed92";

const statusLabels = {
  pending: "Új igény",
  confirmed: "Visszaigazolt",
  completed: "Teljesült",
  cancelled: "Lemondott"
};

const loginSection = document.querySelector("#admin-login");
const dashboard = document.querySelector("#admin-dashboard");
const loginForm = document.querySelector("#admin-login-form");
const loginError = document.querySelector("#admin-login-error");
const rows = document.querySelector("#admin-booking-rows");
const emptyState = document.querySelector("#admin-empty");
const dialog = document.querySelector("#booking-dialog");
const bookingForm = document.querySelector("#admin-booking-form");
const deleteDialog = document.querySelector("#delete-dialog");
let pendingDeleteId = null;

function readBookings() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
  })[character]);
}

async function sha256(value) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function formatMoney(value) {
  return new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "Nincs dátum";
  return new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function filteredBookings() {
  const search = document.querySelector("#admin-search").value.trim().toLocaleLowerCase("hu-HU");
  const status = document.querySelector("#admin-status-filter").value;
  const date = document.querySelector("#admin-date-filter").value;
  return readBookings()
    .filter((booking) => status === "all" || booking.status === status)
    .filter((booking) => !date || booking.date === date)
    .filter((booking) => {
      if (!search) return true;
      return [booking.id, booking.name, booking.email, booking.phone, booking.room, booking.activity]
        .some((value) => String(value || "").toLocaleLowerCase("hu-HU").includes(search));
    })
    .sort((a, b) => `${a.date || ""}T${a.time || ""}`.localeCompare(`${b.date || ""}T${b.time || ""}`));
}

function renderStats(bookings) {
  const today = new Date().toISOString().slice(0, 10);
  document.querySelector("#stat-all").textContent = bookings.length;
  document.querySelector("#stat-pending").textContent = bookings.filter((item) => item.status === "pending").length;
  document.querySelector("#stat-confirmed").textContent = bookings.filter((item) => item.status === "confirmed").length;
  document.querySelector("#stat-today").textContent = bookings.filter((item) => item.date === today).length;
}

function renderBookings() {
  const allBookings = readBookings();
  const bookings = filteredBookings();
  renderStats(allBookings);
  emptyState.hidden = bookings.length > 0;
  rows.innerHTML = bookings.map((booking) => `
    <tr>
      <td data-label="Időpont"><strong>${escapeHtml(formatDate(booking.date))}</strong><span>${escapeHtml(booking.time || "")} · ${escapeHtml(booking.duration || 1)} óra</span><small>${escapeHtml(booking.id)}</small></td>
      <td data-label="Terem"><strong>${escapeHtml(booking.room)}</strong><span>${escapeHtml(booking.activity || "Nincs megadva")}</span></td>
      <td data-label="Kapcsolattartó"><strong>${escapeHtml(booking.name)}</strong><a href="mailto:${escapeHtml(booking.email)}">${escapeHtml(booking.email)}</a><a href="tel:${escapeHtml(booking.phone)}">${escapeHtml(booking.phone)}</a></td>
      <td data-label="Létszám">${escapeHtml(booking.participants || 1)} fő</td>
      <td data-label="Összeg"><strong>${escapeHtml(formatMoney(booking.total))}</strong></td>
      <td data-label="Státusz"><select class="admin-status-select status-${escapeHtml(booking.status)}" data-status-id="${escapeHtml(booking.id)}" aria-label="${escapeHtml(booking.name)} foglalási státusza">${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}" ${booking.status === value ? "selected" : ""}>${label}</option>`).join("")}</select></td>
      <td data-label="Műveletek"><div class="admin-row-actions"><button type="button" data-edit-id="${escapeHtml(booking.id)}">Szerkesztés</button><button class="danger" type="button" data-delete-id="${escapeHtml(booking.id)}">Törlés</button></div></td>
    </tr>
  `).join("");
}

function openDialog(booking = null) {
  bookingForm.reset();
  document.querySelector("#admin-booking-error").textContent = "";
  document.querySelector("#booking-dialog-title").textContent = booking ? "Foglalás szerkesztése" : "Új foglalás";
  document.querySelector("#admin-booking-id").value = booking?.id || "";
  document.querySelector("#admin-room").value = booking?.room || "MAG";
  document.querySelector("#admin-status").value = booking?.status || "pending";
  document.querySelector("#admin-date").value = booking?.date || new Date().toISOString().slice(0, 10);
  document.querySelector("#admin-time").value = booking?.time || "10:00";
  document.querySelector("#admin-duration").value = booking?.duration || 1;
  document.querySelector("#admin-participants").value = booking?.participants || 1;
  document.querySelector("#admin-name").value = booking?.name || "";
  document.querySelector("#admin-email").value = booking?.email || "";
  document.querySelector("#admin-phone").value = booking?.phone || "";
  document.querySelector("#admin-total").value = booking?.total || 4000;
  document.querySelector("#admin-activity").value = booking?.activity || "";
  document.querySelector("#admin-notes").value = booking?.notes || "";
  dialog.showModal();
}

function closeDialog() {
  dialog.close();
}

function showDashboard() {
  loginSection.hidden = true;
  dashboard.hidden = false;
  renderBookings();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";
  const username = document.querySelector("#admin-username").value;
  const password = document.querySelector("#admin-password").value;
  const [userHash, passwordHash] = await Promise.all([sha256(username), sha256(password)]);
  if (![USER_HASH, USER_HASH_WITH_PERIOD].includes(userHash) || passwordHash !== PASSWORD_HASH) {
    loginError.textContent = "Hibás felhasználónév vagy jelszó.";
    document.querySelector("#admin-password").focus();
    return;
  }
  sessionStorage.setItem(SESSION_KEY, "active");
  showDashboard();
});

document.querySelector("#admin-logout").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  dashboard.hidden = true;
  loginSection.hidden = false;
  loginForm.reset();
  document.querySelector("#admin-username").focus();
});

document.querySelector("#admin-new-booking").addEventListener("click", () => openDialog());
document.querySelector("#admin-dialog-close").addEventListener("click", closeDialog);
document.querySelector("#admin-dialog-cancel").addEventListener("click", closeDialog);
document.querySelectorAll("#admin-search, #admin-status-filter, #admin-date-filter").forEach((control) => control.addEventListener("input", renderBookings));

rows.addEventListener("change", (event) => {
  const select = event.target.closest("[data-status-id]");
  if (!select) return;
  const bookings = readBookings();
  const booking = bookings.find((item) => item.id === select.dataset.statusId);
  if (booking) booking.status = select.value;
  writeBookings(bookings);
  renderBookings();
});

rows.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-id]");
  const deleteButton = event.target.closest("[data-delete-id]");
  if (editButton) {
    const booking = readBookings().find((item) => item.id === editButton.dataset.editId);
    if (booking) openDialog(booking);
  }
  if (deleteButton) {
    pendingDeleteId = deleteButton.dataset.deleteId;
    deleteDialog.showModal();
  }
});

document.querySelector("#delete-dialog-cancel").addEventListener("click", () => {
  pendingDeleteId = null;
  deleteDialog.close();
});

document.querySelector("#delete-dialog-confirm").addEventListener("click", () => {
  if (pendingDeleteId) {
    writeBookings(readBookings().filter((item) => item.id !== pendingDeleteId));
    renderBookings();
  }
  pendingDeleteId = null;
  deleteDialog.close();
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    document.querySelector("#admin-booking-error").textContent = "Kérjük, tölts ki minden kötelező mezőt.";
    return;
  }
  const existingId = document.querySelector("#admin-booking-id").value;
  const bookings = readBookings();
  const existingIndex = bookings.findIndex((item) => item.id === existingId);
  const booking = {
    id: existingId || `LESZEK-${Date.now().toString(36).toUpperCase()}`,
    createdAt: existingIndex >= 0 ? bookings[existingIndex].createdAt : new Date().toISOString(),
    room: document.querySelector("#admin-room").value,
    status: document.querySelector("#admin-status").value,
    date: document.querySelector("#admin-date").value,
    time: document.querySelector("#admin-time").value,
    duration: Number(document.querySelector("#admin-duration").value),
    participants: Number(document.querySelector("#admin-participants").value),
    name: document.querySelector("#admin-name").value.trim(),
    email: document.querySelector("#admin-email").value.trim(),
    phone: document.querySelector("#admin-phone").value.trim(),
    total: Number(document.querySelector("#admin-total").value),
    activity: document.querySelector("#admin-activity").value.trim(),
    notes: document.querySelector("#admin-notes").value.trim(),
    updatedAt: new Date().toISOString()
  };
  if (existingIndex >= 0) bookings[existingIndex] = booking;
  else bookings.push(booking);
  writeBookings(bookings);
  closeDialog();
  renderBookings();
});

document.querySelector("#admin-export").addEventListener("click", () => {
  const bookings = filteredBookings();
  const columns = ["Azonosító", "Dátum", "Kezdés", "Időtartam", "Terem", "Név", "E-mail", "Telefon", "Létszám", "Foglalkozás", "Összeg", "Státusz", "Megjegyzés"];
  const rows = bookings.map((item) => [item.id, item.date, item.time, item.duration, item.room, item.name, item.email, item.phone, item.participants, item.activity, item.total, statusLabels[item.status], item.notes]);
  const csv = [columns, ...rows].map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
  link.download = `leszek-foglalasok-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
});

if (sessionStorage.getItem(SESSION_KEY) === "active") showDashboard();
