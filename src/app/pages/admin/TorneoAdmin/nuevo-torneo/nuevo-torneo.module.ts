import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoTorneoPageRoutingModule } from './nuevo-torneo-routing.module';

import { NuevoTorneoPage } from './nuevo-torneo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoTorneoPageRoutingModule
  ],
  declarations: [NuevoTorneoPage]
})
export class NuevoTorneoPageModule {}
