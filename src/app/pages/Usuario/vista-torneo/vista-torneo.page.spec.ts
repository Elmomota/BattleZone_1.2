import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaTorneoPage } from './vista-torneo.page';

describe('VistaTorneoPage', () => {
  let component: VistaTorneoPage;
  let fixture: ComponentFixture<VistaTorneoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaTorneoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
