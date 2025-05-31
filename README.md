# 🩺 Appointment Booking System

A full-stack appointment booking application built with **Node.js**, **Express**, **MongoDB**, and **React.js**. The app supports user authentication using **JWT tokens** and enables users to manage their profiles, book appointments, and view their booked appointments.

---

## 🚀 Features

### 🔐 Authentication
- **Sign Up**: New users can register with email and password.
- **Login**: Users can securely log in using credentials.
- **JWT Token**: All authenticated routes are protected using JSON Web Tokens.
- **Logout**: Users can log out and invalidate their session.

### 👤 Profile Management
- View user profile after logging in.
- Basic profile information like name, email, and role.

### 📅 Appointment Booking
- Browse available appointment slots.
- Book an appointment for a specific date and time.
- Real-time availability check.

### 📂 My Appointments
- View a list of all appointments booked by the logged-in user.
- Appointments display details like date, time, service, and status.

---

## 🧰 Tech Stack

### Frontend
- **React.js**
- **Redux Toolkit** (for state management)
- **React Router DOM**
- **Tailwind CSS**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT (jsonwebtoken)** for authentication

---

## 📦 API Endpoints

### Auth Routes
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get user profile (protected)

### Appointment Routes
- `GET /api/appointments` - Get available appointments
- `POST /api/appointments/book` - Book a new appointment
- `GET /api/appointments/my` - View my booked appointments

---

## 🛡️ Authentication Workflow

1. **User signs up** → account is created in MongoDB.
2. **User logs in** → receives JWT token.
3. **JWT token** is stored in local storage or cookies.
4. **Protected routes** require token in `Authorization` header.

---
## 📖 API Documentation (Swagger)

All endpoints are documented using Swagger (OpenAPI 3).

### 📍 Access Docs

Once the server is running, visit:



## ✅ Setup Instructions

1. Clone the repo

```bash
git clone https://github.com/yourusername/appointment-booking-app.git
cd appointment-booking-app
