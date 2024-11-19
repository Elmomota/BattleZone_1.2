import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TorneosPage } from './torneos.page';
import { SqliteService } from 'src/app/services/sqlite.service'; 
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('TorneosPage', () => {
  let component: TorneosPage;
  let fixture: ComponentFixture<TorneosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TorneosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
