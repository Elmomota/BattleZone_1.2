import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuelosListaPage } from './duelos-lista.page';

describe('DuelosListaPage', () => {
  let component: DuelosListaPage;
  let fixture: ComponentFixture<DuelosListaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DuelosListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
