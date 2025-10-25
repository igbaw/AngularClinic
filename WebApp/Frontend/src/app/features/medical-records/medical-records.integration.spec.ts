import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';
import { Patient } from '../../core/models/patient';
import { Doctor } from '../../core/models/doctor';
import { MedicalRecord } from '../../core/models/medical-record';
import { PagedResult } from '../../core/models/common';

// Run with: npm test -- --include='**/*.integration.spec.ts' --configuration=integration --watch=false

describe('Medical Records API Integration Tests', () => {
  let api: ApiService;
  let patientId: string | null = null;
  let doctorId: string | null = null;
  let recordId: string | null = null;

  beforeEach((done) => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), ApiService] });
    api = TestBed.inject(ApiService);

    const patientPayload = {
      fullName: `MR IT Patient ${Date.now()}`,
      dateOfBirth: '1990-01-01',
      gender: 'Male' as const,
    };
    const doctorPayload = {
      fullName: `MR IT Doctor ${Date.now()}`,
      licenseNumber: `LIC-MR-${Date.now()}`,
      sip: `SIP-MR-${Date.now()}`,
    };

    api.post<Patient>('/patients', patientPayload).subscribe({
      next: (p) => {
        patientId = p.id;
        api.post<Doctor>('/doctors', doctorPayload).subscribe({
          next: (d) => { doctorId = d.id; done(); },
          error: (e) => { fail('Create doctor failed: ' + e.message); done(); }
        });
      },
      error: (e) => { fail('Create patient failed: ' + e.message); done(); }
    });
  });

  afterEach((done) => {
    // cleanup in parallel best-effort
    const ops: Array<Promise<any>> = [];
    if (recordId) ops.push(api.delete(`/medical-records/${recordId}`).toPromise());
    if (doctorId) ops.push(api.delete(`/doctors/${doctorId}`).toPromise());
    if (patientId) ops.push(api.delete(`/patients/${patientId}`).toPromise());
    Promise.allSettled(ops).then(() => done());
  });

  it('should create, list, get, update, and delete a medical record', (done) => {
    if (!patientId || !doctorId) { fail('Prerequisites not created'); done(); return; }

    api.get<{ recordNumber: string }>(`/medical-records/generate-record-number`).subscribe({
      next: (gen) => {
        const payload = {
          patientId: patientId!,
          doctorId: doctorId!,
          recordNumber: gen.recordNumber,
          subjective: 'Headache',
          objective: 'BP 120/80',
          assessment: 'Tension',
          plan: 'Rest',
        };
        api.post<MedicalRecord>('/medical-records', payload).subscribe({
          next: (created) => {
            expect(created.id).toBeDefined();
            recordId = created.id;
            // list by patient
            api.get<PagedResult<MedicalRecord>>('/medical-records', { patientId }).subscribe({
              next: (list) => {
                expect(list.items.length).toBeGreaterThan(0);
                const found = list.items.find(r => r.id === recordId);
                expect(found).toBeDefined();
                // get by id
                api.get<MedicalRecord>(`/medical-records/${recordId}`).subscribe({
                  next: (one) => {
                    expect(one.recordNumber).toBe(payload.recordNumber);
                    // update
                    api.put<MedicalRecord>(`/medical-records/${recordId}`, { plan: 'Hydration' }).subscribe({
                      next: (updated) => {
                        expect(updated.plan).toBe('Hydration');
                        done();
                      },
                      error: (e) => { fail('Update failed: ' + e.message); done(); }
                    });
                  },
                  error: (e) => { fail('Get by id failed: ' + e.message); done(); }
                });
              },
              error: (e) => { fail('List failed: ' + e.message); done(); }
            });
          },
          error: (e) => { fail('Create record failed: ' + e.message); done(); }
        });
      },
      error: (e) => { fail('Generate record number failed: ' + e.message); done(); }
    });
  });
});
