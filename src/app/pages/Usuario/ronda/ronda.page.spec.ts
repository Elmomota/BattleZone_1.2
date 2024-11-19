import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RondaPage } from './ronda.page';

describe('RondaPage', () => {
  let component: RondaPage;
  let fixture: ComponentFixture<RondaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RondaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
