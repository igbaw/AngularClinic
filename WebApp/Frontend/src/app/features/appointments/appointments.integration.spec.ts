import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';
import { Appointment } from '../../core/models/appointment';
import { Patient } from '../../core/models/patient';
import { Doctor } from '../../core/models/doctor';
import { PagedResult } from '../../core/models/common';

describe('Appointments API Integration Tests', () => {
  let apiService: ApiService;
  let testPatientId: string | null = null;
  let testDoctorId: string | null = null;
  let createdAppointmentId: string | null = null;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        ApiService
      ]
    });
    apiService = TestBed.inject(ApiService);

    // Create test patient and doctor for appointments
    const patient = {
      fullName: 'Appointment Test Patient',
      dateOfBirth: '1990-01-01',
      gender: 'Male' as const
    };

    const doctor = {
      fullName: 'Dr. Appointment Test',
      licenseNumber: `LIC-APT-${Date.now()}`,
      sip: `SIP-APT-${Date.now()}`
    };

    apiService.post<Patient>('/patients', patient).subscribe({
      next: (p) => {
        testPatientId = p.id;
        apiService.post<Doctor>('/doctors', doctor).subscribe({
          next: (d) => {
            testDoctorId = d.id;
            done();
          },
          error: (err) => { fail('Failed to create doctor: ' + err.message); done(); }
        });
      },
      error: (err) => { fail('Failed to create patient: ' + err.message); done(); }
    });
  });

  afterEach((done) => {
    let completed = 0;
    const checkDone = () => {
      completed++;
      if (completed >= 3) done();
    };

    if (createdAppointmentId) {
      apiService.delete(`/appointments/${createdAppointmentId}`).subscribe({
        next: () => {
          createdAppointmentId = null;
          checkDone();
        },
        error: () => checkDone()
      });
    } else {
      checkDone();
    }

    if (testPatientId) {
      apiService.delete(`/patients/${testPatientId}`).subscribe({
        next: () => {
          testPatientId = null;
          checkDone();
        },
        error: () => checkDone()
      });
    } else {
      checkDone();
    }

    if (testDoctorId) {
      apiService.delete(`/doctors/${testDoctorId}`).subscribe({
        next: () => {
          testDoctorId = null;
          checkDone();
        },
        error: () => checkDone()
      });
    } else {
      checkDone();
    }
  });

  it('should fetch list of appointments from backend', (done) => {
    apiService.get<PagedResult<Appointment>>('/appointments').subscribe({
      next: (result) => {
        expect(result).toBeDefined();
        expect(result.items).toBeDefined();
        expect(Array.isArray(result.items)).toBe(true);
        done();
      },
      error: (err) => {
        fail('Failed to fetch appointments: ' + err.message);
        done();
      }
    });
  });

  it('should create a new appointment', (done) => {
    if (!testPatientId || !testDoctorId) {
      fail('Test patient or doctor not created');
      done();
      return;
    }

    const newAppointment = {
      patientId: testPatientId,
      doctorId: testDoctorId,
      appointmentDate: '2025-12-01T10:00:00Z',
      status: 'Pending' as const,
      notes: 'Integration test appointment'
    };

    apiService.post<Appointment>('/appointments', newAppointment).subscribe({
      next: (appointment) => {
        expect(appointment).toBeDefined();
        expect(appointment.id).toBeDefined();
        expect(appointment.patientId).toBe(testPatientId!);
        expect(appointment.doctorId).toBe(testDoctorId!);
        expect(appointment.status).toBe('Pending');
        
        createdAppointmentId = appointment.id;
        done();
      },
      error: (err) => {
        fail('Failed to create appointment: ' + err.message);
        done();
      }
    });
  });

  it('should update appointment status', (done) => {
    if (!testPatientId || !testDoctorId) {
      fail('Test patient or doctor not created');
      done();
      return;
    }

    const newAppointment = {
      patientId: testPatientId,
      doctorId: testDoctorId,
      appointmentDate: '2025-12-02T14:00:00Z',
      status: 'Pending' as const
    };

    apiService.post<Appointment>('/appointments', newAppointment).subscribe({
      next: (created) => {
        createdAppointmentId = created.id;

        const updatedData = {
          ...created,
          status: 'Confirmed' as const
        };

        apiService.put<Appointment>(`/appointments/${created.id}`, updatedData).subscribe({
          next: (updated) => {
            expect(updated.status).toBe('Confirmed');
            done();
          },
          error: (err) => {
            fail('Failed to update appointment: ' + err.message);
            done();
          }
        });
      },
      error: (err) => {
        fail('Failed to create appointment: ' + err.message);
        done();
      }
    });
  });

  it('should delete appointment', (done) => {
    if (!testPatientId || !testDoctorId) {
      fail('Test patient or doctor not created');
      done();
      return;
    }

    const newAppointment = {
      patientId: testPatientId,
      doctorId: testDoctorId,
      appointmentDate: '2025-12-03T16:00:00Z',
      status: 'Pending' as const
    };

    apiService.post<Appointment>('/appointments', newAppointment).subscribe({
      next: (created) => {
        apiService.delete(`/appointments/${created.id}`).subscribe({
          next: () => {
            createdAppointmentId = null;
            done();
          },
          error: (err) => {
            fail('Failed to delete appointment: ' + err.message);
            done();
          }
        });
      },
      error: (err) => {
        fail('Failed to create appointment: ' + err.message);
        done();
      }
    });
  });
});
