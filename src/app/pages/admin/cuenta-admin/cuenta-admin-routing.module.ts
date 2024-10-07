import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentaAdminPage } from './cuenta-admin.page';

const routes: Routes = [
  {
    path: '',
    component: CuentaAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentaAdminPageRoutingModule {}
