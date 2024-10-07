import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarTorneoPageRoutingModule } from './modificar-torneo-routing.module';

import { ModificarTorneoPage } from './modificar-torneo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarTorneoPageRoutingModule
  ],
  declarations: [ModificarTorneoPage]
})
export class ModificarTorneoPageModule {}
