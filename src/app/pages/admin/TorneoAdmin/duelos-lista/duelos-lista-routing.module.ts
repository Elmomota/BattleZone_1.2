import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DuelosListaPage } from './duelos-lista.page';

const routes: Routes = [
  {
    path: '',
    component: DuelosListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuelosListaPageRoutingModule {}
