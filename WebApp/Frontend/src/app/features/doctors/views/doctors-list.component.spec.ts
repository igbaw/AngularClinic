import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorsListComponent } from './doctors-list.component';
import { ApiService } from '../../../core/services/api.service';
import { of } from 'rxjs';
import { Doctor } from '../../../core/models/doctor';
import { PagedResult } from '../../../core/models/common';
import { provideRouter } from '@angular/router';

describe('DoctorsListComponent', () => {
  let component: DoctorsListComponent;
  let fixture: ComponentFixture<DoctorsListComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockDoctors: Doctor[] = [
    {
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
    },
    {
      id: '2',
      fullName: 'Dr. Sarah Johnson',
      specialization: 'Pediatrics',
      licenseNumber: 'LIC002',
      sip: 'SIP002',
      contactNumber: '987654321',
      email: 'drsarah@hospital.com',
      availability: { tuesday: '10:00-18:00' },
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }
  ];

  const mockPagedResult: PagedResult<Doctor> = {
    items: mockDoctors,
    total: 2
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'delete']);

    await TestBed.configureTestingModule({
      imports: [DoctorsListComponent],
      providers: [
        { provide: ApiService, useValue: spy },
        provideRouter([])
      ]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture = TestBed.createComponent(DoctorsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load doctors on init', () => {
    apiServiceSpy.get.and.returnValue(of(mockPagedResult));

    component.ngOnInit();

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/doctors', undefined);
    expect(component.items()).toEqual(mockDoctors);
    expect(component.loading()).toBe(false);
  });

  it('should load doctors with query parameter', () => {
    apiServiceSpy.get.and.returnValue(of(mockPagedResult));
    component.q = 'John';

    component.load();

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/doctors', { q: 'John' });
    expect(component.items()).toEqual(mockDoctors);
  });

  it('should set loading to true during load', () => {
    apiServiceSpy.get.and.returnValue(of(mockPagedResult));

    component.load();

    expect(component.loading()).toBe(false);
  });

  it('should delete doctor and reload list', () => {
    apiServiceSpy.delete.and.returnValue(of(null));
    apiServiceSpy.get.and.returnValue(of(mockPagedResult));
    spyOn(window, 'confirm').and.returnValue(true);

    component.delete('1');

    expect(window.confirm).toHaveBeenCalledWith('Hapus dokter ini?');
    expect(apiServiceSpy.delete).toHaveBeenCalledWith('/doctors/1');
    expect(apiServiceSpy.get).toHaveBeenCalled();
  });

  it('should not delete doctor if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.delete('1');

    expect(window.confirm).toHaveBeenCalledWith('Hapus dokter ini?');
    expect(apiServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should handle empty doctor list', () => {
    const emptyResult: PagedResult<Doctor> = { items: [], total: 0 };
    apiServiceSpy.get.and.returnValue(of(emptyResult));

    component.ngOnInit();

    expect(component.items()).toEqual([]);
    expect(component.loading()).toBe(false);
  });
});
