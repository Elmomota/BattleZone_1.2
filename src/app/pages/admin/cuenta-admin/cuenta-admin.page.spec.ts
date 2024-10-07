import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentaAdminPage } from './cuenta-admin.page';

describe('CuentaAdminPage', () => {
  let component: CuentaAdminPage;
  let fixture: ComponentFixture<CuentaAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
