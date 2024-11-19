import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentaAdminPage } from './cuenta-admin.page';
import { SqliteService } from 'src/app/services/sqlite.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular'; // Import IonicStorageModule

// Mock para SQLite
class MockSQLite {
  create() {
    return Promise.resolve();
  }
}

// Mock para Storage (if necessary)
class MockStorage {
  get() {
    return Promise.resolve(null);
  }
  set() {
    return Promise.resolve();
  }
  remove() {
    return Promise.resolve();
  }
}

describe('CuentaAdminPage', () => {
  let component: CuentaAdminPage;
  let fixture: ComponentFixture<CuentaAdminPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuentaAdminPage],
      imports: [
        IonicModule.forRoot(), // Ensure IonicModule is imported
        IonicStorageModule.forRoot(), // Import IonicStorageModule
      ],
      providers: [
        SqliteService,
        { provide: SQLite, useClass: MockSQLite }, // Mock de SQLite
        { provide: Storage, useClass: MockStorage }, // Mock de Storage if needed
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
