import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { ServicioApiService } from './servicio-api.service';

describe('ServicioApiService', () => {
  let service: ServicioApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa HttpClientTestingModule aquí
      providers: [ServicioApiService] // Proporciona el servicio a probar
    });
    service = TestBed.inject(ServicioApiService); // Inyecta el servicio
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
