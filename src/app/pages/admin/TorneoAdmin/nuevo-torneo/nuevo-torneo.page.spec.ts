import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoTorneoPage } from './nuevo-torneo.page';
import { SqliteService } from 'src/app/services/sqlite.service';  // Ajusta la importación según corresponda
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite si es necesario

describe('NuevoTorneoPage', () => {
  let component: NuevoTorneoPage;
  let fixture: ComponentFixture<NuevoTorneoPage>;

  // Mock del servicio SQLite
  class MockSQLite {
    // Define los métodos que el servicio SQLite necesita
    executeSql(query: string, params: any[]) {
      return Promise.resolve(); // Simula una ejecución exitosa
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevoTorneoPage],
      providers: [
        { provide: SQLite, useClass: MockSQLite }, // Usar el mock del SQLite
        SqliteService, // Asegúrate de que SqliteService también esté incluido
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoTorneoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
