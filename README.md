# 🏥 Clinic SaaS Platform

A production-grade, multi-tenant SaaS clinic management system with:
- **Laravel 11** API backend
- **Next.js 14** admin dashboard + website builder
- **React Native (Expo)** cross-platform mobile app
- **PostgreSQL** schema-per-tenant isolation
- **Redis** for caching, queues, and slot locking
- **Docker Compose** for local dev + production deployment

---

## 🗂️ Project Structure

```
clinicallnew/
├── backend/           # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/Api/V1/   # API controllers
│   │   ├── Models/                    # Eloquent models
│   │   ├── Services/                  # Business logic
│   │   ├── Repositories/              # Data access layer
│   │   ├── Events/                    # Domain events
│   │   ├── Jobs/                      # Queue jobs
│   │   └── Enums/                     # PHP 8.1+ enums
│   ├── database/migrations/           # DB migrations
│   └── routes/api.php                 # API routes
│
├── frontend/          # Next.js 14 (App Router)
│   ├── app/
│   │   ├── (dashboard)/               # Admin dashboard
│   │   │   ├── page.tsx               # Dashboard home
│   │   │   ├── website-builder/       # Drag & drop website builder
│   │   │   ├── appointments/          # Appointment management
│   │   │   ├── doctors/               # Doctor management
│   │   │   └── billing/               # Subscription management
│   │   └── (public)/[tenant]/         # Public clinic websites
│   ├── components/
│   │   ├── website-builder/           # DnD block editor
│   │   ├── appointments/              # Booking flow
│   │   └── dashboard/                 # Stats, charts
│   └── lib/api.ts                     # Typed API client
│
├── mobile/            # React Native + Expo
│   ├── app/
│   │   ├── (auth)/                    # Login / Register
│   │   ├── (patient)/                 # Patient screens
│   │   ├── (doctor)/                  # Doctor screens
│   │   └── (admin)/                   # Admin screens
│   └── services/api.ts                # Mobile API client
│
├── docker/            # Docker configs
│   ├── php/Dockerfile
│   ├── nginx/default.conf
│   └── postgres/init.sql
│
├── docker-compose.yml # Full stack dev environment
├── Makefile           # Convenience commands
└── .github/workflows/ci.yml  # GitHub Actions CI/CD
```

---

## 🚀 Quick Start

```bash
# 1. Clone and setup
git clone <repo> clinicallnew
cd clinicallnew
make install

# 2. Visit services
# API:       http://localhost:8000
# Frontend:  http://localhost:3000
# Mailhog:   http://localhost:8025
# MinIO:     http://localhost:9001
# Horizon:   http://localhost:8000/horizon
```

---

## 🏢 Multi-Tenancy

Each clinic is a **tenant** with its own PostgreSQL schema:

```
PostgreSQL
├── public (central)
│   ├── tenants
│   ├── plans
│   ├── subscriptions
│   └── domains
│
├── tenant_clinic1-xxxxx
│   ├── users / doctors / patients
│   ├── appointments / schedules
│   ├── invoices / services
│   └── website_pages
│
└── tenant_clinic2-yyyyy
    └── ...
```

**Tenant resolution order:**
1. `X-Tenant-ID` header (mobile/API clients)
2. Subdomain: `clinic1.platform.com`
3. Custom domain: `www.myclinic.com`

---

## 🔑 User Roles

| Role           | Access                              |
|----------------|-------------------------------------|
| `super_admin`  | All tenants, platform management    |
| `clinic_admin` | Full clinic management              |
| `receptionist` | Appointments, patients              |
| `doctor`       | Own schedule, patient notes         |
| `patient`      | Own appointments, profile           |

---

## 📅 Appointment Flow

```
Patient selects doctor
    ↓
Patient selects date
    ↓
System loads available slots (from Schedule + existing Appointments)
    ↓
Patient locks slot (Redis, 2 min TTL) — prevents double booking
    ↓
Patient fills details + confirms
    ↓
Appointment created (DB transaction + lock guard)
    ↓
Notifications sent (Email + SMS + WhatsApp)
    ↓
Reminder job scheduled 24h before
```

---

## 🌐 Website Builder

Each clinic gets a drag-and-drop website builder:

**Block Types:**
- Hero, About, Services, Doctors, Booking Widget
- Contact Form, Gallery, Testimonials, FAQ, Stats, CTA

**Themes:** Clinic, Dental, Dermatology, Hospital, Wellness

**Embeddable booking widget:**
```html
<div id="clinic-booking-widget"></div>
<script src="https://platform.com/widget.js"></script>
<script>cw('init', { tenantId: 'your-clinic-id' });</script>
```

---

## 💳 Subscription Plans

| Feature             | Basic  | Pro    | Enterprise |
|--------------------|--------|--------|------------|
| Doctors            | 2      | 10     | Unlimited  |
| Branches           | 1      | 3      | Unlimited  |
| Website Builder    | ❌     | ✅     | ✅         |
| Custom Domain      | ❌     | ✅     | ✅         |
| Telemedicine       | ❌     | ✅     | ✅         |
| SMS Notifications  | ❌     | ✅     | ✅         |
| WhatsApp           | ❌     | ❌     | ✅         |
| API Access         | ❌     | ❌     | ✅         |
| Monthly Price      | $29    | $79    | $199       |

---

## 🔔 Notifications

- **Email** via SMTP / Mailhog (dev)
- **SMS** via Twilio
- **WhatsApp** via Meta Cloud API
- **Push** via Firebase Cloud Messaging
- **Real-time** via Pusher / Laravel Broadcasting

---

## 🧪 Testing

```bash
make test            # Run all backend tests
make test-frontend   # Type check + lint frontend
```

---

## 🚢 Production Deployment

```bash
# Build and push Docker images (via CI/CD)
git push origin main

# Manual deploy
docker compose -f docker-compose.prod.yml up -d
docker compose exec api php artisan migrate --force
docker compose exec api php artisan optimize
```

---

## 📱 Mobile App

```bash
# Start Expo dev server
make mobile-start

# Run on Android
make mobile-android

# Run on iOS
make mobile-ios

# Build for production
cd mobile && npx eas build --platform all
```

---

## 🔧 Key Technologies

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Backend       | Laravel 11, PHP 8.3                |
| ORM           | Eloquent + Service/Repository       |
| Multi-tenancy | stancl/tenancy v3                   |
| Auth          | JWT (tymon/jwt-auth)               |
| RBAC          | spatie/laravel-permission           |
| Queue         | Laravel Horizon + Redis             |
| Frontend      | Next.js 14, React, TypeScript       |
| State         | Zustand + TanStack Query            |
| UI            | Tailwind CSS + Radix UI             |
| DnD           | @dnd-kit/core                       |
| Mobile        | React Native + Expo 51              |
| Database      | PostgreSQL 16                       |
| Cache/Queue   | Redis 7                             |
| Storage       | MinIO / AWS S3                      |
| Payments      | Stripe                              |
| SMS           | Twilio                              |
| WhatsApp      | Meta Cloud API                      |
| CI/CD         | GitHub Actions                      |
| Containers    | Docker + Docker Compose             |
