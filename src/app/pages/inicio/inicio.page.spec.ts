import { ComponentFixture, TestBed } from '@angular/core/testing'; // Asegúrate de importar ComponentFixture y TestBed
import { InicioPage } from './inicio.page';
import { IonicStorageModule } from '@ionic/storage-angular'; // Asegúrate de importar este módulo
import { Storage } from '@ionic/storage-angular';

// Mock de Storage
class MockStorage {
  create() {
    // Simula la creación del almacenamiento
    return Promise.resolve();
  }
}

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicioPage],
      imports: [IonicStorageModule.forRoot()], // Asegúrate de importar IonicStorageModule
      providers: [
        { provide: Storage, useClass: MockStorage } // Proveedor del mock para Storage
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
