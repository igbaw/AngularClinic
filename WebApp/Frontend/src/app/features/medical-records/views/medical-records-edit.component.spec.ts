import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalRecordsEditComponent } from './medical-records-edit.component';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MedicalRecord } from '../../../core/models/medical-record';
import { Patient } from '../../../core/models/patient';
import { Doctor } from '../../../core/models/doctor';
import { Attachment } from '../../../core/models/common';
import { provideRouter } from '@angular/router';

describe('MedicalRecordsEditComponent', () => {
  let component: MedicalRecordsEditComponent;
  let fixture: ComponentFixture<MedicalRecordsEditComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

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

  const mockAttachment: Attachment = {
    id: 'att1',
    url: 'http://example.com/file.pdf',
    fileName: 'test.pdf',
    mimeType: 'application/pdf',
    size: 1024
  };

  const mockMedicalRecord: MedicalRecord = {
    id: 'mr1',
    patientId: 'p1',
    doctorId: 'd1',
    recordNumber: 'MR001',
    subjective: 'Patient complains of headache',
    objective: 'BP: 120/80',
    assessment: 'Tension headache',
    plan: 'Rest and hydration',
    attachments: [mockAttachment],
    signedBy: 'Dr. Smith',
    signedAt: '2025-01-01T10:00:00Z',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put']);
    const routSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MedicalRecordsEditComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routSpy },
        provideRouter([])
      ]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    apiServiceSpy.get.and.callFake((url: string) => {
      if (url === '/patients') return of({ items: mockPatients, total: 1 });
      if (url === '/doctors') return of({ items: mockDoctors, total: 1 });
      if (url.startsWith('/medical-records/')) return of(mockMedicalRecord);
      return of(null as any);
    });
  });

  it('should create', () => {
    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values for create mode', () => {
    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    expect(component.id).toBeNull();
    expect(component.form.get('patientId')?.value).toBe('');
    expect(component.form.get('doctorId')?.value).toBe('');
    expect(component.form.get('recordNumber')?.value).toBe('');
  });

  it('should load patients and doctors on init', () => {
    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/patients');
    expect(apiServiceSpy.get).toHaveBeenCalledWith('/doctors');
    expect(component.patients()).toEqual(mockPatients);
    expect(component.doctors()).toEqual(mockDoctors);
  });

  it('should load medical record data in edit mode', () => {
    spyOn(activatedRoute.snapshot.paramMap, 'get').and.returnValue('mr1');

    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    expect(component.id).toBe('mr1');
    expect(apiServiceSpy.get).toHaveBeenCalledWith('/medical-records/mr1');
    expect(component.form.get('patientId')?.value).toBe('p1');
    expect(component.form.get('doctorId')?.value).toBe('d1');
    expect(component.form.get('recordNumber')?.value).toBe('MR001');
    expect(component.form.get('subjective')?.value).toBe('Patient complains of headache');
    expect(component.attachments()).toEqual([mockAttachment]);
  });

  it('should create new medical record when saving in create mode', () => {
    apiServiceSpy.post.and.returnValue(of(mockMedicalRecord));

    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    component.form.patchValue({
      patientId: 'p1',
      doctorId: 'd1',
      recordNumber: 'MR002',
      subjective: 'New complaint',
      objective: 'New findings',
      assessment: 'New diagnosis',
      plan: 'New treatment'
    });

    component.save();

    expect(apiServiceSpy.post).toHaveBeenCalledWith('/medical-records', jasmine.objectContaining({
      patientId: 'p1',
      doctorId: 'd1',
      recordNumber: 'MR002'
    }));
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should update existing medical record when saving in edit mode', () => {
    apiServiceSpy.put.and.returnValue(of(mockMedicalRecord));
    spyOn(activatedRoute.snapshot.paramMap, 'get').and.returnValue('mr1');

    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    component.form.patchValue({
      subjective: 'Updated complaint'
    });

    component.save();

    expect(apiServiceSpy.put).toHaveBeenCalledWith('/medical-records/mr1', jasmine.objectContaining({
      subjective: 'Updated complaint'
    }));
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should not save when form is invalid', () => {
    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;

    component.form.patchValue({
      patientId: '',
      doctorId: '',
      recordNumber: ''
    });

    component.save();

    expect(apiServiceSpy.post).not.toHaveBeenCalled();
    expect(apiServiceSpy.put).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;

    const patientIdControl = component.form.get('patientId');
    const doctorIdControl = component.form.get('doctorId');
    const recordNumberControl = component.form.get('recordNumber');
    const subjectiveControl = component.form.get('subjective');

    expect(patientIdControl?.hasError('required')).toBe(true);
    expect(doctorIdControl?.hasError('required')).toBe(true);
    expect(recordNumberControl?.hasError('required')).toBe(true);
    expect(subjectiveControl?.hasError('required')).toBe(true);
  });

  it('should remove attachment from list', () => {
    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;
    component.attachments.set([mockAttachment]);

    component.removeAttachment('att1');

    expect(component.attachments()).toEqual([]);
  });

  it('should include signedBy and signedAt when form has signed checkbox checked', () => {
    apiServiceSpy.post.and.returnValue(of(mockMedicalRecord));

    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    component.form.patchValue({
      patientId: 'p1',
      doctorId: 'd1',
      recordNumber: 'MR003',
      subjective: 'Test',
      objective: 'Test',
      assessment: 'Test',
      plan: 'Test',
      signed: true,
      signedBy: 'Dr. Test'
    });

    component.save();

    const callArgs = apiServiceSpy.post.calls.mostRecent().args[1] as any;
    expect(callArgs.signedBy).toBe('Dr. Test');
    expect(callArgs.signedAt).toBeDefined();
  });

  it('should not include signedBy and signedAt when form has signed checkbox unchecked', () => {
    apiServiceSpy.post.and.returnValue(of(mockMedicalRecord));

    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    component.form.patchValue({
      patientId: 'p1',
      doctorId: 'd1',
      recordNumber: 'MR003',
      subjective: 'Test',
      objective: 'Test',
      assessment: 'Test',
      plan: 'Test',
      signed: false
    });

    component.save();

    const callArgs = apiServiceSpy.post.calls.mostRecent().args[1] as any;
    expect(callArgs.signedBy).toBeUndefined();
    expect(callArgs.signedAt).toBeUndefined();
  });

  it('should include attachments in save payload', () => {
    apiServiceSpy.post.and.returnValue(of(mockMedicalRecord));

    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    component.attachments.set([mockAttachment]);

    component.form.patchValue({
      patientId: 'p1',
      doctorId: 'd1',
      recordNumber: 'MR003',
      subjective: 'Test',
      objective: 'Test',
      assessment: 'Test',
      plan: 'Test'
    });

    component.save();

    const callArgs = apiServiceSpy.post.calls.mostRecent().args[1] as any;
    expect(callArgs.attachments).toEqual([mockAttachment]);
  });
});
