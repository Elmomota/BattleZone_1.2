import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoTorneoPage } from './nuevo-torneo.page';

describe('NuevoTorneoPage', () => {
  let component: NuevoTorneoPage;
  let fixture: ComponentFixture<NuevoTorneoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoTorneoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
