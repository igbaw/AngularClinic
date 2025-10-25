import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientsEditComponent } from './patients-edit.component';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Patient } from '../../../core/models/patient';
import { provideRouter } from '@angular/router';

describe('PatientsEditComponent', () => {
  let component: PatientsEditComponent;
  let fixture: ComponentFixture<PatientsEditComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  const mockPatient: Patient = {
    id: '1',
    fullName: 'John Doe',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    contactNumber: '123456789',
    email: 'john@example.com',
    address: '123 Main St',
    insuranceId: 'INS001',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put']);
    const routSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PatientsEditComponent],
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
    fixture = TestBed.createComponent(PatientsEditComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values for create mode', () => {
    fixture = TestBed.createComponent(PatientsEditComponent);
    component = fixture.componentInstance;

    expect(component.id).toBeNull();
    expect(component.form.get('fullName')?.value).toBe('');
    expect(component.form.get('dateOfBirth')?.value).toBe('');
    expect(component.form.get('gender')?.value).toBe('Other');
  });

  it('should load patient data in edit mode', () => {
    apiServiceSpy.get.and.returnValue(of(mockPatient));

    // Mock route with id parameter
    spyOn(activatedRoute.snapshot.paramMap, 'get').and.returnValue('1');

    fixture = TestBed.createComponent(PatientsEditComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    expect(component.id).toBe('1');
    expect(apiServiceSpy.get).toHaveBeenCalledWith('/patients/1');
    expect(component.form.get('fullName')?.value).toBe('John Doe');
    expect(component.form.get('dateOfBirth')?.value).toBe('1990-01-01');
    expect(component.form.get('gender')?.value).toBe('Male');
  });

  it('should create new patient when saving in create mode', () => {
    apiServiceSpy.post.and.returnValue(of(mockPatient));

    fixture = TestBed.createComponent(PatientsEditComponent);
    component = fixture.componentInstance;

    component.form.patchValue({
      fullName: 'New Patient',
      dateOfBirth: '1995-01-01',
      gender: 'Female'
    });

    component.save();

    expect(apiServiceSpy.post).toHaveBeenCalledWith('/patients', jasmine.objectContaining({
      fullName: 'New Patient',
      dateOfBirth: '1995-01-01',
      gender: 'Female'
    }));
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should update existing patient when saving in edit mode', () => {
    apiServiceSpy.get.and.returnValue(of(mockPatient));
    apiServiceSpy.put.and.returnValue(of(mockPatient));

    spyOn(activatedRoute.snapshot.paramMap, 'get').and.returnValue('1');

    fixture = TestBed.createComponent(PatientsEditComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    component.form.patchValue({
      fullName: 'Updated Name'
    });

    component.save();

    expect(apiServiceSpy.put).toHaveBeenCalledWith('/patients/1', jasmine.objectContaining({
      fullName: 'Updated Name'
    }));
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should not save when form is invalid', () => {
    fixture = TestBed.createComponent(PatientsEditComponent);
    component = fixture.componentInstance;

    component.form.patchValue({
      fullName: '', // Required field
      dateOfBirth: '', // Required field
      gender: 'Male'
    });

    component.save();

    expect(apiServiceSpy.post).not.toHaveBeenCalled();
    expect(apiServiceSpy.put).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    fixture = TestBed.createComponent(PatientsEditComponent);
    component = fixture.componentInstance;

    const fullNameControl = component.form.get('fullName');
    const dateOfBirthControl = component.form.get('dateOfBirth');
    const genderControl = component.form.get('gender');

    expect(fullNameControl?.hasError('required')).toBe(true);
    expect(dateOfBirthControl?.hasError('required')).toBe(true);
    expect(genderControl?.hasError('required')).toBe(false); // Has default value
  });

  it('should accept optional fields', () => {
    fixture = TestBed.createComponent(PatientsEditComponent);
    component = fixture.componentInstance;

    component.form.patchValue({
      fullName: 'Test Patient',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      contactNumber: '',
      email: '',
      address: '',
      insuranceId: ''
    });

    expect(component.form.valid).toBe(true);
  });
});
