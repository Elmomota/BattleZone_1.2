import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleInscripcionPage } from './detalle-inscripcion.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleInscripcionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleInscripcionPageRoutingModule {}
