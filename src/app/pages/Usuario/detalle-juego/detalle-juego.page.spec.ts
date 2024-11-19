import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { DetalleJuegoPage } from './detalle-juego.page';
import { SqliteService } from 'src/app/services/sqlite.service';

class SQLiteMock {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: [] }),
    });
  }
}

describe('DetalleJuegoPage', () => {
  let component: DetalleJuegoPage;
  let fixture: ComponentFixture<DetalleJuegoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleJuegoPage],
      imports: [IonicModule.forRoot()],
      providers: [
        // Proporcionar SqliteService con un mock para SQLite
        {
          provide: SqliteService,
          useValue: {
            fetchTorneos: jasmine.createSpy().and.returnValue(of([])) // Simular el método fetchTorneos
          }
        },
        { provide: 'SQLite', useClass: SQLiteMock }, // Mock del servicio SQLite
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              juego: JSON.stringify({
                id: 1,
                nombre: 'Valorant',
                tipo: 'Shooter',
                descripcion: 'Un juego de disparos competitivo.',
                logo: 'valorant-logo.png',
                cabecera: 'valorant-cabecera.jpg',
              }),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleJuegoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load game and related tournaments', () => {
    expect(component.juego).toEqual({
      id: 1,
      nombre: 'Valorant',
      tipo: 'Shooter',
      descripcion: 'Un juego de disparos competitivo.',
      logo: 'valorant-logo.png',
      cabecera: 'valorant-cabecera.jpg',
    });
  });
});

