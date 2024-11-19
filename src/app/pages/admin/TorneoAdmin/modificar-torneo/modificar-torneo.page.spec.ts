import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarTorneoPage } from './modificar-torneo.page';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { SqliteService } from 'src/app/services/sqlite.service';
import { TorneoService } from 'src/app/services/torneo-service.service';



// Mock de ActivatedRoute
class MockActivatedRoute {
  queryParams = of({ torneo: '{"id": 1, "nombre": "Torneo de prueba", "imagen": "url_imagen"}' }); // Simula parámetros de la URL
}

// Mock de otros servicios
class MockSqliteService {
  actualizarTorneo = jasmine.createSpy().and.returnValue(Promise.resolve());
  eliminarTorneo = jasmine.createSpy().and.returnValue(Promise.resolve());
}

class MockTorneoService {
  notificarTorneoActualizado = jasmine.createSpy();
  notificarTorneoEliminado = jasmine.createSpy();
}

describe('ModificarTorneoPage', () => {
  let component: ModificarTorneoPage;
  let fixture: ComponentFixture<ModificarTorneoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModificarTorneoPage],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },  // Mock de ActivatedRoute
        { provide: SqliteService, useClass: MockSqliteService },   // Mock de SqliteService
        { provide: TorneoService, useClass: MockTorneoService },   // Mock de TorneoService
       
    
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarTorneoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Otras pruebas unitarias adicionales
});
