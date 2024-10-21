import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdicionPerfilPage } from './edicion-perfil.page';

describe('EdicionPerfilPage', () => {
  let component: EdicionPerfilPage;
  let fixture: ComponentFixture<EdicionPerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EdicionPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
