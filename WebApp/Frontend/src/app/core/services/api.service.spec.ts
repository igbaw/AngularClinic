import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ApiService
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request with correct URL and params', () => {
    const testData = { items: [], total: 0 };
    const params = { q: 'test' };

    service.get('/patients', params).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne(request => {
      return request.url === `${environment.apiBaseUrl}/patients` &&
             request.params.get('q') === 'test';
    });
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush(testData);
  });

  it('should make POST request with correct URL and body', () => {
    const testData = { id: '1', fullName: 'Test Patient' };
    const payload = { fullName: 'Test Patient' };

    service.post('/patients', payload).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/patients`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.withCredentials).toBe(true);
    req.flush(testData);
  });

  it('should make PUT request with correct URL and body', () => {
    const testData = { id: '1', fullName: 'Updated Patient' };
    const payload = { fullName: 'Updated Patient' };

    service.put('/patients/1', payload).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/patients/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    expect(req.request.withCredentials).toBe(true);
    req.flush(testData);
  });

  it('should make DELETE request with correct URL', () => {
    service.delete('/patients/1').subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/patients/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush(null);
  });

  it('should handle GET request without params', () => {
    const testData = { items: [], total: 0 };

    service.get('/patients').subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/patients`);
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });
});
