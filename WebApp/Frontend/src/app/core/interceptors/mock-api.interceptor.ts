import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../../environments/environment';
import { Patient } from '../models/patient';
import { Doctor } from '../models/doctor';
import { LoginRequest, LoginResponse } from '../models/auth';
import { Appointment } from '../models/appointment';
import { MedicalRecord } from '../models/medical-record';
import { Attachment } from '../models/common';

const LS = {
  patients: 'mock.patients',
  doctors: 'mock.doctors',
  appointments: 'mock.appointments',
  medicalRecords: 'mock.medicalRecords',
  files: 'mock.files'
} as const;

function readPatients(): Patient[] {
  const raw = localStorage.getItem(LS.patients);
  if (!raw) return [];
  try { return JSON.parse(raw) as Patient[]; } catch { return []; }
}

function writePatients(items: Patient[]) {
  localStorage.setItem(LS.patients, JSON.stringify(items));
}

function readDoctors(): Doctor[] {
  const raw = localStorage.getItem(LS.doctors);
  if (!raw) return [];
  try { return JSON.parse(raw) as Doctor[]; } catch { return []; }
}

function writeDoctors(items: Doctor[]) {
  localStorage.setItem(LS.doctors, JSON.stringify(items));
}

function readAppointments(): Appointment[] {
  const raw = localStorage.getItem(LS.appointments);
  if (!raw) return [];
  try { return JSON.parse(raw) as Appointment[]; } catch { return []; }
}

function writeAppointments(items: Appointment[]) {
  localStorage.setItem(LS.appointments, JSON.stringify(items));
}

function readMedicalRecords(): MedicalRecord[] {
  const raw = localStorage.getItem(LS.medicalRecords);
  if (!raw) return [];
  try { return JSON.parse(raw) as MedicalRecord[]; } catch { return []; }
}

function writeMedicalRecords(items: MedicalRecord[]) {
  localStorage.setItem(LS.medicalRecords, JSON.stringify(items));
}

function readFiles(): Attachment[] {
  const raw = localStorage.getItem(LS.files);
  if (!raw) return [];
  try { return JSON.parse(raw) as Attachment[]; } catch { return []; }
}

function writeFiles(items: Attachment[]) {
  localStorage.setItem(LS.files, JSON.stringify(items));
}

function seedIfNeeded() {
  if (!environment.mock || !environment.mock.seed) return;
  const now = new Date().toISOString();

  const currentPatients = readPatients();
  if (currentPatients.length === 0) {
    const seedPatients: Patient[] = [
      { id: uuidv4(), full_name: 'Budi Santoso', date_of_birth: '1985-03-12', gender: 'Male', contact_number: '08123456789', email: 'budi@example.com', address: 'Jakarta', created_at: now, updated_at: now },
      { id: uuidv4(), full_name: 'Siti Aminah', date_of_birth: '1990-07-22', gender: 'Female', contact_number: '08129876543', email: 'siti@example.com', address: 'Bandung', created_at: now, updated_at: now }
    ];
    writePatients(seedPatients);
  }

  const currentDoctors = readDoctors();
  if (currentDoctors.length === 0) {
    const seedDoctors: Doctor[] = [
      { id: uuidv4(), full_name: 'dr. Andi Pratama, Sp.THT', specialization: 'THT', license_number: 'LIC-123456', sip: 'SIP-987654', contact_number: '0812000111', email: 'andi@example.com', availability: { Mon: ['17:00-19:00'] }, created_at: now, updated_at: now }
    ];
    writeDoctors(seedDoctors);
  }

  const currentAppointments = readAppointments();
  if (currentAppointments.length === 0) {
    const p = readPatients()[0];
    const d = readDoctors()[0];
    if (p && d) {
      const start = new Date();
      start.setMinutes(0,0,0);
      const appt: Appointment = {
        id: uuidv4(),
        patient_id: p.id,
        doctor_id: d.id,
        appointment_date: new Date(start.getTime() + 60*60*1000).toISOString(),
        status: 'Confirmed',
        notes: 'Kunjungan awal',
        created_at: now,
        updated_at: now
      };
      writeAppointments([appt]);
    }
  }
}

function ok<T>(body: T): Observable<HttpEvent<T>> {
  const res = new HttpResponse({ status: 200, body });
  const latency = environment.mock?.latencyMs ?? 0;
  return of(res).pipe(delay(latency));
}

function unauthorized(message = 'Unauthorized') {
  return throwError(() => ({ status: 401, message }));
}

