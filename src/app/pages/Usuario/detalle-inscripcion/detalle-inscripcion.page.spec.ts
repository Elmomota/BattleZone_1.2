import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleInscripcionPage } from './detalle-inscripcion.page';

describe('DetalleInscripcionPage', () => {
  let component: DetalleInscripcionPage;
  let fixture: ComponentFixture<DetalleInscripcionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleInscripcionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
