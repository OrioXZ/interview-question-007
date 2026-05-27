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
## Notes

This project was originally developed as a multi-task assignment project.
For this repository, the submitted task is Interview Question 007, implemented as IT07 - QR Product Codes.
