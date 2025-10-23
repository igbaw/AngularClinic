# Frontend Development Plan — Angular + CoreUI (Clinic Management)

Purpose
- Deliver an MVP SPA that implements the features in Docs/Desain Aplikasi Manajemen Klinik THT.md and Docs/clinic_management_data_model.md.
- Run fully without a real backend via a switchable in‑app mock API.
- Default language Bahasa Indonesia with runtime switch to English.

High‑level scope (MVP)
- Auth & RBAC: Login, route protection, Admin/Doctor roles.
- Patients: CRUD + search (nama/NIK/telepon), details.
- Doctors: CRUD + SIP, license_number, availability (JSON weekly).
- Appointments: Calendar (day/week), 15‑minute slots, overlaps allowed, statuses.
- Medical Records (SOAP): CRUD, attachments (image/*, application/pdf, text/plain, ≤5MB), simple signature.
- Inventory: CRUD, expiry badge, basic movement history (manual entry).
- Prescriptions: Create from appointment/RME, decrement stock, print view (placeholders; later standardizable).

Non‑functional
- Reliability: graceful error handling, basic toasts.
- Performance: OnPush, signals, lazy routes.
- Accessibility: focus order, labels, keyboard basics.
- Internationalization: runtime switch (ID default, EN optional).
- Testing: unit tests for services/components; smoke e2e for critical paths.

Key decisions
- Angular v20, standalone components, signals, ChangeDetectionStrategy.OnPush.
- CoreUI v5 for layout/components; FullCalendar for scheduling.
- HTTP interceptors: Auth, Error, optional Loading; MockApi interceptor (dev).
- Environment-driven config (apiBaseUrl='/api', useMockApi=true in dev, defaultLang='id', slotMinutes=15, clinicHours, file limits and allowed types).
- JWT (common approach): Bearer token in Authorization header; payload includes sub, name, role; stored in localStorage for MVP.

Project structure (planned)
- src/app
  - core/: ApiService, AuthService, interceptors (auth, error, mock), guards (auth, role), config, translation init, models.
  - shared/: UI primitives (ConfirmDialog, FileUpload), DataTable wrapper, pipes, directives, validators.
  - features/
    - dashboard/
    - patients/
    - doctors/
    - appointments/
    - medical-records/
    - inventory/
    - prescriptions/
    - admin/ (future)
  - app.routes.ts (lazy feature routes)

Routing (initial)
- /login
- /dashboard
- /patients (list, create, :id)
- /doctors (list, create, :id)
- /appointments (calendar, list)
- /medical-records (list by patient, :id)
- /inventory (list, create, :id)
- /prescriptions (create, list)

Environment configuration (examples)
- environment.development.ts
  - apiBaseUrl: '/api'
  - useMockApi: true
  - defaultLang: 'id'
  - supportedLangs: ['id', 'en']
  - clinicHours: { start: '17:00', end: '19:00' }
  - slotMinutes: 15
  - upload: { maxSizeMB: 5, allowedMimeTypes: ['image/*', 'application/pdf', 'text/plain'] }
- environment.ts (prod)
  - useMockApi: false (switch to real backend via proxy later)

Mock API (dev‑only, switchable)
- Mechanism: MockApiInterceptor intercepts /api/*; repositories per entity use localStorage; optional artificial latency (e.g., 250ms) via config.
- Seed data for demo.
- Endpoints (shape):
  - Auth: POST /api/auth/login → { accessToken, user:{ id, name, role } }
  - Patients: GET /api/patients?q=&page=&pageSize=; GET /api/patients/{id}; POST; PUT; DELETE
  - Doctors: same CRUD; availability stored as JSON
  - Appointments: GET /api/appointments?date=&doctorId=; CRUD; allow overlaps
  - Medical Records: CRUD; attachments: POST /api/files → { id, url, fileName, mimeType, size }
  - Inventory: CRUD; movements list (manual)
  - Prescriptions: POST issues stock decrement; GET by patient/appointment

Data model (frontend DTOs)
- Follow Docs/clinic_management_data_model.md with TypeScript interfaces: Patient, Doctor, Appointment, MedicalRecord, InventoryItem, Prescription, Attachment.

Core UI/UX behaviors
- Role‑aware navigation and guard protection.
- Consistent forms (ReactiveForms); custom validators (file size/type); input masks for phone if needed.
- Tables with pagination and quick search.
- Calendar day/week views; slotMinutes=15; overbooking allowed (warning only).
- Print stylesheet for prescriptions.

Internationalization
- @ngx-translate with assets/i18n/{id,en}.json; language switch in header; language persisted in localStorage; date/time localized.

Quality
- ESLint + Prettier; strict TypeScript; unit tests with HttpTestingController; minimal e2e.
- Build per env; proxy to backend later with proxy.conf.json when available.

Phased delivery plan
- Phase 0: Baseline — environments, layout, i18n setup, interceptors/guards, MockApi skeleton, models.
- Phase 1: Patients — CRUD + search + seeds; tests.
- Phase 2: Doctors — CRUD + availability.
- Phase 3: Appointments — calendar, create/edit modal, status.
- Phase 4: Medical Records — SOAP CRUD, attachments (≤5MB, allowed types), signature UI.
- Phase 5: Inventory — CRUD, expiry badges, movement history (manual).
- Phase 6: Prescriptions — create from appointment/RME, stock decrement, print preview.
- Phase 7: Polish & QA — i18n completeness, accessibility basics, e2e smoke.

Acceptance criteria (MVP)
- App fully usable with useMockApi=true: login (Admin/Doctor), manage patients/doctors, book overlapping 15‑minute appointments, create RME with valid attachments, manage inventory, issue printable prescriptions, switch language ID/EN, guard routes by role.

Change management
- Any deviation from this plan will be recorded in Frontend/Docs/CHANGELOG.md with date and rationale.

Development conventions (from Docs/angular-best-practices.md)
- Standalone components (do not set standalone: true explicitly if default); signals for state; lazy routes.
- Use input()/output() functions; computed() for derived state; avoid ngClass/ngStyle—prefer class/style bindings.
- Native control flow (@if/@for/@switch); OnPush change detection; Reactive Forms; use NgOptimizedImage for static images.
