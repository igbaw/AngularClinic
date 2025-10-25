import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentsCalendarComponent } from './appointments-calendar.component';
import { ApiService } from '../../../core/services/api.service';
import { of } from 'rxjs';
import { Appointment } from '../../../core/models/appointment';
import { Patient } from '../../../core/models/patient';
import { Doctor } from '../../../core/models/doctor';
import { PagedResult } from '../../../core/models/common';

describe('AppointmentsCalendarComponent', () => {
  let component: AppointmentsCalendarComponent;
  let fixture: ComponentFixture<AppointmentsCalendarComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockPatients: Patient[] = [
    {
      id: 'p1',
      fullName: 'John Doe',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }
  ];

  const mockDoctors: Doctor[] = [
    {
      id: 'd1',
      fullName: 'Dr. Smith',
      licenseNumber: 'LIC001',
      sip: 'SIP001',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }
  ];

  const mockAppointments: Appointment[] = [
    {
      id: 'a1',
      patientId: 'p1',
      doctorId: 'd1',
      appointmentDate: '2025-10-24T10:00:00Z',
      status: 'Pending',
      notes: 'Test appointment',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'a2',
      patientId: 'p1',
      doctorId: 'd1',
      appointmentDate: '2025-10-25T14:00:00Z',
      status: 'Confirmed',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put', 'delete']);

    await TestBed.configureTestingModule({
      imports: [AppointmentsCalendarComponent],
      providers: [
        { provide: ApiService, useValue: spy }
      ]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  beforeEach(() => {
    const patientsResult: PagedResult<Patient> = { items: mockPatients, total: 1 };
    const doctorsResult: PagedResult<Doctor> = { items: mockDoctors, total: 1 };
    const appointmentsResult: PagedResult<Appointment> = { items: mockAppointments, total: 2 };

    apiServiceSpy.get.and.callFake((url: string) => {
      if (url === '/patients') return of(patientsResult);
      if (url === '/doctors') return of(doctorsResult);
      if (url === '/appointments') return of(appointmentsResult);
      return of(null as any);
    });

    fixture = TestBed.createComponent(AppointmentsCalendarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load patients, doctors and appointments on init', () => {
    component.ngOnInit();

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/patients');
    expect(apiServiceSpy.get).toHaveBeenCalledWith('/doctors');
    expect(apiServiceSpy.get).toHaveBeenCalledWith('/appointments');
    expect(component.patients()).toEqual(mockPatients);
    expect(component.doctors()).toEqual(mockDoctors);
    expect(component.appointments()).toEqual(mockAppointments);
  });

  it('should convert appointments to calendar events', () => {
    component.ngOnInit();

    const events = component.toEvents();

    expect(events.length).toBe(2);
    expect(events[0].id).toBe('a1');
    expect(events[0].title).toContain('John Doe');
    expect(events[0].title).toContain('Dr. Smith');
    expect(events[0].start).toBe('2025-10-24T10:00:00Z');
  });

  it('should assign correct colors based on appointment status', () => {
    component.ngOnInit();

    const events = component.toEvents();

    const pendingEvent = events.find(e => e.id === 'a1');
    const confirmedEvent = events.find(e => e.id === 'a2');

    expect(pendingEvent?.color).toBe('#ffc107'); // Pending = yellow
    expect(confirmedEvent?.color).toBe('#198754'); // Confirmed = green
  });

  it('should create new appointment when saving without ID', () => {
    apiServiceSpy.post.and.returnValue(of(mockAppointments[0]));
    apiServiceSpy.get.and.returnValue(of({ items: mockAppointments, total: 2 }));

    fixture = TestBed.createComponent(AppointmentsCalendarComponent);
    component = fixture.componentInstance;

    component.form.patchValue({
      patientId: 'p1',
      doctorId: 'd1',
      appointmentDate: '2025-10-24T10:00',
      status: 'Pending',
      notes: 'New appointment'
    });

    component.save();

    expect(apiServiceSpy.post).toHaveBeenCalledWith('/appointments', jasmine.objectContaining({
      patientId: 'p1',
      doctorId: 'd1',
      status: 'Pending'
    }));
  });

  it('should update existing appointment when saving with ID', () => {
    apiServiceSpy.put.and.returnValue(of(mockAppointments[0]));
    apiServiceSpy.get.and.returnValue(of({ items: mockAppointments, total: 2 }));

    fixture = TestBed.createComponent(AppointmentsCalendarComponent);
    component = fixture.componentInstance;
    component.selectedId.set('a1');

    component.form.patchValue({
      patientId: 'p1',
      doctorId: 'd1',
      appointmentDate: '2025-10-24T10:00',
      status: 'Confirmed',
      notes: 'Updated appointment'
    });

    component.save();

    expect(apiServiceSpy.put).toHaveBeenCalledWith('/appointments/a1', jasmine.objectContaining({
      patientId: 'p1',
      doctorId: 'd1',
      status: 'Confirmed'
    }));
  });

  it('should not save when form is invalid', () => {
    fixture = TestBed.createComponent(AppointmentsCalendarComponent);
    component = fixture.componentInstance;

    component.form.patchValue({
      patientId: '',
      doctorId: '',
      appointmentDate: ''
    });

    component.save();

    expect(apiServiceSpy.post).not.toHaveBeenCalled();
    expect(apiServiceSpy.put).not.toHaveBeenCalled();
  });

  it('should delete appointment', () => {
    apiServiceSpy.delete.and.returnValue(of(null));
    apiServiceSpy.get.and.returnValue(of({ items: [], total: 0 }));
    spyOn(window, 'confirm').and.returnValue(true);

    fixture = TestBed.createComponent(AppointmentsCalendarComponent);
    component = fixture.componentInstance;
    component.selectedId.set('a1');

    component.delete();

    expect(window.confirm).toHaveBeenCalledWith('Hapus janji temu ini?');
    expect(apiServiceSpy.delete).toHaveBeenCalledWith('/appointments/a1');
  });

  it('should not delete appointment if user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    fixture = TestBed.createComponent(AppointmentsCalendarComponent);
    component = fixture.componentInstance;
    component.selectedId.set('a1');

    component.delete();

    expect(window.confirm).toHaveBeenCalledWith('Hapus janji temu ini?');
    expect(apiServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should clear form correctly', () => {
    fixture = TestBed.createComponent(AppointmentsCalendarComponent);
    component = fixture.componentInstance;

    component.selectedId.set('a1');
    component.form.patchValue({
      patientId: 'p1',
      doctorId: 'd1',
      appointmentDate: '2025-10-24T10:00',
      status: 'Confirmed'
    });

    component.clearForm();

    expect(component.selectedId()).toBeNull();
    expect(component.form.get('status')?.value).toBe('Pending');
  });

  it('should get patient name correctly', () => {
    component.ngOnInit();

    expect(component.patientName('p1')).toBe('John Doe');
    expect(component.patientName('unknown')).toBe('Pasien');
  });

  it('should get doctor name correctly', () => {
    component.ngOnInit();

    expect(component.doctorName('d1')).toBe('Dr. Smith');
    expect(component.doctorName('unknown')).toBe('Dokter');
  });
});
