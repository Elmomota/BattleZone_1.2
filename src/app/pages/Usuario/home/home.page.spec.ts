import { ComponentFixture, TestBed } from '@angular/core/testing';  // Import ComponentFixture and TestBed
import { HomePage } from './home.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SqliteService } from 'src/app/services/sqlite.service';
import { ServicioApiService } from 'src/app/services/servicio-api.service';  // Ensure this is imported
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;  // Declare the fixture variable

  // Mock of ActivatedRoute and SqliteService
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jasmine.createSpy().and.returnValue('1') } },
    paramMap: of({ get: jasmine.createSpy().and.returnValue('1') })
  };

  const mockSqliteService = {
    obtenerSesion: jasmine.createSpy().and.returnValue(Promise.resolve({ nickname: 'testUser', rol: 1 })),
    fetchJuegos: jasmine.createSpy().and.returnValue(of([]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [HttpClientModule],  // Import HttpClientModule for HTTP requests
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SqliteService, useValue: mockSqliteService },
        ServicioApiService  // Ensure ServicioApiService is included in the providers
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);  // Create the component fixture
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
