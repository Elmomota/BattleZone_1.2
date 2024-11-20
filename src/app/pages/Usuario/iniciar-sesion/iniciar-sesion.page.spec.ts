import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IniciarSesionPage } from './iniciar-sesion.page';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SqliteService } from 'src/app/services/sqlite.service';
import { NavController, AlertController, IonicModule } from '@ionic/angular';

describe('IniciarSesionPage', () => {
  let component: IniciarSesionPage;
  let fixture: ComponentFixture<IniciarSesionPage>;
  let sqliteServiceSpy: jasmine.SpyObj<SqliteService>;
  let mockUsuario: any;

  beforeEach(async () => {
    // Crea el mock del servicio
    sqliteServiceSpy = jasmine.createSpyObj('SqliteService', ['loginUsuario']);

    // Configura un usuario simulado para las pruebas
    mockUsuario = { 
      id: 1, 
      rol: 2, 
      nombre: 'Srchito', 
      correo: 'srchitita@gmail.com', 
      contrasena: 'password123' 
    };

    // Configura el TestBed
    await TestBed.configureTestingModule({
      declarations: [IniciarSesionPage],
      imports: [FormsModule, IonicModule.forRoot()],
      providers: [
        { provide: SqliteService, useValue: sqliteServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IniciarSesionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });









  it('debería llamar a loginUsuario y devolver un usuario válido', async () => {
    // Configurar el mock para devolver un usuario válido
    sqliteServiceSpy.loginUsuario.and.returnValue(Promise.resolve(mockUsuario));

    // Asignar valores al formulario
    component.correoNickname = 'srchitita@gmail.com';
    component.contrasena = 'password123';

    // Llamar al método loginUsuario
    await component.loginUsuario();

    // Verificar que loginUsuario fue llamado con los valores correctos
    expect(sqliteServiceSpy.loginUsuario).toHaveBeenCalledWith('srchitita@gmail.com', 'password123');

  });






});
