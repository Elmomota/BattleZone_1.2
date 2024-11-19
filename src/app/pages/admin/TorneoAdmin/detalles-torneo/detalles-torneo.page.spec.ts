import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesTorneoPage } from './detalles-torneo.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DetallesTorneoPage', () => {
  let component: DetallesTorneoPage;
  let fixture: ComponentFixture<DetallesTorneoPage>;

  beforeEach(() => {
    // Crear un mock de ActivatedRoute
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (param: string) => {
            if (param === 'id') {
              return '123';  // Simulando un ID de torneo
            }
            return null;
          },
        },
      },
    };

    TestBed.configureTestingModule({
      declarations: [DetallesTorneoPage],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesTorneoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
