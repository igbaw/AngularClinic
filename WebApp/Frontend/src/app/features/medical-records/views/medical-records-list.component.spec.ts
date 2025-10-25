import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalRecordsListComponent } from './medical-records-list.component';
import { ApiService } from '../../../core/services/api.service';
import { of } from 'rxjs';
import { MedicalRecord } from '../../../core/models/medical-record';
import { Patient } from '../../../core/models/patient';
import { Doctor } from '../../../core/models/doctor';
import { PagedResult } from '../../../core/models/common';
import { provideRouter } from '@angular/router';

describe('MedicalRecordsListComponent', () => {
  let component: MedicalRecordsListComponent;
  let fixture: ComponentFixture<MedicalRecordsListComponent>;
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

  const mockMedicalRecords: MedicalRecord[] = [
    {
      id: 'mr1',
      patientId: 'p1',
      doctorId: 'd1',
      recordNumber: 'MR001',
      subjective: 'Patient complains of headache',
      objective: 'BP: 120/80',
      assessment: 'Tension headache',
      plan: 'Rest and hydration',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'mr2',
      patientId: 'p1',
      doctorId: 'd1',
      recordNumber: 'MR002',
      subjective: 'Follow-up visit',
      objective: 'No fever',
      assessment: 'Recovering well',
      plan: 'Continue medication',
      signedBy: 'Dr. Smith',
      signedAt: '2025-01-02T00:00:00Z',
      createdAt: '2025-01-02T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['get']);

    await TestBed.configureTestingModule({
      imports: [MedicalRecordsListComponent],
      providers: [
        { provide: ApiService, useValue: spy },
        provideRouter([])
      ]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  beforeEach(() => {
    const patientsResult: PagedResult<Patient> = { items: mockPatients, total: 1 };
    const doctorsResult: PagedResult<Doctor> = { items: mockDoctors, total: 1 };
    const recordsResult: PagedResult<MedicalRecord> = { items: mockMedicalRecords, total: 2 };

    apiServiceSpy.get.and.callFake((url: string, params?: any) => {
      if (url === '/patients') return of(patientsResult);
      if (url === '/doctors') return of(doctorsResult);
      if (url === '/medical-records') {
        if (params?.patientId === 'p1') {
          return of({ items: [mockMedicalRecords[0]], total: 1 });
        }
        return of(recordsResult);
      }
      return of(null as any);
    });

    fixture = TestBed.createComponent(MedicalRecordsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load patients, doctors and medical records on init', () => {
    component.ngOnInit();

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/patients');
    expect(apiServiceSpy.get).toHaveBeenCalledWith('/doctors');
    expect(apiServiceSpy.get).toHaveBeenCalledWith('/medical-records', undefined);
    expect(component.patients()).toEqual(mockPatients);
    expect(component.doctors()).toEqual(mockDoctors);
    expect(component.items()).toEqual(mockMedicalRecords);
  });

  it('should filter medical records by patient ID', () => {
    component.ngOnInit();
    component.patientId = 'p1';

    component.load();

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/medical-records', { patientId: 'p1' });
    expect(component.items().length).toBe(1);
  });

  it('should load all medical records when no patient filter', () => {
    component.ngOnInit();
    component.patientId = '';

    component.load();

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/medical-records', undefined);
    expect(component.items()).toEqual(mockMedicalRecords);
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

  it('should handle empty medical records list', () => {
    apiServiceSpy.get.and.callFake((url: string) => {
      if (url === '/patients') return of({ items: mockPatients, total: 1 });
      if (url === '/doctors') return of({ items: mockDoctors, total: 1 });
      if (url === '/medical-records') return of({ items: [], total: 0 });
      return of(null as any);
    });

    fixture = TestBed.createComponent(MedicalRecordsListComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    expect(component.items()).toEqual([]);
  });

  it('should display records with signed status', () => {
    component.ngOnInit();

    const signedRecord = component.items().find(r => r.id === 'mr2');
    const unsignedRecord = component.items().find(r => r.id === 'mr1');

    expect(signedRecord?.signedBy).toBe('Dr. Smith');
    expect(signedRecord?.signedAt).toBeDefined();
    expect(unsignedRecord?.signedBy).toBeUndefined();
    expect(unsignedRecord?.signedAt).toBeUndefined();
  });
});
