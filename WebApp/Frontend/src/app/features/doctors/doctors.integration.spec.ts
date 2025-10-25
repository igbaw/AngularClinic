import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';
import { Doctor } from '../../core/models/doctor';
import { PagedResult } from '../../core/models/common';

describe('Doctors API Integration Tests', () => {
  let apiService: ApiService;
  let createdDoctorId: string | null = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        ApiService
      ]
    });
    apiService = TestBed.inject(ApiService);
  });

  afterEach((done) => {
    if (createdDoctorId) {
      apiService.delete(`/doctors/${createdDoctorId}`).subscribe({
        next: () => {
          createdDoctorId = null;
          done();
        },
        error: () => done()
      });
    } else {
      done();
    }
  });

  it('should fetch list of doctors from backend', (done) => {
    apiService.get<PagedResult<Doctor>>('/doctors').subscribe({
      next: (result) => {
        expect(result).toBeDefined();
        expect(result.items).toBeDefined();
        expect(Array.isArray(result.items)).toBe(true);
        expect(result.total).toBeGreaterThanOrEqual(0);
        done();
      },
      error: (err) => {
        fail('Failed to fetch doctors: ' + err.message);
        done();
      }
    });
  });

  it('should create a new doctor', (done) => {
    const newDoctor = {
      fullName: 'Dr. Integration Test',
      specialization: 'General Practice',
      licenseNumber: `LIC-${Date.now()}`,
      sip: `SIP-${Date.now()}`,
      contactNumber: '1234567890',
      email: 'doctor@integration.com'
    };

    apiService.post<Doctor>('/doctors', newDoctor).subscribe({
      next: (doctor) => {
        expect(doctor).toBeDefined();
        expect(doctor.id).toBeDefined();
        expect(doctor.fullName).toBe(newDoctor.fullName);
        expect(doctor.licenseNumber).toBe(newDoctor.licenseNumber);
        
        createdDoctorId = doctor.id;
        done();
      },
      error: (err) => {
        fail('Failed to create doctor: ' + err.message);
        done();
      }
    });
  });

  it('should perform full CRUD on doctor', (done) => {
    const newDoctor = {
      fullName: 'Dr. CRUD Test',
      specialization: 'Cardiology',
      licenseNumber: `LIC-CRUD-${Date.now()}`,
      sip: `SIP-CRUD-${Date.now()}`
    };

    // CREATE
    apiService.post<Doctor>('/doctors', newDoctor).subscribe({
      next: (created) => {
        const doctorId = created.id;

        // READ
        apiService.get<Doctor>(`/doctors/${doctorId}`).subscribe({
          next: (retrieved) => {
            expect(retrieved.fullName).toBe(newDoctor.fullName);

            // UPDATE
            const updatedData = {
              ...retrieved,
              specialization: 'Neurology'
            };

            apiService.put<Doctor>(`/doctors/${doctorId}`, updatedData).subscribe({
              next: (updated) => {
                expect(updated.specialization).toBe('Neurology');

                // DELETE
                apiService.delete(`/doctors/${doctorId}`).subscribe({
                  next: () => done(),
                  error: (err) => {
                    fail('Failed to delete: ' + err.message);
                    done();
                  }
                });
              },
              error: (err) => {
                fail('Failed to update: ' + err.message);
                done();
              }
            });
          },
          error: (err) => {
            fail('Failed to read: ' + err.message);
            done();
          }
        });
      },
      error: (err) => {
        fail('Failed to create: ' + err.message);
        done();
      }
    });
  });
});
