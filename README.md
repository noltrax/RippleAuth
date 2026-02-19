# 🚀 AuthBridge

A modern, full-stack OTP authentication platform built with:

**Frontend:** React 19 + Next.js (App Router)  
**Backend:** Laravel 12 (Service-Oriented Architecture)  
**Authentication:** Passwordless OTP (Email or Phone)  
**Animations:** Anime.js v4  
**UI:** shadcn/ui + Tailwind CSS

Designed with clean architecture principles, scalable backend services, and a smooth interactive UI.

---

# 🎥 Live Demo

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
AuthService
├── OtpGenerator
├── OtpStorage
├── OtpValidator
├── OtpSenderContract
│   ├── SmsOtpSender
│   └── EmailOtpSender
└── LoginSessionManager
```

---

## Responsibilities

| Component | Responsibility |
|------------|----------------|
| AuthService | Orchestrates authentication flow |
| OtpGenerator | Generates secure OTP |
| OtpStorage | Hashes and stores OTP |
| OtpValidator | Validates OTP |
| OtpSenderContract | Delivery abstraction |
| LoginSessionManager | Manages temporary login sessions |

---

# 🧠 Service Container & Service Providers

This backend leverages Laravel’s Service Container for dependency injection and loose coupling.

## Why?

- Swap SMS provider without touching business logic  
- Test services independently  
- Follow Dependency Inversion Principle  
- Maintain scalable architecture  

---

## Service Binding Example

In `AppServiceProvider` (or a dedicated `AuthServiceProvider`):

```php
public function register(): void
{
    $this->app->bind(
        OtpSenderContract::class,
        SmsOtpSender::class
    );

    $this->app->bind(
        AuthServiceContract::class,
        AuthService::class
    );
}
```

### What This Achieves

- `AuthService` depends on `OtpSenderContract`  
- The container injects `SmsOtpSender`  
- You can switch to `EmailOtpSender` by changing one binding  
- Zero modification required in `AuthService`  

This follows the Strategy Pattern and Dependency Injection principles.

---

# 🛡 Security Features

- OTPs are hashed before storage  
- OTP expiration (default: 5 minutes)  
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
