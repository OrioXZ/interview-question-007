# Interview Question 007

This repository contains the implementation for **Interview Question 007**.

The submitted feature is the **IT07 - QR Product Codes** page.

## Overview

The application provides a product code management UI with QR Code display.

Users can:

- Add a product code to the table
- Validate product code format
- Prevent duplicate product codes
- Display a QR Code in a modal
- Delete a product code with confirmation

## Question 007 Requirements

Product code rules:

- Product code can contain only numbers and uppercase English letters
- Product code length is 30 characters, excluding hyphens
- Display format: `xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`
- Duplicate product codes are not allowed

UI behavior:

- Click **Add** to add a valid product code to the table
- Click **QR** to display the QR Code modal
- Click **Delete** to show a confirmation box before deleting the row

## Repository Structure

```text
it-approval/
  backend/   Go Gin API, SQLite database, migrations
  frontend/  Angular application
  README.md

## Repository Structure

```text
it-approval/
  backend/   Go Gin API, SQLite database, migrations
  frontend/  Angular application
  README.md
```

## Tech Stack

### Frontend

- Angular
- TypeScript
- RxJS

### Backend

- Go
- Gin
- GORM
- SQLite

## Features

- IT01 - Personal Info page with add/view modal and database save
- IT02 - Login/register flow with bcrypt password hashing and JWT validation
- IT03 - IT approval request list with approve/reject status updates
- IT04 - Profile form with validation, occupation combo box, and Base64 image save
- IT05 - Queue ticket flow from A0 to Z9 with clear queue support
- IT06 - Product code page with Code 39 barcode rendering
- IT07 - Product code page with QR display modal
- IT08 - Question list with add, cancel, delete, and renumbering
- IT09 - Persistent comment page with fixed commenter name
- IT10 - Exam-taking page with scoring and saved results

## Prerequisites

- Go
- Node.js
- npm

## Run Backend

Start the backend first:

```bash
cd backend
go run ./cmd/api
```

The backend runs at:

```text
http://localhost:8080
```

Keep the backend running before testing frontend features that load, save, delete, log in, or submit data.

## Run Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run start
```

The Angular dev server runs at:

```text
http://localhost:4200
```

## Open the App

Landing page:

```text
http://localhost:4200
```

Task routes:

- `http://localhost:4200/it01`
- `http://localhost:4200/it02`
- `http://localhost:4200/it03`
- `http://localhost:4200/it04`
- `http://localhost:4200/it05`
- `http://localhost:4200/it06`
- `http://localhost:4200/it07`
- `http://localhost:4200/it08`
- `http://localhost:4200/it09`
- `http://localhost:4200/it10`
