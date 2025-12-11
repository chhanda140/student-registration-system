# student-registration-system

## Overview
A simple Student Registration System that allows adding, editing and deleting student records. Data persists in browser `localStorage` so records remain after refreshing the page.

### Features
- Add student with: Name, Student ID, Email, Contact number
- Edit existing records inline
- Delete single records
- Clear all records
- Input validation:
  - Name: letters, spaces, hyphen, apostrophe (2–60 chars)
  - Student ID: digits only
  - Email: basic valid email pattern
  - Contact: digits only, minimum 10 digits
- Prevents adding empty rows and duplicate Student IDs
- Dynamic vertical scrollbar: JavaScript toggles a scrollable table container when rows exceed a threshold
- Fully responsive for mobile (≤640px), tablet (641–1024px) and desktop (≥1025px)

## Folder structure
student-registration-system/
├── index.html
├── style.css
├── script.js
└── README.md


> Only `assets/` may be added if you need images. Avoid nested folders for code files to comply with submission rules.

## How to run
1. Clone or download the folder.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).
3. Use the form on the left (or top on mobile) to add student records.

## Commit instructions (important for assignment)
Make **separate commits** for:
1. `index.html`
2. `style.css`
3. `script.js`
4. `README.md`

A single combined commit for everything will lead to mark deductions per the assignment instructions.

Example:
```bash
git init
git add index.html
git commit -m "Add index.html - basic structure and form"
git add style.css
git commit -m "Add style.css - responsive styles and layout"
git add script.js
git commit -m "Add script.js - add/edit/delete, validation, localStorage"
git add README.md
git commit -m "Add README.md - project overview and run instructions"
