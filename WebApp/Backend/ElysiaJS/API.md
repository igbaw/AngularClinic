# API Surface (Draft)

Base URL: /api
Auth: HttpOnly cookie session; frontend must send credentials. Use /auth/me to bootstrap.
Pagination: page, pageSize; Searching: q (where applicable).

Auth
- POST /auth/login { email, password } → sets session cookie; returns { user }
- POST /auth/logout → clears session
- GET /auth/me → { user } or 401
- GET /auth/session → { active: boolean }
- POST /auth/change-password { currentPassword, newPassword } → { success: true }

Users (ADMIN only)
- GET /users?q=&role=&page=&pageSize= → list
- GET /users/{id} → User
- POST /users { email, fullName, role, active?, mustChangePassword?, doctorId? } → User
- PUT /users/{id} { fullName?, role?, active?, doctorId? } → User
- POST /users/{id}/reset-password → { temporaryPassword } (only returned once to ADMIN)
- DELETE /users/{id} → { success: true }

Roles
- ADMIN, DOCTOR, RECEPTIONIST
- Admin manages everything; Doctor manages own appointments and medical records; Receptionist manages patients, appointments, inventory (no medical records editing).

Patients
- GET /patients?q=&page=&pageSize= → { items:[...], page, pageSize, total }
- GET /patients/{id} → Patient
- POST /patients → Patient
- PUT /patients/{id} → Patient
- DELETE /patients/{id} → { success: true }

Doctors
- GET /doctors?q=&page=&pageSize= → list
- GET /doctors/{id}
- POST /doctors
- PUT /doctors/{id}
- DELETE /doctors/{id}

Appointments (overlaps allowed)
- GET /appointments?date=&doctorId=&patientId=&page=&pageSize=
- GET /appointments/{id}
- POST /appointments
- PUT /appointments/{id}
- DELETE /appointments/{id}

Medical Records (SOAP)
- GET /medical-records?patientId=&doctorId=&page=&pageSize=
- GET /medical-records/{id}
- POST /medical-records
- PUT /medical-records/{id}
- DELETE /medical-records/{id}

Files (attachments)
- POST /files (multipart/form-data: file) → { id, url, fileName, mimeType, size } (≤ 5MB; image/*, application/pdf, text/plain)

Inventory
- GET /inventory
- GET /inventory/{id}
- POST /inventory
- PUT /inventory/{id}
- DELETE /inventory/{id}
- GET /inventory/{id}/movements → list
- POST /inventory/{id}/movements → create movement (manual entry)

Prescriptions
- GET /prescriptions?patientId=&appointmentId=&page=&pageSize=
- GET /prescriptions/{id}
- POST /prescriptions → issues items and decrements stock

Notes
- All write endpoints validate payloads; IDs use UUIDs.
- Dates are ISO 8601 in UTC.
- Response errors follow ARCHITECTURE.md error model.
