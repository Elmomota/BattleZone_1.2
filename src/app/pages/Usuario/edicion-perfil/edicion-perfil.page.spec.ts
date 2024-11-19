import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EdicionPerfilPage } from './edicion-perfil.page';
import { SqliteService } from 'src/app/services/sqlite.service'; 
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';  // Verifica si esta es la importación correcta

describe('EdicionPerfilPage', () => {
  let component: EdicionPerfilPage;
  let fixture: ComponentFixture<EdicionPerfilPage>;

  // Mock para SQLite
  const mockSQLite = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve())
  };

  // Mock para SqliteService
  const mockSqliteService = {
    // Simula cualquier método que estés utilizando del servicio SqliteService
    someMethod: jasmine.createSpy('someMethod').and.returnValue(Promise.resolve())
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EdicionPerfilPage],
      imports: [IonicModule.forRoot()],  // Asegúrate de que IonicModule está importado
      providers: [
        { provide: SQLite, useValue: mockSQLite },  // Mock para SQLite
        { provide: SqliteService, useValue: mockSqliteService }  // Mock para tu SqliteService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EdicionPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
