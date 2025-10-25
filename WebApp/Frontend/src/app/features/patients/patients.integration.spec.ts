import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';
import { Patient } from '../../core/models/patient';
import { PagedResult } from '../../core/models/common';

/**
 * Integration tests for Patients API
 * 
 * Prerequisites:
 * 1. Backend must be running on http://localhost:8080
 * 2. Database must be accessible and seeded with test data
 * 
 * To run: ng test --include=**\/*.integration.spec.ts
 */
describe('Patients API Integration Tests', () => {
  let apiService: ApiService;
  let createdPatientId: string | null = null;

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
    // Cleanup: delete created patient
    if (createdPatientId) {
      apiService.delete(`/patients/${createdPatientId}`).subscribe({
        next: () => {
          createdPatientId = null;
          done();
        },
        error: () => done() // Continue even if delete fails
      });
    } else {
      done();
    }
  });

  it('should fetch list of patients from backend', (done) => {
    apiService.get<PagedResult<Patient>>('/patients').subscribe({
      next: (result) => {
        expect(result).toBeDefined();
        expect(result.items).toBeDefined();
        expect(Array.isArray(result.items)).toBe(true);
        expect(result.total).toBeGreaterThanOrEqual(0);
        done();
      },
      error: (err) => {
        fail('Failed to fetch patients: ' + err.message);
        done();
      }
    });
  });

  it('should create a new patient', (done) => {
    const newPatient = {
      fullName: 'Integration Test Patient',
      dateOfBirth: '1990-01-01',
      gender: 'Male' as const,
      contactNumber: '1234567890',
      email: 'test@integration.com',
      address: '123 Test St',
      insuranceId: 'INS-TEST-001'
    };

    apiService.post<Patient>('/patients', newPatient).subscribe({
      next: (patient) => {
        expect(patient).toBeDefined();
        expect(patient.id).toBeDefined();
        expect(patient.fullName).toBe(newPatient.fullName);
        expect(patient.dateOfBirth).toBe(newPatient.dateOfBirth);
        expect(patient.gender).toBe(newPatient.gender);
        
        createdPatientId = patient.id;
        done();
      },
      error: (err) => {
        fail('Failed to create patient: ' + err.message);
        done();
      }
    });
  });

  it('should create, read, update, and delete a patient (full CRUD)', (done) => {
    const newPatient = {
      fullName: 'CRUD Test Patient',
      dateOfBirth: '1985-05-15',
      gender: 'Female' as const,
      contactNumber: '9876543210',
      email: 'crud@test.com'
    };

    // CREATE
    apiService.post<Patient>('/patients', newPatient).subscribe({
      next: (created) => {
        expect(created.id).toBeDefined();
        const patientId = created.id;

        // READ
        apiService.get<Patient>(`/patients/${patientId}`).subscribe({
          next: (retrieved) => {
            expect(retrieved.id).toBe(patientId);
            expect(retrieved.fullName).toBe(newPatient.fullName);

            // UPDATE
            const updatedData = {
              ...retrieved,
              fullName: 'CRUD Test Patient Updated',
              contactNumber: '1111111111'
            };

            apiService.put<Patient>(`/patients/${patientId}`, updatedData).subscribe({
              next: (updated) => {
                expect(updated.fullName).toBe('CRUD Test Patient Updated');
                expect(updated.contactNumber).toBe('1111111111');

                // DELETE
                apiService.delete(`/patients/${patientId}`).subscribe({
                  next: () => {
                    // Verify deletion by trying to read
                    apiService.get<Patient>(`/patients/${patientId}`).subscribe({
                      next: () => {
                        fail('Patient should have been deleted');
                        done();
                      },
                      error: () => {
                        // Expected error - patient not found
                        done();
                      }
                    });
                  },
                  error: (err) => {
                    fail('Failed to delete patient: ' + err.message);
                    done();
                  }
                });
              },
              error: (err) => {
                fail('Failed to update patient: ' + err.message);
                done();
              }
            });
          },
          error: (err) => {
            fail('Failed to read patient: ' + err.message);
            done();
          }
        });
      },
      error: (err) => {
        fail('Failed to create patient: ' + err.message);
        done();
      }
    });
  });

  it('should search patients by query', (done) => {
    // First create a patient with unique name
    const uniqueName = `Search Test Patient ${Date.now()}`;
    const newPatient = {
      fullName: uniqueName,
      dateOfBirth: '1992-03-20',
      gender: 'Other' as const
    };

    apiService.post<Patient>('/patients', newPatient).subscribe({
      next: (created) => {
        createdPatientId = created.id;

        // Search for the patient
        apiService.get<PagedResult<Patient>>('/patients', { q: uniqueName }).subscribe({
          next: (result) => {
            expect(result.items.length).toBeGreaterThan(0);
            const found = result.items.find(p => p.id === created.id);
            expect(found).toBeDefined();
            expect(found?.fullName).toBe(uniqueName);
            done();
          },
          error: (err) => {
            fail('Failed to search patients: ' + err.message);
            done();
          }
        });
      },
      error: (err) => {
        fail('Failed to create patient for search test: ' + err.message);
        done();
      }
    });
  });

  it('should validate patient data on backend', (done) => {
    const invalidPatient = {
      fullName: '', // Invalid: empty name
      dateOfBirth: '',
      gender: 'Male' as const
    };

    apiService.post<Patient>('/patients', invalidPatient).subscribe({
      next: () => {
        fail('Should have rejected invalid patient data');
        done();
      },
      error: (err) => {
        // Expected error - validation failed
        expect(err.status).toBeGreaterThanOrEqual(400);
        expect(err.status).toBeLessThan(500);
        done();
      }
    });
  });
});
