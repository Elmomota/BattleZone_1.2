import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleInscripcionPage } from './detalle-inscripcion.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SqliteService } from 'src/app/services/sqlite.service';
import { FormsModule } from '@angular/forms';
import { NavController, AlertController, IonicModule, ToastController } from '@ionic/angular';

describe('DetalleInscripcionPage', () => {
  let component: DetalleInscripcionPage;
  let fixture: ComponentFixture<DetalleInscripcionPage>;
  let sqliteServiceSpy: jasmine.SpyObj<SqliteService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;

  beforeEach(async () => {
    // Crear el Spy antes de configurar el TestBed
    sqliteServiceSpy = jasmine.createSpyObj('SqliteService', ['obtenerSesion']);

    await TestBed.configureTestingModule({
      declarations: [DetalleInscripcionPage],
      imports: [FormsModule, IonicModule.forRoot()],
      providers: [      
        { provide: SqliteService, useValue: sqliteServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ usuario: JSON.stringify({ id: 1, nombre: 'John Doe', correo: 'john.doe@example.com' }) }),
          },
        },
        NavController,
        AlertController,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleInscripcionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería obtener los datos del usuario si la sesión está activa', async () => {
    // Configurar el mock para devolver un usuario simulado
    const mockUsuario = { id: 1, nombre: 'John Doe', correo: 'john.doe@example.com' };
    sqliteServiceSpy.obtenerSesion.and.returnValue(Promise.resolve(mockUsuario));

    // Llamar al método
    await component.obtenerDatosUsuario();

    // Verificar que se haya llamado a obtenerSesion
    expect(sqliteServiceSpy.obtenerSesion).toHaveBeenCalled();

    // Verificar que el usuario se haya asignado correctamente
    expect(component.usuario).toEqual(mockUsuario);
  });




});
