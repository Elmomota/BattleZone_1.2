import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesTorneoPageRoutingModule } from './detalles-torneo-routing.module';

import { DetallesTorneoPage } from './detalles-torneo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesTorneoPageRoutingModule
  ],
  declarations: [DetallesTorneoPage]
})
export class DetallesTorneoPageModule {}
