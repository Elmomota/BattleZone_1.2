import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleJuegoPageRoutingModule } from './detalle-juego-routing.module';

import { DetalleJuegoPage } from './detalle-juego.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleJuegoPageRoutingModule
  ],
  declarations: [DetalleJuegoPage]
})
export class DetalleJuegoPageModule {}
