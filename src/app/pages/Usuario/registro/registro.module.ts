import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RegistroPageRoutingModule } from './registro-routing.module';
import { RegistroPage } from './registro.page';
import { SqliteService } from 'src/app/services/sqlite.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroPageRoutingModule,
  ],
  declarations: [RegistroPage],
  providers: [SqliteService], // Proveedor agregado
})
export class RegistroPageModule {}
