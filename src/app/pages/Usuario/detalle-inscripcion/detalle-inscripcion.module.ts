import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleInscripcionPageRoutingModule } from './detalle-inscripcion-routing.module';

import { DetalleInscripcionPage } from './detalle-inscripcion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleInscripcionPageRoutingModule
  ],
  declarations: [DetalleInscripcionPage]
})
export class DetalleInscripcionPageModule {}
