import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentaPage } from './cuenta.page';
import { SqliteService } from 'src/app/services/sqlite.service'; 
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

describe('CuentaPage', () => {
  let component: CuentaPage;
  let fixture: ComponentFixture<CuentaPage>;
  let sqliteServiceSpy: jasmine.SpyObj<SqliteService>;

  beforeEach(async () => {
    sqliteServiceSpy = jasmine.createSpyObj('SqliteService', ['obtenerTorneosInscritos']);

    await TestBed.configureTestingModule({
      declarations: [CuentaPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: SqliteService, useValue: sqliteServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería obtener los torneos inscritos correctamente', async () => {
    const mockTorneos = [
      { id: 1, nombre: 'Torneo 1' },
      { id: 2, nombre: 'Torneo 2' }
    ];
    const userId = 123;

    // Configurar el mock para devolver los torneos simulados
    sqliteServiceSpy.obtenerTorneosInscritos.and.returnValue(Promise.resolve(mockTorneos));

    // Llamar al método
    await component.obtenerTorneosInscritos(userId);

    // Verificar que el servicio haya sido llamado con el userId correcto
    expect(sqliteServiceSpy.obtenerTorneosInscritos).toHaveBeenCalledWith(userId);

    // Verificar que la propiedad 'torneosJugados' haya sido actualizada con los datos simulados
    expect(component.torneosJugados).toEqual(mockTorneos);
  });

});
