/* script.js
   Handles:
   - add / edit / delete student records
   - validation
   - localStorage persistence
   - dynamic vertical scrollbar toggled by JS when rows exceed threshold
*/

/* ===== Constants & DOM ===== */
const STUDENTS_KEY = 'students_data_v1';
const form = document.getElementById('student-form');
const nameEl = document.getElementById('name');
const studentIdEl = document.getElementById('studentId');
const emailEl = document.getElementById('email');
const contactEl = document.getElementById('contact');
const submitBtn = document.getElementById('submit-btn');
const clearBtn = document.getElementById('clear-btn');
const studentsBody = document.getElementById('students-body');
const displayMessage = document.getElementById('display-message');
const formMessage = document.getElementById('form-message');
const clearStorageBtn = document.getElementById('clear-storage');
const tableWrapper = document.getElementById('table-wrapper');

/* Edit state */
let editIndex = null;

/* Load initial data and render */
let students = loadStudents();
renderTable();

/* ===== Event Listeners ===== */
form.addEventListener('submit', onFormSubmit);
clearBtn.addEventListener('click', resetForm);
clearStorageBtn.addEventListener('click', clearAllRecords);

/* Input constraints: prevent non-digits for numeric fields */
studentIdEl.addEventListener('input', e => {
  // allow only digits
  e.target.value = e.target.value.replace(/\D/g, '');
});
contactEl.addEventListener('input', e => {
  e.target.value = e.target.value.replace(/\D/g, '');
});
nameEl.addEventListener('input', e => {
  // allow letters, spaces, hyphen, apostrophe
  e.target.value = e.target.value.replace(/[^a-zA-Z\s'\-]/g, '');
});

/* ===== Functions ===== */

function loadStudents() {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading students from localStorage', err);
    return [];
  }
}

function saveStudents() {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

function renderTable() {
  studentsBody.innerHTML = '';
  if (students.length === 0) {
    displayMessage.textContent = 'No records yet. Add a student using the form.';
    removeTableScrolling();
    return;
  }
  displayMessage.textContent = '';

  students.forEach((s, idx) => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td'); tdName.textContent = s.name;
    const tdId = document.createElement('td'); tdId.textContent = s.studentId;
    const tdEmail = document.createElement('td'); tdEmail.textContent = s.email;
    const tdContact = document.createElement('td'); tdContact.textContent = s.contact;

    const tdActions = document.createElement('td');
    tdActions.classList.add('actions-col');

    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEdit(idx));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteRecord(idx));

    tdActions.appendChild(editBtn);
    tdActions.appendChild(deleteBtn);

    tr.appendChild(tdName);
    tr.appendChild(tdId);
    tr.appendChild(tdEmail);
    tr.appendChild(tdContact);
    tr.appendChild(tdActions);

    studentsBody.appendChild(tr);
  });

  // After rendering, decide if we need the vertical scrollbar
  adjustTableScrolling();
}

/* Form submit handler for Add / Update */
function onFormSubmit(e) {
  e.preventDefault();
  clearMessages();

  const payload = {
    name: nameEl.value.trim(),
    studentId: studentIdEl.value.trim(),
    email: emailEl.value.trim(),
    contact: contactEl.value.trim()
  };

  const validation = validate(payload);
  if (!validation.valid) {
    showFormMessage(validation.message, true);
    return;
  }

  if (editIndex !== null) {
    // Update existing record
    students[editIndex] = payload;
    saveStudents();
    renderTable();
    showFormMessage('Record updated successfully.');
    submitBtn.textContent = 'Add Student';
    editIndex = null;
    form.reset();
  } else {
    // Prevent duplicate studentId (optional but useful)
    if (students.some(s => s.studentId === payload.studentId)) {
      showFormMessage('Student ID must be unique. A record with this Student ID already exists.', true);
      return;
    }
    students.push(payload);
    saveStudents();
    renderTable();
    showFormMessage('Student added successfully.');
    form.reset();
  }
}

/* Validation logic */
function validate({ name, studentId, email, contact }) {
  if (!name || !studentId || !email || !contact) {
    return { valid: false, message: 'All fields are required. Please fill in every field.' };
  }

  // Name: letters, spaces, basic punctuation
  if (!/^[a-zA-Z\s'\-]{2,60}$/.test(name)) {
    return { valid: false, message: 'Name must contain only letters, spaces, hyphens, or apostrophes (2-60 chars).' };
  }
  // studentId: digits only
  if (!/^\d{1,20}$/.test(studentId)) {
    return { valid: false, message: 'Student ID must contain only digits.' };
  }
  // email: basic RFC-like validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }
  // contact: digits only, length >=10
  if (!/^\d{10,15}$/.test(contact)) {
    return { valid: false, message: 'Contact number must be digits only and at least 10 digits.' };
  }

  return { valid: true };
}

/* Start editing a record */
function startEdit(index) {
  const s = students[index];
  nameEl.value = s.name;
  studentIdEl.value = s.studentId;
  emailEl.value = s.email;
  contactEl.value = s.contact;
  submitBtn.textContent = 'Save Update';
  editIndex = index;
  // scroll form into view on small screens
  nameEl.focus();
  showFormMessage('Editing record — make changes and click "Save Update".');
}

/* Delete one record */
function deleteRecord(index) {
  if (!confirm('Delete this record? This action cannot be undone.')) return;
  students.splice(index, 1);
  saveStudents();
  renderTable();
  showDisplayMessage('Record deleted.');
}

/* Clear all records from UI and storage */
function clearAllRecords() {
  if (!confirm('Clear all records from localStorage? This action cannot be undone.')) return;
  students = [];
  saveStudents();
  renderTable();
  showDisplayMessage('All records cleared.');
}

/* Reset the form and edit state */
function resetForm() {
  form.reset();
  editIndex = null;
  submitBtn.textContent = 'Add Student';
  clearMessages();
}

/* Messages */
function showFormMessage(msg, isError = false) {
  formMessage.textContent = msg;
  formMessage.style.color = isError ? '#b00020' : '#0b6623';
}
function showDisplayMessage(msg) {
  displayMessage.textContent = msg;
  setTimeout(() => { displayMessage.textContent = ''; }, 2800);
}
function clearMessages() {
  formMessage.textContent = '';
}

/* ===== Dynamic vertical scrollbar logic =====
   Add scrollbar when number of rows exceeds threshold OR when table body height exceeds wrapper
*/
const ROW_THRESHOLD = 5;

function adjustTableScrolling() {
  const rows = studentsBody.querySelectorAll('tr').length;
  // If rows exceed threshold -> enable scrolling
  if (rows > ROW_THRESHOLD) {
    enableTableScrolling();
    return;
  }

  // Otherwise make sure scrolling removed
  // but also check real measured height vs wrapper height for small screens
  removeTableScrolling();
}

function enableTableScrolling() {
  tableWrapper.classList.add('table-scroll-enabled');
  // ensure the wrapper's max-height feels good on mobile
  // (class in CSS already sets max-height:300px)
}

function removeTableScrolling() {
  tableWrapper.classList.remove('table-scroll-enabled');
}

/* Accessibility: keyboard shortcuts (optional) */
/* Press Escape to cancel editing / clear messages */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') resetForm();
});

/* End of script.js */
