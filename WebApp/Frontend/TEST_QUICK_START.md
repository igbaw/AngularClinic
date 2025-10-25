# Quick Start - Testing Guide

## 🎯 Two Types of Tests

### 1. Unit Tests (Fast, No Backend Required)
Tests components in isolation with mocked dependencies.

```bash
cd Frontend
npm test
```

### 2. Integration Tests (Requires Backend)
Tests actual API calls to the backend.

```bash
# Manual Method - Two terminals:

# Terminal 1: Start backend
cd Backend/ElysiaJS
bun run dev

# Terminal 2: Run tests
cd Frontend
npm test -- --include='**/*.integration.spec.ts'
```

**OR use the automated script:**

```powershell
# From WebApp root directory
.\run-integration-tests.ps1
```

This script automatically:
- ✅ Starts the backend
- ✅ Waits for it to be ready
- ✅ Runs integration tests
- ✅ Stops the backend when done

## ⚡ Quick Commands

```bash
# Run all unit tests
npm test

# Run integration tests only (backend must be running)
npm test -- --include='**/*.integration.spec.ts'

# Run specific test file
npm test -- --include='**/patients.integration.spec.ts'

# Run tests without watch mode (for CI)
npm test -- --watch=false --browsers=ChromeHeadless
```

## ✅ Prerequisites for Integration Tests

1. **Bun installed** - Backend uses Bun runtime
2. **Database ready** - SQLite file or configured database
3. **Backend running** on http://localhost:8080
4. **Dependencies installed**:
   ```bash
   cd Backend/ElysiaJS
   bun install
   
   cd Frontend
   npm install
   ```

## 🔍 Verify Backend is Running

Open browser or use curl:
```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{"status":"ok"}
```

## 📝 Test Files

**Unit Tests:**
- `src/app/core/services/api.service.spec.ts`
- `src/app/features/patients/views/*.spec.ts`
- `src/app/features/doctors/views/*.spec.ts`
- `src/app/features/appointments/views/*.spec.ts`
- `src/app/features/medical-records/views/*.spec.ts`

**Integration Tests:**
- `src/app/features/patients/patients.integration.spec.ts`
- `src/app/features/doctors/doctors.integration.spec.ts`
- `src/app/features/appointments/appointments.integration.spec.ts`

## 🐛 Common Issues

### "Connection refused" or "Failed to fetch"
- ❌ Backend not running
- ✅ Start backend: `cd Backend/ElysiaJS && bun run dev`

### "Port already in use"
- ❌ Another process using port 8080
- ✅ Kill the process or change port in `Backend/ElysiaJS/src/config/env.ts`

### Tests timeout
- ❌ Backend is slow or database issues
- ✅ Check backend logs
- ✅ Ensure database is accessible

### Bun not found
- ❌ Bun not installed
- ✅ Install: `curl -fsSL https://bun.sh/install | bash` (Mac/Linux)
- ✅ Install: `powershell -c "irm bun.sh/install.ps1 | iex"` (Windows)

## 📊 Expected Output

```
Patients API Integration Tests
  ✓ should fetch list of patients from backend (234ms)
  ✓ should create a new patient (156ms)
  ✓ should create, read, update, and delete a patient (full CRUD) (423ms)
  ✓ should search patients by query (287ms)
  ✓ should validate patient data on backend (89ms)

Doctors API Integration Tests
  ✓ should fetch list of doctors from backend (198ms)
  ✓ should create a new doctor (145ms)
  ✓ should perform full CRUD on doctor (389ms)

Appointments API Integration Tests
  ✓ should fetch list of appointments from backend (176ms)
  ✓ should create a new appointment (234ms)
  ✓ should update appointment status (298ms)
  ✓ should delete appointment (187ms)

Chrome Headless: Executed 12 of 12 SUCCESS (3.412 secs / 2.816 secs)
```

## 🎓 More Details

For comprehensive documentation, see [INTEGRATION_TESTS.md](./INTEGRATION_TESTS.md)
