# AngularClinic - Application Flow & Architecture Guide

This document provides a comprehensive overview of the AngularClinic application architecture, data flow, and key concepts that developers need to understand to work effectively with the codebase.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Technology Stack](#technology-stack)
- [Application Flow](#application-flow)
- [Authentication Flow](#authentication-flow)
- [Data Flow](#data-flow)
- [Module Architecture](#module-architecture)
- [Key Components](#key-components)
- [API Structure](#api-structure)
- [Database Schema](#database-schema)
- [Development Workflow](#development-workflow)
- [Important Notes](#important-notes)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

---

## System Overview

AngularClinic is a full-stack clinic management system designed for ENT (Ear, Nose, Throat) clinics. The system manages:

- **Patients**: Demographics, contact info, insurance details
- **Doctors**: Profiles, specializations, schedules, availability
- **Appointments**: Booking, scheduling, status tracking
- **Medical Records**: SOAP notes (Subjective, Objective, Assessment, Plan)
- **Prescriptions**: Medication management (future enhancement)
- **Inventory**: Medical supplies tracking (future enhancement)

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Angular 20 Application                      │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │     │
│  │  │Components│  │ Services │  │  Guards  │        │     │
│  │  └────┬─────┘  └─────┬────┘  └─────┬────┘        │     │
│  │       │              │              │              │     │
│  │  ┌────▼──────────────▼──────────────▼────┐        │     │
│  │  │      HTTP Interceptors                │        │     │
│  │  │  (Auth, Error, Mock API)              │        │     │
│  │  └────────────────┬──────────────────────┘        │     │
│  └───────────────────┼───────────────────────────────┘     │
└────────────────────┼─────────────────────────────────────┘
                      │ HTTP (withCredentials: true)
                      │ Cookies included in requests
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend Server                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │         ElysiaJS API (Bun Runtime)                  │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │     │
│  │  │  Routes  │  │Middleware│  │ Services │        │     │
│  │  └────┬─────┘  └─────┬────┘  └─────┬────┘        │     │
│  │       │              │              │              │     │
│  │  ┌────▼──────────────▼──────────────▼────┐        │     │
│  │  │         Prisma ORM Client             │        │     │
│  │  └────────────────┬──────────────────────┘        │     │
│  └───────────────────┼───────────────────────────────┘     │
└────────────────────┼─────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Database (SQLite/PostgreSQL)                    │
│  ┌────────┐ ┌────────┐ ┌────────────┐ ┌──────────────┐    │
│  │ Users  │ │Patients│ │Appointments│ │MedicalRecords│    │
│  └────────┘ └────────┘ └────────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: Angular 20 (standalone components)
- **UI Library**: CoreUI 5 (admin template)
- **State Management**: Angular Signals
- **Forms**: Reactive Forms
- **HTTP**: Angular HttpClient
- **Calendar**: FullCalendar
- **i18n**: ngx-translate
- **Date Utils**: date-fns
- **Package Manager**: npm

### Backend
- **Runtime**: Bun (JavaScript/TypeScript runtime)
- **Framework**: ElysiaJS (type-safe web framework)
- **ORM**: Prisma
- **Database**: SQLite (dev), PostgreSQL (prod)
- **Authentication**: Cookie-based sessions with Argon2 hashing
- **Validation**: Elysia built-in validators

### Development Tools
- **TypeScript**: Strict mode enabled
- **Testing**: Karma + Jasmine (frontend), Bun test (backend)
- **Version Control**: Git

---

## Application Flow

### 1. Application Startup

#### Frontend Initialization
```
main.ts
  └─> bootstrapApplication(AppComponent)
       └─> app.config.ts (ApplicationConfig)
            ├─> provideRouter (routing)
            ├─> provideHttpClient (interceptors)
            ├─> provideCoreUI (UI components)
            ├─> provideAnimations
            └─> TranslateModule (i18n)
```

**Key Files:**
- `src/main.ts`: Entry point
- `src/app/app.config.ts`: Application-level providers
- `src/app/app.routes.ts`: Top-level routing configuration

#### Backend Initialization
```
app.ts
  └─> new Elysia()
       ├─> CORS plugin (withCredentials support)
       ├─> Routes registration
       │    ├─> Auth routes (/api/auth/*)
       │    ├─> Patient routes (/api/patients/*)
       │    ├─> Doctor routes (/api/doctors/*)
       │    ├─> Appointment routes (/api/appointments/*)
       │    └─> Medical Record routes (/api/medical-records/*)
       └─> Error handling middleware
```

**Key Files:**
- `src/app.ts`: Server initialization
- `src/routes.ts`: Route registration
- `src/config/env.ts`: Environment configuration

### 2. User Navigation Flow

```
Browser Request
  └─> Angular Router
       └─> Route Guard (authGuard)
            ├─> Authenticated? ─> YES ─> Load Component
            └─> Not Authenticated? ─> NO ─> Redirect to Login
```

**Example User Journey:**

1. User visits http://localhost:4200
2. App checks for existing session via `/api/auth/me`
3. If session exists → redirect to dashboard
4. If no session → show login page
5. User logs in → cookie set → redirect to dashboard
6. User navigates → guards check authentication on each route

---

## Authentication Flow

### Login Flow

```
┌─────────────┐                 ┌──────────────┐                ┌──────────┐
│   Login     │                 │   Backend    │                │ Database │
│  Component  │                 │   (Elysia)   │                │ (Prisma) │
└──────┬──────┘                 └──────┬───────┘                └────┬─────┘
       │                               │                             │
       │ 1. Submit email/password      │                             │
       │───────────────────────────────>│                             │
       │                               │                             │
       │                               │ 2. Query user by email      │
       │                               │─────────────────────────────>│
       │                               │                             │
       │                               │ 3. Return user data         │
       │                               │<─────────────────────────────│
       │                               │                             │
       │                               │ 4. Verify password (Argon2) │
       │                               │ ───────┐                    │
       │                               │        │                    │
       │                               │ <──────┘                    │
       │                               │                             │
       │ 5. Set HttpOnly cookie        │                             │
       │    + Return user data         │                             │
       │<───────────────────────────────│                             │
       │                               │                             │
       │ 6. Store user in local state  │                             │
       │    (Signal/Service)           │                             │
       │ ───────┐                      │                             │
       │        │                      │                             │
       │ <──────┘                      │                             │
       │                               │                             │
       │ 7. Navigate to dashboard      │                             │
       │ ───────┐                      │                             │
       │        │                      │                             │
       │ <──────┘                      │                             │
```

### Session Management

**Frontend:**
- No access token in localStorage (more secure!)
- Cookie automatically sent with every HTTP request
- `AuthService` maintains user state using Signals
- Session checked on app init via `/api/auth/me`

**Backend:**
- HttpOnly cookies prevent JavaScript access
- Secure flag enabled in production
- SameSite attribute prevents CSRF
- Session expiry handled server-side

### Authorization (Role-Based Access Control)

**Roles:**
- `ADMIN`: Full access to all features
- `DOCTOR`: Access to own appointments and medical records
- `RECEPTIONIST`: Patient management, appointments, inventory

**Frontend Guards:**
- `authGuard`: Checks if user is authenticated
- `roleGuard`: Checks if user has required role

**Backend Middleware:**
- `requireAuth`: Validates session cookie
- `requireRole`: Checks user role for specific endpoints

---

## Data Flow

### Typical CRUD Flow Example (Patient Management)

```
┌──────────────┐         ┌──────────────┐        ┌─────────┐        ┌──────────┐
│   Patient    │         │   Patient    │        │ Backend │        │ Database │
│  Component   │         │   Service    │        │   API   │        │  Prisma  │
└──────┬───────┘         └──────┬───────┘        └────┬────┘        └────┬─────┘
       │                        │                     │                  │
       │ 1. Load patients       │                     │                  │
       │────────────────────────>│                     │                  │
       │                        │                     │                  │
       │                        │ 2. GET /api/patients│                  │
       │                        │─────────────────────>│                  │
       │                        │                     │                  │
       │                        │                     │ 3. Query DB      │
       │                        │                     │──────────────────>│
       │                        │                     │                  │
       │                        │                     │ 4. Return rows   │
       │                        │                     │<──────────────────│
       │                        │                     │                  │
       │                        │ 5. JSON response    │                  │
       │                        │<─────────────────────│                  │
       │                        │                     │                  │
       │ 6. Update signal/state │                     │                  │
       │<────────────────────────│                     │                  │
       │                        │                     │                  │
       │ 7. Template renders    │                     │                  │
       │    with new data       │                     │                  │
```

### Interceptor Chain

**Request Flow:**
```
Component → Service → HttpClient
  └─> Auth Interceptor (add credentials)
       └─> Mock API Interceptor (if enabled, intercept and return mock data)
            └─> Error Interceptor
                 └─> Actual HTTP Request → Backend
```

**Response Flow:**
```
Backend Response
  └─> Error Interceptor (catch errors, show notifications)
       └─> Service (process response)
            └─> Component (update UI via signals)
```

---

## Module Architecture

### Frontend Module Structure

```
src/app/
├── core/                        # Core services and models
│   ├── guards/                  # Route guards
│   │   ├── auth.guard.ts        # Authentication guard
│   │   └── role.guard.ts        # Role-based guard
│   ├── interceptors/            # HTTP interceptors
│   │   ├── auth.interceptor.ts  # Adds auth credentials
│   │   ├── error.interceptor.ts # Global error handling
│   │   └── mock-api.interceptor.ts # Development mock API
│   ├── models/                  # TypeScript interfaces
│   │   ├── patient.model.ts
│   │   ├── doctor.model.ts
│   │   ├── appointment.model.ts
│   │   ├── medical-record.model.ts
│   │   └── auth.model.ts
│   └── services/                # Core services
│       ├── api.service.ts       # HTTP wrapper
│       └── auth.service.ts      # Authentication
│
├── features/                    # Feature modules (lazy-loaded)
│   ├── patients/
│   │   ├── components/
│   │   ├── services/
│   │   └── routes.ts
│   ├── doctors/
│   ├── appointments/
│   └── medical-records/
│
├── layout/                      # Layout components
│   └── default-layout/
│       ├── default-layout.component.ts
│       └── _nav.ts              # Navigation config
│
├── app.component.ts             # Root component
├── app.config.ts                # App configuration
└── app.routes.ts                # Top-level routes
```

### Backend Module Structure

```
src/
├── app.ts                       # Elysia app initialization
├── routes.ts                    # Route registration
├── config/
│   └── env.ts                   # Environment variables
├── auth/
│   ├── middleware.ts            # Auth middleware
│   ├── routes.ts                # Auth endpoints
│   └── service.ts               # Auth business logic
├── db/
│   ├── prisma.ts                # Prisma client
│   └── seed.ts                  # Database seeding
├── modules/
│   ├── patients/
│   │   ├── routes.ts            # Patient endpoints
│   │   └── service.ts           # Patient business logic
│   ├── doctors/
│   ├── appointments/
│   └── medical-records/
└── utils/
    └── errors.ts                # Error utilities
```

---

## Key Components

### Frontend

#### 1. App Component (`app.component.ts`)
- Root component
- Router outlet for navigation
- No business logic

#### 2. Default Layout (`default-layout.component.ts`)
- CoreUI admin shell
- Sidebar navigation
- Header with user info
- Main content area

#### 3. Auth Guard (`auth.guard.ts`)
```typescript
// Protects routes requiring authentication
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

#### 4. API Service (`api.service.ts`)
- Typed HTTP wrapper
- Centralizes HTTP requests
- Uses environment.apiBaseUrl
- Example:
```typescript
getPatients(params?: any): Observable<Patient[]> {
  return this.http.get<Patient[]>(`${this.apiUrl}/patients`, { params });
}
```

#### 5. Mock API Interceptor (`mock-api.interceptor.ts`)
- Intercepts HTTP requests when `useMockApi: true`
- Returns mock data from localStorage
- Simulates latency
- Useful for frontend development without backend

### Backend

#### 1. App Entry (`app.ts`)
- Initializes Elysia instance
- Sets up CORS
- Registers routes
- Error handling

#### 2. Auth Middleware (`auth/middleware.ts`)
```typescript
// Validates session and adds user to context
export const requireAuth = (app: Elysia) => 
  app.derive(async ({ cookie, set }) => {
    const session = cookie.session_id;
    if (!session) {
      set.status = 401;
      throw new Error('Unauthorized');
    }
    // Validate and return user
  });
```

#### 3. Prisma Client (`db/prisma.ts`)
- Single Prisma instance
- Connection pooling
- Type-safe queries

#### 4. Error Handling (`utils/errors.ts`)
- Normalizes errors to consistent format
- Maps to HTTP status codes
- Example response:
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input",
  "fieldErrors": {
    "email": "Email is required"
  }
}
```

---

## API Structure

### Endpoint Patterns

All endpoints follow REST conventions:

```
GET    /api/{resource}          # List (with pagination/filters)
GET    /api/{resource}/:id      # Get single item
POST   /api/{resource}          # Create
PUT    /api/{resource}/:id      # Update
DELETE /api/{resource}/:id      # Delete
```

### Request/Response Format

**Request Headers:**
```
Content-Type: application/json
Cookie: session_id=xxx (automatically sent)
```

**Success Response:**
```json
{
  "data": { ... },
  "total": 100,    // For list endpoints
  "page": 1,       // For paginated endpoints
  "pageSize": 10
}
```

**Error Response:**
```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "details": { ... },           // Optional
  "fieldErrors": {              // Optional (validation errors)
    "email": "Email is invalid"
  }
}
```

### Pagination & Filtering

Most list endpoints support:
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)
- `search`: Search query
- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`

Example:
```
GET /api/patients?page=1&pageSize=20&search=john&sortBy=createdAt&sortOrder=desc
```

---

## Database Schema

### Key Tables

#### User
```prisma
model User {
  id                String    @id @default(uuid())
  email             String    @unique
  passwordHash      String
  fullName          String
  role              Role      // ADMIN, DOCTOR, RECEPTIONIST
  active            Boolean   @default(true)
  mustChangePassword Boolean  @default(true)
  lastLoginAt       DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

#### Patient
```prisma
model Patient {
  id          String    @id @default(uuid())
  fullName    String
  dateOfBirth DateTime
  gender      Gender    // MALE, FEMALE, OTHER
  phone       String
  email       String?
  address     String?
  insurance   String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  appointments     Appointment[]
  medicalRecords   MedicalRecord[]
}
```

#### Doctor
```prisma
model Doctor {
  id             String    @id @default(uuid())
  userId         String?   @unique // Link to User
  fullName       String
  specialization String
  licenseNumber  String    @unique
  phone          String
  email          String
  availability   Json?     // Schedule as JSON
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  user              User?           @relation(fields: [userId], references: [id])
  appointments      Appointment[]
  medicalRecords    MedicalRecord[]
}
```

#### Appointment
```prisma
model Appointment {
  id          String            @id @default(uuid())
  patientId   String
  doctorId    String
  dateTime    DateTime
  status      AppointmentStatus // PENDING, CONFIRMED, CANCELLED, COMPLETED
  notes       String?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  
  patient Patient @relation(fields: [patientId], references: [id])
  doctor  Doctor  @relation(fields: [doctorId], references: [id])
}
```

#### MedicalRecord
```prisma
model MedicalRecord {
  id            String   @id @default(uuid())
  recordNumber  String   @unique
  patientId     String
  doctorId      String
  date          DateTime
  subjective    String   // Patient's symptoms/complaints
  objective     String   // Clinical observations
  assessment    String   // Diagnosis/impressions
  plan          String   // Treatment plan
  attachments   Json?    // File references
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  patient Patient @relation(fields: [patientId], references: [id])
  doctor  Doctor  @relation(fields: [doctorId], references: [id])
}
```

### Relationships

```
User ─── 1:1? ──> Doctor
Patient ─── 1:N ──> Appointment
Doctor  ─── 1:N ──> Appointment
Patient ─── 1:N ──> MedicalRecord
Doctor  ─── 1:N ──> MedicalRecord
```

---

## Development Workflow

### 1. Starting the Development Environment

**Option A: Use the Startup Script (Recommended)**
```powershell
# From project root
.\start-dev.ps1
```
This starts both frontend (port 4200) and backend (port 8080) simultaneously.

**Option B: Manual Start**
```powershell
# Terminal 1 - Backend
cd WebApp\Backend\ElysiaJS
bun run dev

# Terminal 2 - Frontend
cd WebApp\Frontend
npm start
```

### 2. Making Changes

#### Frontend Changes
1. Edit files in `WebApp/Frontend/src/`
2. Hot reload automatically updates browser
3. Check console for errors
4. Test in browser

#### Backend Changes
1. Edit files in `WebApp/Backend/ElysiaJS/src/`
2. Bun automatically restarts server
3. Test with API client or frontend

### 3. Database Changes

#### Create New Migration
```powershell
cd WebApp\Backend\ElysiaJS
bun run db:migrate
```

#### Reset Database
```powershell
Remove-Item prisma\dev.db
bun run db:migrate
bun run db:seed
```

### 4. Testing

#### Frontend Tests
```powershell
cd WebApp\Frontend
npm test                          # Run all tests
ng test --include=path/to/file    # Run specific test
```

#### Backend Tests
```powershell
cd WebApp\Backend\ElysiaJS
bun test
```

---

## Important Notes

### Security Considerations

1. **Cookie-Based Auth**: 
   - Frontend MUST send `withCredentials: true` on all requests
   - Configured in HTTP interceptor
   - Never store sensitive tokens in localStorage

2. **CORS Configuration**:
   - Backend allows frontend origin only
   - Credentials enabled
   - Configured in backend `app.ts`

3. **Password Security**:
   - Argon2 hashing (industry standard)
   - Never log or expose passwords
   - Force password change on first login

4. **Input Validation**:
   - Frontend: Reactive form validators
   - Backend: Elysia schema validation
   - Always validate on both sides

### Performance Considerations

1. **Lazy Loading**:
   - Feature modules are lazy-loaded
   - Reduces initial bundle size
   - Faster first load

2. **Change Detection**:
   - Use OnPush strategy
   - Use signals for reactive state
   - Minimize unnecessary re-renders

3. **Database Queries**:
   - Use pagination for large lists
   - Index frequently queried fields
   - Use Prisma query optimization

### Development vs Production

#### Frontend Environment Files
- `environment.development.ts`: Mock API enabled by default
- `environment.ts`: Production config (useMockApi: false)

#### Backend Environment Variables
- `.env`: Development (SQLite)
- Production: PostgreSQL with proper secrets

---

## Common Patterns

### 1. Angular Component Pattern (Standalone)

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <p>Loading...</p>
    } @else {
      @for (item of items(); track item.id) {
        <p>{{ item.name }}</p>
      }
    }
  `
})
export class ExampleComponent {
  private service = inject(ExampleService);
  
  items = signal<Item[]>([]);
  loading = signal(false);
  
  ngOnInit() {
    this.loadItems();
  }
  
  loadItems() {
    this.loading.set(true);
    this.service.getItems().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }
}
```

### 2. Service Pattern

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExampleService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;
  
  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/items`);
  }
  
  getItem(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/items/${id}`);
  }
  
  createItem(item: CreateItemDto): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/items`, item);
  }
  
  updateItem(id: string, item: UpdateItemDto): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/items/${id}`, item);
  }
  
  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`);
  }
}
```

### 3. Backend Route Pattern

```typescript
import { Elysia, t } from 'elysia';
import { requireAuth } from '../auth/middleware';
import { exampleService } from './service';

export const exampleRoutes = new Elysia({ prefix: '/api/examples' })
  .use(requireAuth)
  
  .get('/', async ({ query }) => {
    return exampleService.findAll(query);
  }, {
    query: t.Object({
      page: t.Optional(t.Number()),
      pageSize: t.Optional(t.Number()),
      search: t.Optional(t.String())
    })
  })
  
  .get('/:id', async ({ params }) => {
    return exampleService.findById(params.id);
  }, {
    params: t.Object({
      id: t.String()
    })
  })
  
  .post('/', async ({ body }) => {
    return exampleService.create(body);
  }, {
    body: t.Object({
      name: t.String(),
      description: t.String()
    })
  });
```

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Browser blocks requests with CORS error

**Solution:**
- Check backend CORS_ORIGIN in `.env` matches frontend URL
- Ensure `withCredentials: true` in HTTP requests
- Verify CORS middleware is configured correctly

#### 2. Authentication Not Working
**Problem**: User can't log in or session expires immediately

**Solution:**
- Check cookies are being set (DevTools → Application → Cookies)
- Verify `withCredentials: true` in HTTP interceptor
- Check backend session middleware is working
- Ensure cookie domain/path settings are correct

#### 3. Mock API vs Real API Confusion
**Problem**: Changes to backend don't reflect in frontend

**Solution:**
- Check `environment.development.ts` → set `useMockApi: false`
- Ensure backend is running
- Clear browser localStorage and cookies
- Restart both frontend and backend

#### 4. Database Schema Changes Not Applied
**Problem**: Prisma client doesn't reflect schema changes

**Solution:**
```powershell
bun run db:generate    # Regenerate Prisma client
bun run db:push        # Push schema to database
# Or create migration:
bun run db:migrate
```

#### 5. Port Already in Use
**Problem**: Can't start server, port 4200 or 8080 is busy

**Solution:**
```powershell
# Find process using port
Get-NetTCPConnection -LocalPort 8080 | Select-Object OwningProcess | Get-Process

# Kill process
Stop-Process -Id <PID>
```

#### 6. Frontend Build Errors
**Problem**: TypeScript compilation errors

**Solution:**
- Check `tsconfig.json` strict mode settings
- Ensure all imports are correct
- Run `npm install` to ensure dependencies are up to date
- Check for missing type definitions

---

## Next Steps for New Developers

1. **Read the Documentation**:
   - `WARP.md` (main project guide)
   - `WebApp/Frontend/WARP.md` (frontend-specific)
   - `WebApp/Backend/ElysiaJS/SETUP.md` (backend setup)

2. **Set Up Development Environment**:
   - Install Node.js and Bun
   - Clone repository
   - Run `.\start-dev.ps1`

3. **Explore the Code**:
   - Start with `src/app/app.component.ts` (frontend)
   - Look at `src/app.ts` (backend)
   - Understand the authentication flow
   - Check out a feature module (e.g., patients)

4. **Make a Small Change**:
   - Add a new field to a form
   - Create a new component
   - Add a new API endpoint
   - Test your changes

5. **Run Tests**:
   - Frontend: `npm test`
   - Backend: `bun test`

6. **Ask Questions**:
   - Check existing documentation first
   - Look at similar code patterns
   - Ask team members for clarification

---

## Additional Resources

- **Angular Documentation**: https://angular.dev
- **CoreUI Docs**: https://coreui.io/angular/docs/
- **ElysiaJS Docs**: https://elysiajs.com
- **Prisma Docs**: https://www.prisma.io/docs
- **Bun Documentation**: https://bun.sh/docs

---

## Conclusion

This document provides a high-level overview of the AngularClinic application. As you work with the codebase, you'll discover more patterns and conventions. Always refer to existing code for examples, and don't hesitate to improve this documentation as you learn more about the system.

Happy coding! 🚀