function isApiUrl(url: string) {
  return url.startsWith(environment.apiBaseUrl);
}

export const mockApiInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  if (!environment.useMockApi || !isApiUrl(req.url)) {
    return next(req);
  }

  seedIfNeeded();

  const { method } = req;
  const url = req.url.replace(environment.apiBaseUrl, '');

  // Simple auth check: require token for non-auth endpoints
  const isAuthEndpoint = url.startsWith('/auth/');
  const token = localStorage.getItem('accessToken');
  if (!isAuthEndpoint && !token) {
    return unauthorized();
  }

  // Routes
  if (url === '/auth/login' && method === 'POST') {
    const body = req.body as LoginRequest;
    const role = body.username?.toLowerCase().includes('admin') ? 'Admin' : 'Doctor';
    const payload = { sub: uuidv4(), name: body.username || 'User', role };
    const base64 = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })) + '.' + btoa(JSON.stringify(payload)) + '.';
    const resp: LoginResponse = { accessToken: base64, user: { id: payload.sub, name: payload.name, role } as any };
    return ok(resp);
  }

  if (url.startsWith('/patients')) {
    const parts = url.split('/').filter(Boolean); // ['patients', ':id?']
    const items = readPatients();

    if (method === 'GET' && parts.length === 1) {
      const q = (req.params.get('q') || '').toLowerCase();
      const filtered = q ? items.filter(p => (p.full_name + (p.contact_number ?? '')).toLowerCase().includes(q)) : items;
      return ok({ items: filtered, total: filtered.length });
    }

    if (method === 'GET' && parts.length === 2) {
      const id = parts[1];
      const found = items.find(p => p.id === id);
      return ok(found ?? null);
    }

    if (method === 'POST' && parts.length === 1) {
      const now = new Date().toISOString();
      const body = req.body as Partial<Patient>;
      const item: Patient = {
        id: uuidv4(),
        full_name: body.full_name || '',
        date_of_birth: body.date_of_birth || '2000-01-01',
        gender: (body.gender as any) || 'Other',
        contact_number: body.contact_number,
        email: body.email,
        address: body.address,
        insurance_id: body.insurance_id,
        created_at: now,
        updated_at: now
      };
      items.push(item);
      writePatients(items);
      return ok(item);
    }

    if (method === 'PUT' && parts.length === 2) {
      const id = parts[1];
      const idx = items.findIndex(p => p.id === id);
      if (idx === -1) return ok(null as any);
      const now = new Date().toISOString();
      items[idx] = { ...items[idx], ...req.body, id, updated_at: now } as Patient;
      writePatients(items);
      return ok(items[idx]);
    }

    if (method === 'DELETE' && parts.length === 2) {
      const id = parts[1];
      const nextItems = items.filter(p => p.id !== id);
      writePatients(nextItems);
      return ok({ success: true });
    }
  }

  if (url.startsWith('/doctors')) {
    const parts = url.split('/').filter(Boolean); // ['doctors', ':id?']
    const items = readDoctors();

    if (method === 'GET' && parts.length === 1) {
      const q = (req.params.get('q') || '').toLowerCase();
      const filtered = q ? items.filter(d => (d.full_name + (d.contact_number ?? '') + (d.specialization ?? '')).toLowerCase().includes(q)) : items;
      return ok({ items: filtered, total: filtered.length });
    }

    if (method === 'GET' && parts.length === 2) {
      const id = parts[1];
      const found = items.find(d => d.id === id);
      return ok(found ?? null);
    }

    if (method === 'POST' && parts.length === 1) {
      const now = new Date().toISOString();
      const body = req.body as Partial<Doctor>;
      const item: Doctor = {
        id: uuidv4(),
        full_name: body.full_name || '',
        specialization: body.specialization,
        license_number: body.license_number || '',
        sip: body.sip || '',
        contact_number: body.contact_number,
        email: body.email,
        availability: body.availability,
        created_at: now,
        updated_at: now
      };
      items.push(item);
      writeDoctors(items);
      return ok(item);
    }

    if (method === 'PUT' && parts.length === 2) {
      const id = parts[1];
      const idx = items.findIndex(d => d.id === id);
      if (idx === -1) return ok(null as any);
      const now = new Date().toISOString();
      items[idx] = { ...items[idx], ...req.body, id, updated_at: now } as Doctor;
      writeDoctors(items);
      return ok(items[idx]);
    }

    if (method === 'DELETE' && parts.length === 2) {
      const id = parts[1];
      const nextItems = items.filter(d => d.id !== id);
      writeDoctors(nextItems);
      return ok({ success: true });
    }
  }

  if (url.startsWith('/appointments')) {
    const parts = url.split('/').filter(Boolean); // ['appointments', ':id?']
    const items = readAppointments();

    if (method === 'GET' && parts.length === 1) {
      return ok({ items, total: items.length });
    }

    if (method === 'GET' && parts.length === 2) {
      const id = parts[1];
      const found = items.find(a => a.id === id);
      return ok(found ?? null);
    }

    if (method === 'POST' && parts.length === 1) {
      const now = new Date().toISOString();
      const body = req.body as Partial<Appointment>;
      const item: Appointment = {
        id: uuidv4(),
        patient_id: body.patient_id!,
        doctor_id: body.doctor_id!,
        appointment_date: body.appointment_date || new Date().toISOString(),
        status: (body.status as any) || 'Pending',
        notes: body.notes,
        created_at: now,
        updated_at: now
      };
      items.push(item);
      writeAppointments(items);
      return ok(item);
    }

    if (method === 'PUT' && parts.length === 2) {
      const id = parts[1];
      const idx = items.findIndex(a => a.id === id);
      if (idx === -1) return ok(null as any);
      const now = new Date().toISOString();
      items[idx] = { ...items[idx], ...req.body, id, updated_at: now } as Appointment;
      writeAppointments(items);
      return ok(items[idx]);
    }

    if (method === 'DELETE' && parts.length === 2) {
      const id = parts[1];
      const nextItems = items.filter(a => a.id !== id);
      writeAppointments(nextItems);
      return ok({ success: true });
    }
  }

  if (url.startsWith('/medical-records')) {
    const parts = url.split('/').filter(Boolean); // ['medical-records', ':id?']
    const items = readMedicalRecords();

    if (method === 'GET' && parts.length === 1) {
      const patientId = req.params.get('patientId');
      const filtered = patientId ? items.filter(r => r.patient_id === patientId) : items;
      return ok({ items: filtered, total: filtered.length });
    }

    if (method === 'GET' && parts.length === 2) {
      const id = parts[1];
      const found = items.find(r => r.id === id);
      return ok(found ?? null);
    }

    if (method === 'POST' && parts.length === 1) {
      const now = new Date().toISOString();
      const body = req.body as Partial<MedicalRecord>;
      const item: MedicalRecord = {
        id: uuidv4(),
        patient_id: body.patient_id!,
        doctor_id: body.doctor_id!,
        record_number: body.record_number || uuidv4().slice(0,8).toUpperCase(),
        subjective: body.subjective || '',
        objective: body.objective || '',
        assessment: body.assessment || '',
        plan: body.plan || '',
        attachments: body.attachments || [],
        signed_by: body.signed_by,
        signed_at: body.signed_at,
        created_at: now,
        updated_at: now
      };
      items.push(item);
      writeMedicalRecords(items);
      return ok(item);
    }

    if (method === 'PUT' && parts.length === 2) {
      const id = parts[1];
      const idx = items.findIndex(r => r.id === id);
      if (idx === -1) return ok(null as any);
      const now = new Date().toISOString();
      items[idx] = { ...items[idx], ...req.body, id, updated_at: now } as MedicalRecord;
      writeMedicalRecords(items);
      return ok(items[idx]);
    }

    if (method === 'DELETE' && parts.length === 2) {
      const id = parts[1];
      const nextItems = items.filter(r => r.id !== id);
      writeMedicalRecords(nextItems);
      return ok({ success: true });
    }
  }

  if (url === '/files' && method === 'POST') {
    const max = (environment.upload?.maxSizeMB ?? 5) * 1024 * 1024;
    const allowed = environment.upload?.allowedMimeTypes ?? [];
    const body = req.body as any;
    if (!body || !body.mimeType || !body.size || !body.fileName || !body.dataUrl) {
      return throwError(() => ({ status: 400, message: 'Bad Request' }));
    }
    if (body.size > max) return throwError(() => ({ status: 413, message: 'File too large' }));
    const okType = allowed.some((t: string) => t.endsWith('/*') ? body.mimeType.startsWith(t.slice(0,-1)) : t === body.mimeType);
    if (!okType) return throwError(() => ({ status: 415, message: 'Unsupported Media Type' }));

    const files = readFiles();
    const att: Attachment = { id: uuidv4(), url: body.dataUrl, fileName: body.fileName, mimeType: body.mimeType, size: body.size };
    files.push(att);
    writeFiles(files);
    return ok(att);
  }

  // Fallback to real HTTP if not handled
  return next(req);
};
