import { TestBed } from '@angular/core/testing';

import { ServicioApiService } from './servicio-api.service';

describe('ServicioApiService', () => {
  let service: ServicioApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
