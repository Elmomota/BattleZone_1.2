import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { FormsModule } from '@angular/forms';
import { SqliteService } from 'src/app/services/sqlite.service';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

// Mock para SQLite
class MockSqliteService {
  getPreguntas() {
    return Promise.resolve([]);
  }
  getUsuarioByCorreo(correo: string) {
    return Promise.resolve(null);
  }
  addUsuario(usuario: any) {
    return Promise.resolve(1);
  }
  addRespuesta(preguntaId: number, usuarioId: number, respuesta: string) {
    return Promise.resolve();
  }
}

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroPage],
      imports: [
        FormsModule,
        RouterTestingModule, // Proporciona funcionalidad de rutas en tests
        IonicModule.forRoot(), // Para usar componentes de Ionic
      ],
      providers: [
        { provide: SqliteService, useClass: MockSqliteService }, // Mock del servicio
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
