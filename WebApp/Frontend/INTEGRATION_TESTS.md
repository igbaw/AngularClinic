# Integration Tests Guide

This guide explains how to run integration tests that call the actual backend API.

## Overview

We have two types of tests:

1. **Unit Tests** (`.spec.ts`) - Mock the API service, test components in isolation
2. **Integration Tests** (`.integration.spec.ts`) - Call the real backend API

## Prerequisites

Before running integration tests, you must:

### 1. Start the Backend Server

The backend API must be running on `http://localhost:8080`

```bash
# Navigate to backend directory
cd Backend/ElysiaJS

# Run the backend
bun run dev
# OR for production
bun run start
```

### 2. Verify Backend is Running

Open your browser or use curl to check:
```bash
curl http://localhost:8080/api/patients
```

You should get a valid response (even if empty array).

### 3. Database Setup

Make sure your database is:
- ✅ Running and accessible
- ✅ Migrations applied
- ✅ Optionally seeded with test data

## Running Tests

### Run Only Unit Tests (Default)
```bash
cd Frontend
npm test
```

### Run Only Integration Tests
```bash
npm test -- --include='**/*.integration.spec.ts'
```

### Run All Tests (Unit + Integration)
```bash
npm test -- --include='**/*.spec.ts'
```

### Run Specific Integration Test File
```bash
npm test -- --include='**/patients.integration.spec.ts'
```

## Integration Test Files

- `patients.integration.spec.ts` - Tests CRUD operations for patients
- `doctors.integration.spec.ts` - Tests CRUD operations for doctors  
- `appointments.integration.spec.ts` - Tests CRUD operations for appointments

## What Integration Tests Cover

Each integration test performs:

✅ **Create** - POST request to create new records
✅ **Read** - GET request to fetch records
✅ **Update** - PUT request to modify records
✅ **Delete** - DELETE request to remove records
✅ **Search/Filter** - GET with query parameters
✅ **Validation** - Tests backend validation errors

## Test Cleanup

Integration tests automatically clean up after themselves:
- Created test data is deleted in `afterEach()` hooks
- Even if tests fail, cleanup attempts to run
- Test data uses unique identifiers (timestamps) to avoid conflicts

## Troubleshooting

### "Failed to fetch patients" Error
- ✅ Check backend is running on port 8080
- ✅ Check CORS is enabled on backend
- ✅ Verify database connection

### "Connection refused" Error
- ✅ Backend is not running
- ✅ Backend is on different port (check `environment.development.ts`)

### Tests Timeout
- ✅ Backend is slow to respond
- ✅ Database queries taking too long
- ✅ Increase timeout in karma.conf.js:
  ```js
  jasmine: {
    timeoutInterval: 10000 // Increase from default
  }
  ```

### CORS Errors
CORS is already configured in your ElysiaJS backend (`src/app.ts`):
```typescript
// CORS is enabled via @elysiajs/cors
// Origin: http://localhost:4200 (configured in src/config/env.ts)
// If you need to change it, set CORS_ORIGIN environment variable
```

## CI/CD Considerations

For automated testing pipelines:

1. Start backend in test mode:
   ```bash
   cd Backend/ElysiaJS
   bun run dev
   ```

2. Use test database (not production!)

3. Run integration tests:
   ```bash
   npm test -- --include='**/*.integration.spec.ts' --watch=false --browsers=ChromeHeadless
   ```

4. Clean up test database after suite

## Configuration

Integration tests use the environment from:
```
src/environments/environment.development.ts
```

Key configuration:
- `apiBaseUrl: 'http://localhost:8080/api'`

To use different backend URL, either:
- Modify environment file
- Or create `environment.integration.ts` and configure Angular to use it

## Best Practices

✅ **DO** run unit tests frequently during development
✅ **DO** run integration tests before commits/PRs
✅ **DO** ensure backend and database are stable before running integration tests
✅ **DON'T** run integration tests against production database
✅ **DON'T** commit with failing integration tests

## Example Test Run

```bash
# Terminal 1: Start backend
cd Backend/ElysiaJS
bun run dev

# Terminal 2: Run integration tests
cd Frontend
npm test -- --include='**/*.integration.spec.ts'
```

Expected output:
```
Patients API Integration Tests
  ✓ should fetch list of patients from backend
  ✓ should create a new patient
  ✓ should create, read, update, and delete a patient (full CRUD)
  ✓ should search patients by query
  ✓ should validate patient data on backend

Doctors API Integration Tests
  ✓ should fetch list of doctors from backend
  ✓ should create a new doctor
  ✓ should perform full CRUD on doctor

Appointments API Integration Tests
  ✓ should fetch list of appointments from backend
  ✓ should create a new appointment
  ✓ should update appointment status
  ✓ should delete appointment

Executed 12 of 12 SUCCESS
```
