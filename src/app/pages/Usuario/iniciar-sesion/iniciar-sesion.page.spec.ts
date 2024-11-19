import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IniciarSesionPage } from './iniciar-sesion.page';
import { SqliteService } from 'src/app/services/sqlite.service'; 
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';  // Asegúrate de que esta es la importación correcta
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

describe('IniciarSesionPage', () => {
  let component: IniciarSesionPage;
  let fixture: ComponentFixture<IniciarSesionPage>;

  // Mock de SQLite
  const mockSQLite = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),  // Simula la creación de la base de datos
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0 } }))  // Simula la ejecución de una consulta SQL
  };

  // Mock de SqliteService
  const mockSqliteService = {
    // Simula cualquier método de SqliteService
    getUserByEmail: jasmine.createSpy('getUserByEmail').and.returnValue(Promise.resolve([]))  // Ejemplo de un método simulado
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IniciarSesionPage],
      imports: [FormsModule, IonicModule],  // Importa FormsModule aquí
      providers: [
        { provide: SQLite, useValue: mockSQLite },
        { provide: SqliteService, useValue: mockSqliteService }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(IniciarSesionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
