import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EdicionPerfilPage } from './edicion-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: EdicionPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EdicionPerfilPageRoutingModule {}
