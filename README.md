# 🚀 RippleAuth

<p align="center">
<em>A modern, full-stack OTP authentication platform built with:</em>
</p>
  

**Frontend:** React 19 + Next.js (App Router)  
**Backend:** Laravel 12 (Service-Oriented Architecture)  
**Authentication:** Passwordless OTP (Email or Phone)  
**Animations:** Anime.js v4  
**UI:** shadcn/ui + Tailwind CSS

Designed with clean architecture principles, scalable backend services, and a smooth interactive UI.

<div align="center">
  <img alt="last-commit" src="https://img.shields.io/github/last-commit/noltrax/RippleAuth?style=flat&logo=git&color=0080ff">
  <img alt="repo-top-language" src="https://img.shields.io/github/languages/top/noltrax/RippleAuth?style=flat&color=0080ff">
  <img alt="license" src="https://img.shields.io/github/license/noltrax/RippleAuth?style=flat&color=0080ff">
  <img alt="docker" src="https://img.shields.io/badge/docker-ready-blue?style=flat&logo=docker">
</div>



---

# 🎥 Demo

![RippleAuth Demo](./Docs/Demo.gif)



---

# 🌟 Features

## 🎨 Frontend Experience

- Animated background grid with ripple effects  
- Light / Dark theme toggle with smooth transitions  
- OTP-based login (email or phone)  
- Responsive design across devices  
- Custom UI components (shadcn/ui + lucide icons)  
- Axios-based API integration  

## 🔐 Backend Authentication (Passwordless)

- Two-step login flow  
- OTP generation & hashing  
- Login session management  
- Token-based authentication (Laravel Sanctum)  
- Service-based architecture  
- Strategy pattern for OTP delivery (SMS / Email)  

---

# 🏗 System Architecture Overview

This project separates responsibilities cleanly between UI and authentication logic.

---

# 🔄 Authentication Flow

## 1️⃣ Identify Step

User submits:

```json
{
  "method": "email" | "phone",
  "identifier": "user@example.com"
}
```

### Backend:

- Finds or creates user  
- Generates secure OTP  
- Hashes and stores OTP  
- Creates temporary LoginSession  
- Sends OTP (SMS or Email)  
- Returns `identifier_token`  

---

## 2️⃣ Verify Step

User submits:

```json
{
  "identifier_token": "session_token",
  "otp": "123456"
}
```

### Backend:

- Validates LoginSession  
- Validates OTP  
- Deletes OTP record  
- Issues Sanctum token  
- Returns API token  

---

# 🧱 Backend Architecture (Laravel 12)

The backend follows Single Responsibility Principle and Clean Service Design.

## Core Services

```
Auth
├── AuthService
├── OtpService
├── LoginSessionService
├── TokenService
└── UserResolverService
```

---

## Responsibilities

| Component               | Responsibility                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AuthService**         | Orchestrates the complete authentication workflow (request OTP → verify OTP → issue token → finalize login). Acts as the application-layer coordinator. |
| **OtpService**          | Manages the OTP lifecycle: generation, hashing, storage, validation, expiration checks, and triggering delivery.                                        |
| **LoginSessionService** | Handles temporary login session state, including OTP verification context and session lifecycle management.                                             |
| **TokenService**        | Responsible for issuing, refreshing, and revoking authentication tokens (e.g., Laravel Sanctum integration).                                            |
| **UserResolverService** | Resolves user identity during authentication (finds existing user or creates a new one based on identifier such as phone or email).                     |






# 🛡 Security Features

- OTPs are hashed before storage  
- OTP expiration (default: 10 minutes)  
- One-time OTP usage (deleted after validation)  
- LoginSession expiration  
- Token-based authentication (Sanctum)  
- No static passwords  
- Stateless API authentication  

---

# ⚙ Tech Stack

## Frontend

- React 19  
- Next.js (App Router)  
- Tailwind CSS  
- shadcn/ui  
- lucide-react  
- Anime.js v4  
- Axios  

## Backend

- Laravel 12  
- PHP 8.2+  
- Laravel Sanctum  
- MySQL / PostgreSQL  

---

# 🎨 UI Highlights

- Dynamic ripple animations on validation states  
- Theme-aware grid colors  
- OTP input slots with smooth transitions  
- Glassmorphism card styling  
- Fully responsive layout  

---

# 🚀 Installation

## Frontend

```bash
git clone <repo-url>
cd cool-login
npm install
npm run dev
```

### `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Backend

```bash
composer install
php artisan migrate
php artisan serve
```

### `.env`

```env
APP_URL=http://localhost:8000
SANCTUM_STATEFUL_DOMAINS=localhost:3000
OTP_EXPIRATION_MINUTES=5
OTP_LENGTH=6
```

---

# 🧠 Design Principles

- Single Responsibility per service  
- Clean orchestration via AuthService  
- Strategy Pattern for OTP delivery  
- Dependency Injection via Service Container  
- Stateless authentication  
- Frontend / Backend separation of concerns  

---

# 📜 License

MIT License © 2026

---

# 💎 Final Result

This is not just a login page.

It’s a:

- Modern animated frontend  
- Clean Laravel authentication backend  
- Service-driven architecture  
- Dependency-injected system  
- Extensible OTP authentication platform  

AuthBridge demonstrates how strong UI engineering and clean backend architecture can work together in a scalable, production-ready authentication system.
