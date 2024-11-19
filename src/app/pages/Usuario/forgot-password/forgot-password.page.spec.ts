import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordPage } from './forgot-password.page';
import { SqliteService } from 'src/app/services/sqlite.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Storage } from '@ionic/storage-angular'; // Asegúrate de importar el Storage correcto
import { of } from 'rxjs';

// Mock de SQLite
class MockSQLite {
  executeSql = jasmine.createSpy().and.returnValue(Promise.resolve([]));
}

// Mock de Storage
class MockStorage {
  get = jasmine.createSpy().and.returnValue(Promise.resolve(null));
  set = jasmine.createSpy().and.returnValue(Promise.resolve());
  remove = jasmine.createSpy().and.returnValue(Promise.resolve());
}

describe('ForgotPasswordPage', () => {
  let component: ForgotPasswordPage;
  let fixture: ComponentFixture<ForgotPasswordPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordPage],
      providers: [
        SqliteService,
        { provide: SQLite, useClass: MockSQLite }, // Usamos el mock para SQLite
        { provide: Storage, useClass: MockStorage } // Usamos el mock para Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Añadir más pruebas si es necesario
});
