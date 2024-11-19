import { TestBed } from '@angular/core/testing';
import { InicioPage } from './inicio.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Storage } from '@ionic/storage-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InicioPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicioPage],
      imports: [IonicStorageModule.forRoot()],
      providers: [
        { provide: Storage, useValue: { /* Métodos mock */ } },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignorar errores de plantilla
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(InicioPage);
    const page = fixture.componentInstance;
    expect(page).toBeTruthy();
  });
});
