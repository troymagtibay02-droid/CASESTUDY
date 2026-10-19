// ===== Shared helpers for every page =====
var page = document.body.dataset.page;
var DB_KEY_EMP = "mc3d_employees_db";
var DB_KEY_ATT = "mc3d_attendance_db";

// Sample employees (only used the very first time)
if (!localStorage.getItem(DB_KEY_EMP)) {
  localStorage.setItem(DB_KEY_EMP, JSON.stringify([
    { id: "E001", name: "Juan Dela Cruz", age: 28, position: "Manager" },
    { id: "E002", name: "Maria Santos", age: 24, position: "Cashier" },
    { id: "E003", name: "Mark Reyes", age: 22, position: "Technician" }
  ]));
}

function getEmployees() { return JSON.parse(localStorage.getItem(DB_KEY_EMP)) || []; }
function getAttendance() { return JSON.parse(localStorage.getItem(DB_KEY_ATT)) || []; }
function saveAttendance(list) { localStorage.setItem(DB_KEY_ATT, JSON.stringify(list)); }

function getPassword(id) {
  var all = JSON.parse(localStorage.getItem("mc3d_passwords")) || {};
  return all[id] || "mc3d123"; // default password
}
function setPassword(id, pw) {
  var all = JSON.parse(localStorage.getItem("mc3d_passwords")) || {};
  all[id] = pw;
  localStorage.setItem("mc3d_passwords", JSON.stringify(all));
}

function today() {
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function timeNow() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }

function safe(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
function msg(elId, text, type) {
  var el = document.getElementById(elId);
  el.textContent = text;
  el.className = type;
}

// ===== Login guard =====
var role = sessionStorage.getItem("mc3d_role");
if (page !== "login") {
  if (!role) window.location.href = "login.html";
  else if (document.body.dataset.role === "manager" && role !== "manager") window.location.href = "profile.html";
}
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

// ===== Sidebar (different links for manager and employee) =====
function buildSidebar() {
  var bar = document.getElementById("sidebar");
  if (!bar) return;
  var links = role === "manager"
    ? [["index.html", "dashboard", "Dashboard"], ["employees.html", "employees", "Manage Employees"],
       ["attendance.html", "attendance", "Attendance"], ["reports.html", "reports", "Reports"], ["profile.html", "profile", "My Profile"]]
    : [["profile.html", "profile", "My Profile"]];
  var html = '<div class="logo">MC<span>3D</span></div>';
  for (var i = 0; i < links.length; i++) {
    html += '<a href="' + links[i][0] + '"' + (links[i][1] === page ? ' class="active"' : "") + ">" + links[i][2] + "</a>";
  }
  bar.innerHTML = html + '<a href="#" class="logout" onclick="logout()">Logout</a>';
}
if (page !== "login") {
  buildSidebar();
  var names = document.querySelectorAll(".username");
  for (var n = 0; n < names.length; n++) names[n].textContent = sessionStorage.getItem("mc3d_user");
}
