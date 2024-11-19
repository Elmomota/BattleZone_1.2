import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentaPage } from './cuenta.page';
import { SqliteService } from 'src/app/services/sqlite.service'; 
import { Storage } from '@ionic/storage-angular'; // Importar Storage
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; 
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

// Mock para Storage
class MockStorage {
  private store: { [key: string]: any } = {};

  create() {
    return Promise.resolve(this);
  }

  get(key: string) {
    return Promise.resolve(this.store[key]);
  }

  set(key: string, value: any) {
    this.store[key] = value;
    return Promise.resolve(true);
  }

  remove(key: string) {
    delete this.store[key];
    return Promise.resolve(true);
  }
}

// Mock para SQLite
class MockSQLite {
  // Agrega métodos si necesitas simular más comportamiento
}

describe('CuentaPage', () => {
  let component: CuentaPage;
  let fixture: ComponentFixture<CuentaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuentaPage],
      imports: [IonicModule.forRoot(), FormsModule], // Agrega IonicModule si es necesario
      providers: [
        SqliteService,
        { provide: Storage, useClass: MockStorage }, // Proveedor para Storage
        { provide: SQLite, useClass: MockSQLite } // Proveedor para SQLite
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
