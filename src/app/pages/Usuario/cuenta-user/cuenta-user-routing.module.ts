import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentaUserPage } from './cuenta-user.page';

const routes: Routes = [
  {
    path: '',
    component: CuentaUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentaUserPageRoutingModule {}
