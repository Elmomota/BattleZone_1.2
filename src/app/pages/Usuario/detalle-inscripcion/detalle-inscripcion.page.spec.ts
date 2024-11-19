import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleInscripcionPage } from './detalle-inscripcion.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';  // Para simular los parámetros de la ruta
import { SqliteService } from 'src/app/services/sqlite.service';
import { ToastController } from '@ionic/angular';

// Mock para ActivatedRoute
class ActivatedRouteStub {
  snapshot = {
    paramMap: {
      get: (key: string) => {
        if (key === 'id') {
          return '123';  // Ejemplo de ID de torneo
        }
        return null;
      }
    }
  };
}

// Mock para SqliteService
class SqliteServiceMock {
  obtenerSesion() {
    return Promise.resolve({ id: 1, nombre: 'Usuario Test', correo: 'test@example.com' });
  }
  verificarInscripcionPorCorreoYNickname() {
    return Promise.resolve(false);  // Simulamos que no está inscrito
  }
  inscribirTorneo() {
    return Promise.resolve();  // Simulamos que la inscripción fue exitosa
  }
  actualizarTorneo() {
    return Promise.resolve();  // Simulamos que la actualización fue exitosa
  }
}

describe('DetalleInscripcionPage', () => {
  let component: DetalleInscripcionPage;
  let fixture: ComponentFixture<DetalleInscripcionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleInscripcionPage],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: SqliteService, useClass: SqliteServiceMock },  // Mock del servicio SQLite
        ToastController  // Mock o proveedor para ToastController
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleInscripcionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Aquí puedes agregar más pruebas si es necesario
});
