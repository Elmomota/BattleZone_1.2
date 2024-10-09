import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleJuegoPage } from './detalle-juego.page';

describe('DetalleJuegoPage', () => {
  let component: DetalleJuegoPage;
  let fixture: ComponentFixture<DetalleJuegoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleJuegoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
