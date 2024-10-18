import { TestBed } from '@angular/core/testing';

import { NombreServicioService } from './nombre-servicio.service';

describe('NombreServicioService', () => {
  let service: NombreServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NombreServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
