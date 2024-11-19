import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaTorneoPage } from './vista-torneo.page';
import { SqliteService } from 'src/app/services/sqlite.service'; 
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { IonicModule } from '@ionic/angular';  // Asegúrate de importar IonicModule
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('VistaTorneoPage', () => {
  let component: VistaTorneoPage;
  let fixture: ComponentFixture<VistaTorneoPage>;

  // Mock de SQLite
  const mockSQLite = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),  // Simula la creación de la base de datos
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0 } }))  // Simula la ejecución de una consulta SQL
  };

  // Mock de SqliteService
  const mockSqliteService = {
    // Simula el método de SqliteService
    getTournaments: jasmine.createSpy('getTournaments').and.returnValue(Promise.resolve([]))  // Ejemplo de un método simulado
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VistaTorneoPage],
      imports: [
        IonicModule.forRoot(),  // Importa IonicModule
        CommonModule,
        FormsModule
      ], 
      providers: [
        { provide: SQLite, useValue: mockSQLite },  // Mock de SQLite
        { provide: SqliteService, useValue: mockSqliteService }  // Mock de SqliteService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VistaTorneoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Agrega más pruebas específicas si es necesario
});
