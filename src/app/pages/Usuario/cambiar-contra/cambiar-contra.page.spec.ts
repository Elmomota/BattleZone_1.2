import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CambiarContraPage } from './cambiar-contra.page';
import { SqliteService } from 'src/app/services/sqlite.service'; // Asegúrate de importar correctamente el servicio
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa el plugin SQLite

describe('CambiarContraPage', () => {
  let component: CambiarContraPage;
  let fixture: ComponentFixture<CambiarContraPage>;

  // Mock para SQLite
  const mockSQLite = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve()) // Simula el método create y devuelve una promesa resuelta
  };

  // Mock para SqliteService
  const mockSqliteService = {
    // Simula el método que uses en tu servicio
    someMethod: jasmine.createSpy('someMethod').and.returnValue(Promise.resolve()) // Cambia 'someMethod' por el método real
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambiarContraPage],
      imports: [IonicModule.forRoot()], // Necesario para componentes de Ionic
      providers: [
        { provide: SQLite, useValue: mockSQLite }, // Proveedor falso para SQLite
        { provide: SqliteService, useValue: mockSqliteService } // Proveedor falso para SqliteService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CambiarContraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
