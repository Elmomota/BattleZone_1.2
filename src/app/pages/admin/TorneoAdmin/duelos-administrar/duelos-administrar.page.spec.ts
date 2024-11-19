import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuelosAdministrarPage } from './duelos-administrar.page';

describe('DuelosAdministrarPage', () => {
  let component: DuelosAdministrarPage;
  let fixture: ComponentFixture<DuelosAdministrarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DuelosAdministrarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
