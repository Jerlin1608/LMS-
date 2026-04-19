# MedLicense Pro
### Medical License Authority System — Full Stack v2.0

---

## About
A complete dynamic web application for managing, verifying, and issuing medical practitioner licenses. Built with Node.js, Express, and a JSON database.

---

## What's New in Full Stack Version

- All data saved to `backend/data/db.json` — persists across sessions
- Real login with session-based authentication
- All actions hit real REST API endpoints
- Notifications stored in database
- Passwords securely stored

---

## How to Run (Step by Step)

### Requirements
- [Node.js](https://nodejs.org/) version 14 or higher
- VS Code

### Step 1 — Open the folder in VS Code
Open VS Code → **File** → **Open Folder** → select the `MedLicensePro_fullstack` folder.

### Step 2 — Open the Terminal in VS Code
Press `` Ctrl + ` ``

### Step 3 — Install dependencies (first time only)
```
npm install
```

### Step 4 — Start the server
```
npm start
```

### Step 5 — Open in browser
```
http://localhost:3000
```

---

## Demo Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Administrator | `admin` | `Admin@123` |
| Doctor | `dr.arjun` | `Doctor@123` |
| Doctor | `dr.priya` | `Doctor@123` |
| Doctor | `dr.ravi` | `Doctor@123` |

> Public Verification — no login needed, select "Verification" role.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/signup` | Register new doctor |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/applications` | Get all applications |
| POST | `/api/applications` | Submit new application |
| PUT | `/api/applications/:id/approve` | Approve application |
| PUT | `/api/applications/:id/reject` | Reject application |
| GET | `/api/licenses` | Get licenses |
| GET | `/api/licenses/verify/:id` | Public license verify |
| GET | `/api/licenses/verify-by-name/:name` | Verify by doctor name |
| PUT | `/api/licenses/:id/suspend` | Suspend license |
| PUT | `/api/licenses/:id/revoke` | Revoke license |
| GET | `/api/notifications` | Get my notifications |
| PUT | `/api/notifications/mark-read` | Mark all read |
| DELETE | `/api/notifications` | Clear all |

---

## Project Structure

```
MedLicensePro/
├── backend/
│   ├── server.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── applications.js
│   │   ├── licenses.js
│   │   └── notifications.js
│   └── data/
│       ├── db.json
│       └── dbHelper.js
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js
│   │   └── app.js
│   ├── pages/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   └── verification.html
│   └── components/
│       └── modals.html
├── package.json
└── README.md
```

---

## Key Features

- **Role Based Access** — Admin, Doctor, and Public portals
- **License Lifecycle** — Apply, Approve, Reject, Suspend, Revoke
- **QR Code Verification** — Public license verification
- **PDF Certificate** — Download digitally signed license
- **Notifications** — Real-time alerts for doctors
- **Document Upload** — Attach files to applications
- **Statistics Dashboard** — Charts and analytics for admin

---

## Live Demo
Deployed on Render — [ https://lms-qent.onrender.com]

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | JSON File (db.json) |
| Auth | Express Session |
| Charts | Chart.js |
| PDF | jsPDF |
| QR Code | QRCode.js |
| Deployment | Render.com |
