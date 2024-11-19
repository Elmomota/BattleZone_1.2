import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RondaPage } from './ronda.page';

const routes: Routes = [
  {
    path: '',
    component: RondaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RondaPageRoutingModule {}
