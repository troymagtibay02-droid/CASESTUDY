// ===== MC3D Employee Records (localStorage + JSON) =====
var DB_KEY = "mc3d_employees_db";

// Retrieve saved records
var employees = JSON.parse(localStorage.getItem(DB_KEY));

// Initialize sample records if nothing is saved yet
if (!employees) {
  employees = [
    { id: "E001", name: "Juan Dela Cruz", age: 28, position: "Manager" },
    { id: "E002", name: "Maria Santos", age: 24, position: "Cashier" },
    { id: "E003", name: "Mark Reyes", age: 22, position: "Technician" }
  ];
  saveEmployees();
}

var editIndex = -1; // -1 means "adding", otherwise the index being edited

function saveEmployees() {
  localStorage.setItem(DB_KEY, JSON.stringify(employees));
}

function showMessage(text, type) {
  var out = document.getElementById("output");
  out.textContent = text;
  out.className = type;
}

// Escape text so special characters can't break the table
function safe(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Validate the form. Returns true if OK.
function validate(id, name, age, position) {
  if (id === "" || name === "" || age === "" || position === "") {
    showMessage("Please fill in all fields.", "error");
    return false;
  }
  if (isNaN(age) || Number(age) < 18 || Number(age) > 80) {
    showMessage("Age must be a number between 18 and 80.", "error");
    return false;
  }
  for (var i = 0; i < employees.length; i++) {
    if (employees[i].id.toLowerCase() === id.toLowerCase() && i !== editIndex) {
      showMessage("Employee ID already exists.", "error");
      return false;
    }
  }
  return true;
}

function addrecords() {
  if (editIndex !== -1) { updateEmployee(); return; }

  var id = document.getElementById("id").value.trim();
  var name = document.getElementById("name").value.trim();
  var age = document.getElementById("age").value.trim();
  var position = document.getElementById("position").value.trim();

  if (!validate(id, name, age, position)) return;

  employees.push({ id: id, name: name, age: Number(age), position: position });
  saveEmployees();
  displayEmployees();
  resetForm();
  showMessage("Employee added successfully!", "ok");
}

function displayEmployees() {
  var table = document.getElementById("employeeTable");
  table.innerHTML = "";

  var term = document.getElementById("search").value.toLowerCase();
  var shown = 0;

  for (var i = 0; i < employees.length; i++) {
    var e = employees[i];
    var text = (e.id + " " + e.name + " " + e.age + " " + e.position).toLowerCase();
    if (text.indexOf(term) === -1) continue;
    shown++;
    table.innerHTML +=
      "<tr>" +
      "<td>" + safe(employees[i].id) + "</td>" +
      "<td>" + safe(employees[i].name) + "</td>" +
      "<td>" + safe(employees[i].age) + "</td>" +
      "<td>" + safe(employees[i].position) + "</td>" +
      '<td><button class="edit-btn" onclick="editEmployee(' + i + ')">Edit</button>' +
      '<button class="del-btn" onclick="deleteEmployee(' + i + ')">Delete</button></td>' +
      "</tr>";
  }

  if (shown === 0) {
    table.innerHTML = '<tr><td colspan="5" class="empty">No employee records found.</td></tr>';
  }
}

function editEmployee(index) {
  document.getElementById("id").value = employees[index].id;
  document.getElementById("name").value = employees[index].name;
  document.getElementById("age").value = employees[index].age;
  document.getElementById("position").value = employees[index].position;

  editIndex = index;
  document.getElementById("addBtn").textContent = "Update Employee";
  document.getElementById("cancelBtn").style.display = "inline-block";
  showMessage("Editing " + employees[index].name + "...", "ok");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateEmployee() {
  var id = document.getElementById("id").value.trim();
  var name = document.getElementById("name").value.trim();
  var age = document.getElementById("age").value.trim();
  var position = document.getElementById("position").value.trim();

  if (!validate(id, name, age, position)) return;

  employees[editIndex] = { id: id, name: name, age: Number(age), position: position };
  saveEmployees();
  displayEmployees();
  resetForm();
  showMessage("Employee updated successfully!", "ok");
}

function deleteEmployee(index) {
  if (confirm("Are you sure you want to delete " + employees[index].name + "?")) {
    employees.splice(index, 1);
    saveEmployees();
    if (editIndex === index) resetForm();
    else if (editIndex > index) editIndex--;
    displayEmployees();
    showMessage("Employee deleted.", "ok");
  }
}

// Clear the form and restore the button to "Add Employee"
function resetForm() {
  document.getElementById("id").value = "";
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("position").value = "";
  editIndex = -1;
  document.getElementById("addBtn").textContent = "Add Employee";
  document.getElementById("cancelBtn").style.display = "none";
}

displayEmployees();
