import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoTorneoPage } from './nuevo-torneo.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoTorneoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoTorneoPageRoutingModule {}
