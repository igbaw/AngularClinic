import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientsListComponent } from './patients-list.component';
import { ApiService } from '../../../core/services/api.service';
import { of } from 'rxjs';
import { Patient } from '../../../core/models/patient';
import { PagedResult } from '../../../core/models/common';
import { provideRouter } from '@angular/router';

describe('PatientsListComponent', () => {
  let component: PatientsListComponent;
  let fixture: ComponentFixture<PatientsListComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockPatients: Patient[] = [
    {
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
    },
    {
      id: '2',
      fullName: 'Jane Smith',
      dateOfBirth: '1985-05-15',
      gender: 'Female',
      contactNumber: '987654321',
      email: 'jane@example.com',
      address: '456 Oak Ave',
      insuranceId: 'INS002',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }
  ];

  const mockPagedResult: PagedResult<Patient> = {
    items: mockPatients,
    total: 2
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'delete']);

    await TestBed.configureTestingModule({
      imports: [PatientsListComponent],
      providers: [
        { provide: ApiService, useValue: spy },
        provideRouter([])
      ]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture = TestBed.createComponent(PatientsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load patients on init', () => {
    apiServiceSpy.get.and.returnValue(of(mockPagedResult));

    component.ngOnInit();

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/patients', undefined);
    expect(component.items()).toEqual(mockPatients);
    expect(component.loading()).toBe(false);
  });

  it('should load patients with query parameter', () => {
    apiServiceSpy.get.and.returnValue(of(mockPagedResult));
    component.q.set('John');

    component.load();

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/patients', { q: 'John' });
    expect(component.items()).toEqual(mockPatients);
  });

  it('should set loading to true during load', () => {
    apiServiceSpy.get.and.returnValue(of(mockPagedResult));

    component.load();

    expect(component.loading()).toBe(false);
  });

  it('should delete patient and reload list', () => {
    apiServiceSpy.delete.and.returnValue(of(null));
    apiServiceSpy.get.and.returnValue(of(mockPagedResult));
    spyOn(window, 'confirm').and.returnValue(true);

    component.delete('1');

    expect(window.confirm).toHaveBeenCalledWith('Hapus pasien ini?');
    expect(apiServiceSpy.delete).toHaveBeenCalledWith('/patients/1');
    expect(apiServiceSpy.get).toHaveBeenCalled();
  });

  it('should not delete patient if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.delete('1');

    expect(window.confirm).toHaveBeenCalledWith('Hapus pasien ini?');
    expect(apiServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should handle empty patient list', () => {
    const emptyResult: PagedResult<Patient> = { items: [], total: 0 };
    apiServiceSpy.get.and.returnValue(of(emptyResult));

    component.ngOnInit();

    expect(component.items()).toEqual([]);
    expect(component.loading()).toBe(false);
  });
});
