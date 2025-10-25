import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorsEditComponent } from './doctors-edit.component';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Doctor } from '../../../core/models/doctor';
import { provideRouter } from '@angular/router';

describe('DoctorsEditComponent', () => {
  let component: DoctorsEditComponent;
  let fixture: ComponentFixture<DoctorsEditComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  const mockDoctor: Doctor = {
    id: '1',
    fullName: 'Dr. John Smith',
    specialization: 'Cardiology',
    licenseNumber: 'LIC001',
    sip: 'SIP001',
    contactNumber: '123456789',
    email: 'drjohn@hospital.com',
    availability: { monday: '09:00-17:00' },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put']);
    const routSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DoctorsEditComponent],
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

  it('should create', () => {
    fixture = TestBed.createComponent(DoctorsEditComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values for create mode', () => {
    fixture = TestBed.createComponent(DoctorsEditComponent);
    component = fixture.componentInstance;

    expect(component.id).toBeNull();
    expect(component.form.get('fullName')?.value).toBe('');
    expect(component.form.get('licenseNumber')?.value).toBe('');
    expect(component.form.get('sip')?.value).toBe('');
  });

  it('should load doctor data in edit mode', () => {
    apiServiceSpy.get.and.returnValue(of(mockDoctor));
    spyOn(activatedRoute.snapshot.paramMap, 'get').and.returnValue('1');

    fixture = TestBed.createComponent(DoctorsEditComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    expect(component.id).toBe('1');
    expect(apiServiceSpy.get).toHaveBeenCalledWith('/doctors/1');
    expect(component.form.get('fullName')?.value).toBe('Dr. John Smith');
    expect(component.form.get('specialization')?.value).toBe('Cardiology');
    expect(component.form.get('licenseNumber')?.value).toBe('LIC001');
    expect(component.form.get('sip')?.value).toBe('SIP001');
  });

  it('should create new doctor when saving in create mode', () => {
    apiServiceSpy.post.and.returnValue(of(mockDoctor));

    fixture = TestBed.createComponent(DoctorsEditComponent);
    component = fixture.componentInstance;

    component.form.patchValue({
      fullName: 'Dr. New Doctor',
      specialization: 'General',
      licenseNumber: 'LIC123',
      sip: 'SIP123',
      contactNumber: '111222333',
      email: 'new@hospital.com',
      availability: '{"monday":"09:00-17:00"}'
    });

    component.save();

    expect(apiServiceSpy.post).toHaveBeenCalledWith('/doctors', jasmine.objectContaining({
      fullName: 'Dr. New Doctor',
      specialization: 'General',
      licenseNumber: 'LIC123',
      sip: 'SIP123'
    }));
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should update existing doctor when saving in edit mode', () => {
    apiServiceSpy.get.and.returnValue(of(mockDoctor));
    apiServiceSpy.put.and.returnValue(of(mockDoctor));
    spyOn(activatedRoute.snapshot.paramMap, 'get').and.returnValue('1');

    fixture = TestBed.createComponent(DoctorsEditComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    component.form.patchValue({
      fullName: 'Dr. Updated Name'
    });

    component.save();

    expect(apiServiceSpy.put).toHaveBeenCalledWith('/doctors/1', jasmine.objectContaining({
      fullName: 'Dr. Updated Name'
    }));
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should not save when form is invalid', () => {
    fixture = TestBed.createComponent(DoctorsEditComponent);
    component = fixture.componentInstance;

    component.form.patchValue({
      fullName: '', // Required field
      licenseNumber: '', // Required field
      sip: '' // Required field
    });

    component.save();

    expect(apiServiceSpy.post).not.toHaveBeenCalled();
    expect(apiServiceSpy.put).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    fixture = TestBed.createComponent(DoctorsEditComponent);
    component = fixture.componentInstance;

    const fullNameControl = component.form.get('fullName');
    const licenseControl = component.form.get('licenseNumber');
    const sipControl = component.form.get('sip');

    expect(fullNameControl?.hasError('required')).toBe(true);
    expect(licenseControl?.hasError('required')).toBe(true);
    expect(sipControl?.hasError('required')).toBe(true);
  });

  it('should handle JSON parsing for availability field', () => {
    fixture = TestBed.createComponent(DoctorsEditComponent);
    component = fixture.componentInstance;

    component.form.patchValue({
      fullName: 'Dr. Test',
      licenseNumber: 'LIC001',
      sip: 'SIP001',
      availability: '{"monday":"09:00-17:00"}'
    });

    apiServiceSpy.post.and.returnValue(of(mockDoctor));
    component.save();

    expect(apiServiceSpy.post).toHaveBeenCalledWith('/doctors', jasmine.objectContaining({
      availability: { monday: '09:00-17:00' }
    }));
  });

  it('should handle invalid JSON for availability field', () => {
    fixture = TestBed.createComponent(DoctorsEditComponent);
    component = fixture.componentInstance;

    component.form.patchValue({
      fullName: 'Dr. Test',
      licenseNumber: 'LIC001',
      sip: 'SIP001',
      availability: 'invalid json'
    });

    apiServiceSpy.post.and.returnValue(of(mockDoctor));
    component.save();

    expect(apiServiceSpy.post).toHaveBeenCalledWith('/doctors', jasmine.objectContaining({
      availability: undefined
    }));
  });
});
