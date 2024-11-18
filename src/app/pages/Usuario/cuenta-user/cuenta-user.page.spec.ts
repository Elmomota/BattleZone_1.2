import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentaUserPage } from './cuenta-user.page';

describe('CuentaUserPage', () => {
  let component: CuentaUserPage;
  let fixture: ComponentFixture<CuentaUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
