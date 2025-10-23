# CHANGELOG — Frontend (Angular + CoreUI)

All notable changes to this project’s frontend will be documented in this file.
Format: Keep a Changelog; dates in YYYY-MM-DD.

## [Unreleased]
### Added
- Environments (development/production) with apiBaseUrl, useMockApi, i18n defaults, clinicHours, slotMinutes, upload limits.
- i18n setup with @ngx-translate and assets/i18n/id.json, en.json.
- Core HttpClient providers with interceptors (auth, error, mock).
- Guards (auth, role) and route protection for the app shell.
- Mock API (localStorage) with auth/login and patients CRUD + seed data.
- Login page wired to AuthService using reactive form.
- Patients feature: routes, list (search + delete), create/edit forms; sidebar navigation item.
- Doctors feature: routes, list (search + delete), create/edit forms; sidebar navigation item.
- Mock API extended: doctors CRUD with seed data.
- Appointments feature: calendar view with 15-min slots, create/edit/delete form, event click to edit.
- Mock API extended: appointments CRUD with seed data.
- Added FullCalendar packages and styles.
- Medical Records feature: list (filter by patient), create/edit (SOAP, attachments with validation, simple signature UI).
- Mock API extended: medical-records CRUD and file upload (base64 JSON in dev).

## [2025-10-22]
### Added
- Frontend/Docs/PLAN.md documenting MVP scope, architecture, routing, mock API strategy, i18n, and phased delivery.
- Established decisions:
  - apiBaseUrl='/api'; environment toggle useMockApi (true in dev).
  - JWT (common) with role claim; store token in localStorage (MVP).
  - Appointments: 15-minute slots; overlapping allowed.
  - Attachments: allow image/*, application/pdf, text/plain; max size 5MB (configurable).
  - i18n via @ngx-translate; Bahasa Indonesia default; runtime language switch.
  - Angular conventions per Docs/angular-best-practices.md (standalone, signals, OnPush, native control flow, Reactive Forms).

### Notes
- Real backend will replace MockApi via proxy and environment switch; API contracts to be aligned when backend is available.
