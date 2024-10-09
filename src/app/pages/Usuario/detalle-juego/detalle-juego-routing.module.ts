import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleJuegoPage } from './detalle-juego.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleJuegoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleJuegoPageRoutingModule {}
