import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TorneosPage } from './torneos.page';
import { SqliteService } from 'src/app/services/sqlite.service';
import { BehaviorSubject } from 'rxjs';
import { Torneo } from 'src/app/services/torneo'; // Asegúrate de que este modelo existe
import { Juego } from 'src/app/services/juego'; // Asegúrate de que este modelo existe
import { FormsModule } from '@angular/forms';

describe('TorneosPage', () => {
  let component: TorneosPage;
  let fixture: ComponentFixture<TorneosPage>;

  // Mock de datos iniciales (incluyendo todas las propiedades del modelo Torneo)
  const mockTorneos: Torneo[] = [
    {
      id: 1,
      nombre: 'Torneo Test',
      juegoId: 1,
      creadorId: 1,
      estado: 'Activo', // Valor de ejemplo
      numEquipos: 8,
      fechaInicio: '2024-01-01', // Fecha de ejemplo
      imagen: 'test-image.jpg',
      rondas: 3
    }
  ];

  // Mock de datos para los juegos
  const mockJuegos: Juego[] = [
    {
      id: 1,
      nombre: 'Valorant',
      tipo: 'FPS',
      descripcion: 'Juego de disparos en primera persona',
      logo: 'valorant-logo.png',
      cabecera: 'valorant-cabecera.jpg'
    }
  ];

  // Mock del BehaviorSubject para simular el flujo de datos
  const mockTorneosBehaviorSubject = new BehaviorSubject<Torneo[]>(mockTorneos);
  const mockJuegosBehaviorSubject = new BehaviorSubject<Juego[]>(mockJuegos);

  // Mock del servicio SqliteService
  const mockSqliteService = {
    listaTorneos: mockTorneosBehaviorSubject, // Simula el BehaviorSubject de Torneos
    fetchTorneos: jasmine.createSpy('fetchTorneos').and.returnValue(mockTorneosBehaviorSubject.asObservable()),
    fetchJuegos: jasmine.createSpy('fetchJuegos').and.returnValue(mockJuegosBehaviorSubject.asObservable()) // Simula fetchJuegos
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TorneosPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule // Aquí va FormsModule
      ],
      providers: [
        { provide: SqliteService, useValue: mockSqliteService } // Inyecta el mock del servicio
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(TorneosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 
});
