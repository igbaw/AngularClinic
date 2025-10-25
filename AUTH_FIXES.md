# Authentication Fixes - Cookie-Based Auth

## Problem
The frontend was using **token-based authentication** (expecting `accessToken` in localStorage), but the backend uses **cookie-based authentication** with HttpOnly secure cookies. This caused login failures with "Internal Error".

## Root Causes
1. **Mismatched auth models**: Frontend expected `{ accessToken, user }`, backend returns `{ user }`
2. **Wrong request format**: Frontend sent `{ username, password }`, backend expects `{ email, password }`
3. **Missing credentials**: HTTP requests didn't include `withCredentials: true` to send cookies
4. **Unnecessary token header**: Auth interceptor was adding Bearer token header

## Changes Made

### 1. Updated Auth Models (`src/app/core/models/auth.ts`)
- Changed `UserRole` to match backend: `'ADMIN' | 'DOCTOR' | 'RECEPTIONIST'`
- Updated `AuthUser` interface to match backend user schema (id, email, fullName, role, active, etc.)
- Changed `LoginRequest` from `username` to `email`
- Changed `LoginResponse` to only contain `user` (removed `accessToken`)

### 2. Updated ApiService (`src/app/core/services/api.service.ts`)
- Added `withCredentials: true` to all HTTP methods (GET, POST, PUT, DELETE)
- This ensures cookies are sent with every request

### 3. Updated AuthService (`src/app/core/services/auth.service.ts`)
- Removed localStorage token handling
- Removed `_token` signal (only using `_user` now)
- Updated `login()` to handle cookie-based response
- Added `initSession()` method to call `/auth/me` on app init
- Added `logout()` to call backend logout endpoint
- Added `changePassword()` method

### 4. Updated Auth Interceptor (`src/app/core/interceptors/auth.interceptor.ts`)
- Removed Bearer token logic
- Now just passes requests through (cookies are handled by `withCredentials`)

### 5. Updated Login Component
**TypeScript (`src/app/views/pages/login/login.component.ts`):**
- Changed form field from `username` to `email`
- Updated validators to include email validation
- Removed `setSession()` call (now handled automatically by AuthService)
- Added error handling

**Template (`src/app/views/pages/login/login.component.html`):**
- Changed input field from `username` to `email`
- Updated placeholder and autoComplete attributes

### 6. Database Seeding
- Ran `bun run db:seed` to create test users in the database

## Login Credentials

After seeding, you can use these credentials:

- **Admin**: `admin@example.com` / `ChangeMe123!`
- **Doctor 1**: `dr.sarah@clinic.com` / `Doctor123!`
- **Doctor 2**: `dr.michael@clinic.com` / `Doctor123!`

## How to Test

### 1. Start Backend
```powershell
cd WebApp\Backend\ElysiaJS
bun run dev
```
Backend should be running on http://localhost:8080

### 2. Start Frontend
```powershell
cd WebApp\Frontend
npm start
```
Frontend should be running on http://localhost:4200

### 3. Test Login
1. Navigate to http://localhost:4200/#/login
2. Enter: `admin@example.com` / `ChangeMe123!`
3. Click Login
4. Should redirect to dashboard with active session cookie

## How Cookie-Based Auth Works

1. **Login**: Frontend sends `{ email, password }` to `/api/auth/login`
2. **Backend**: Validates credentials and sets HttpOnly cookie `clinic_sess=<userId>`
3. **Subsequent Requests**: Browser automatically sends cookie with every request (due to `withCredentials: true`)
4. **Protected Routes**: Backend middleware reads cookie and validates user session
5. **Logout**: Frontend calls `/api/auth/logout`, backend deletes cookie

## Benefits of Cookie-Based Auth

✅ **More secure**: Token can't be accessed by JavaScript (XSS protection)
✅ **Automatic**: Browser handles cookie sending
✅ **Simpler**: No need to manually add Authorization headers
✅ **Better for web apps**: Standard approach for browser-based applications

## Next Steps

- [ ] Update app initialization to call `authService.initSession()` on startup
- [ ] Update logout button to call `authService.logout().subscribe()`
- [ ] Add proper error messages in login UI
- [ ] Update mock API interceptor if you need to re-enable mock mode
- [ ] Consider adding CSRF protection for production
