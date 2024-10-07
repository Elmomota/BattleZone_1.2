import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuentaAdminPageRoutingModule } from './cuenta-admin-routing.module';

import { CuentaAdminPage } from './cuenta-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuentaAdminPageRoutingModule
  ],
  declarations: [CuentaAdminPage]
})
export class CuentaAdminPageModule {}
