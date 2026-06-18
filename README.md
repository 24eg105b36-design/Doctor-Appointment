# Book a Doctor - Healthcare Booking System

This is a full-stack MERN (MongoDB, Express.js, React, Node.js) application designed for booking doctor appointments. It features user authentication, a doctor directory with booking scheduling, and specialized dashboards for Patients, Doctors, and Administrators.

---

## Codebase Architecture

The application is split into two main directories: `client` (Frontend) and `server` (Backend).

### 1. Frontend (`client`)
Built using modern React with Vite as the build tool.
- **State Management**: Redux Toolkit (slices for auth, appointments, etc.).
- **Styling**: Bootstrap and React-Bootstrap for responsive, clean layouts.
- **Routing**: React Router DOM (v6) handling navigation and protected routes.
- **Form Handling**: React Hook Form with validation.
- **Key Views / Pages**:
  - `Home`: Overview and portal access.
  - `Login`/`Register`: Patient and doctor registration/login.
  - `PatientDashboard`: Browse appointments, cancel slots, check statuses.
  - `DoctorDashboard`: Set availability, manage patients, respond to bookings.
  - `AdminDashboard`: Oversee users, doctors, and global system metrics.
  - `DoctorListing` & `DoctorDetails`: Search and view detailed doctor profiles to book slots.

### 2. Backend (`server`)
A Node.js & Express.js REST API.
- **Database**: MongoDB (via Mongoose).
- **Authentication**: JWT-based session tokens with HTTP-only cookies/headers.
- **Security**: Helmet, CORS, Morgan logger, and Express Validator for request sanitation.
- **File Uploads**: Multer configured with Cloudinary storage for doctor profiles/documents.
- **In-Memory Database Fallback**: Integrated with `mongodb-memory-server`. If connection to a primary MongoDB fails (e.g. no local daemon running), the server starts a temporary in-memory MongoDB instance automatically.

---

## How to Run the Application

Both services need to run simultaneously. Follow the steps below to start them:

### Step 1: Start the Backend Server
1. Open a new terminal window and navigate to the server folder:
   ```bash
   cd "Side projects/Doctor Appointment/server"
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy `.env.example` to `.env` if it does not exist:
     ```bash
     cp .env.example .env
     ```
   - Customize `.env` as needed. The defaults work out-of-the-box using the in-memory database fallback.
4. Run the server in development mode (using nodemon):
   ```bash
   npm run dev
   ```
   *The server runs by default on `http://localhost:5000`.*

### Step 2: Start the Frontend Client
1. Open a second terminal window and navigate to the client folder:
   ```bash
   cd "Side projects/Doctor Appointment/client"
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Run the development server (using Vite):
   ```bash
   npm run dev
   ```
   *The client runs by default on `http://localhost:5173`.*

---

## Verification
You can open `http://localhost:5173` in your web browser to access the application. If the backend is running, authentication, doctor browsing, and bookings will interact dynamically.
