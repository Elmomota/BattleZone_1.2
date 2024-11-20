import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { FormsModule } from '@angular/forms';
import { SqliteService } from 'src/app/services/sqlite.service';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let sqliteServiceSpy: jasmine.SpyObj<SqliteService>;
  let routerSpy: jasmine.SpyObj<SqliteService>;

  beforeEach(() => {
    // Crear el mock del servicio
    sqliteServiceSpy = jasmine.createSpyObj('SqliteService', ['getPreguntas',
      'getUsuarioByCorreo',
      'addUsuario',
      'addRespuesta',]);
    sqliteServiceSpy.getPreguntas.and.returnValue(Promise.resolve([])); // Por defecto, devuelve un array vacío
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [RegistroPage],
      imports: [
        FormsModule,
        RouterTestingModule, // Proporciona funcionalidad de rutas en tests
        IonicModule.forRoot(), // Para usar componentes de Ionic
      ],
      providers: [
        { provide: SqliteService, useValue: sqliteServiceSpy }, // Mock del servicio
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getpreguntasTest', async () => {
    // Configurar el mock para devolver una lista de preguntas
    const mockPreguntas = [
      { id: 1, pregunta: 'Pregunta 1' },
      { id: 2, pregunta: 'Pregunta 2' },
    ];
    sqliteServiceSpy.getPreguntas.and.returnValue(Promise.resolve(mockPreguntas));

    // Llamar al método obtenerPreguntas
    await component.obtenerPreguntas();

    // Verificar que getPreguntas fue llamado
    expect(sqliteServiceSpy.getPreguntas).toHaveBeenCalled();

    // Verificar que las preguntas se asignaron correctamente
    expect(component.preguntas).toEqual(mockPreguntas);
  });



  it('debería registrar un usuario nuevo y guardar la respuesta de seguridad', async () => {
    // Mock de un usuario nuevo
    component.nuevoUsuario = {
      id: 1,
      pnombre: 'John',
      papellido: 'Doe',
      nickname: 'john123',
      correo: 'john.doe@example.com',
      contrasena: 'password123',
      fechaNacimiento: '2000-01-01',
      pais: 'UserLand',
      rol: 2,
    };
  
    // Mock de los valores seleccionados en el registro
    component.preguntaSeleccionadaId = 1;
    component.respuesta = 'Respuesta de seguridad';
  
    // Configurar mocks para el flujo de registro exitoso
    sqliteServiceSpy.getUsuarioByCorreo.and.returnValue(Promise.resolve(null)); // El correo no existe
    sqliteServiceSpy.addUsuario.and.returnValue(Promise.resolve(1)); // Devuelve el ID del nuevo usuario
    sqliteServiceSpy.addRespuesta.and.returnValue(Promise.resolve()); // La respuesta de seguridad se guarda correctamente
  
    // Llamar a la función de registro
    await component.registrarUsuario();
  
    // Validar que se haya llamado a getUsuarioByCorreo con el correo correcto
    expect(sqliteServiceSpy.getUsuarioByCorreo).toHaveBeenCalledWith('john.doe@example.com');
  
    // Validar que se haya registrado el usuario
    expect(sqliteServiceSpy.addUsuario).toHaveBeenCalledWith(component.nuevoUsuario);
  

  
    // Validar que se haya redirigido a la página de inicio de sesión
  });
////////////////////////////////////////////////////////////////////////////////////////////////////////

});
