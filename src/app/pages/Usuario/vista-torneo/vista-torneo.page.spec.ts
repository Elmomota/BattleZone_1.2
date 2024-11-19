import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaTorneoPage } from './vista-torneo.page';
import { SqliteService } from 'src/app/services/sqlite.service'; 
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

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
