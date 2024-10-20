import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaTorneoPage } from './vista-torneo.page';

const routes: Routes = [
  {
    path: '',
    component: VistaTorneoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaTorneoPageRoutingModule {}
