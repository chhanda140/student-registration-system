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
