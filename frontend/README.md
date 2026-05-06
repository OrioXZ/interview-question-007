# Assignment Frontend

Angular frontend for the assignment tasks.

## Prerequisites

- Node.js
- npm
- Backend API running at `http://localhost:8080`

Start the backend before testing frontend features:

```bash
cd ../backend
go run ./cmd/api
```

## Install Dependencies

From the `frontend` folder:

```bash
npm install
```

## Run Angular Dev Server

```bash
npm run start
```

The Angular dev server runs at:

```text
http://localhost:4200
```

## Open the App

Open the landing page:

```text
http://localhost:4200
```

The landing page lists links to all 10 assignment tasks.

## Task Routes

- `http://localhost:4200/it01` - Personal Info
- `http://localhost:4200/it02` - Login and Register
- `http://localhost:4200/it03` - Approval Requests
- `http://localhost:4200/it04` - Profile Form
- `http://localhost:4200/it05` - Queue Ticket
- `http://localhost:4200/it06` - Barcode Product Codes
- `http://localhost:4200/it07` - QR Product Codes
- `http://localhost:4200/it08` - Question List
- `http://localhost:4200/it09` - Comments
- `http://localhost:4200/it10` - Exam

## Notes

- Keep the backend running at `http://localhost:8080` while testing features that save, load, delete, log in, or submit data.
- The root path `/` shows the landing page.
