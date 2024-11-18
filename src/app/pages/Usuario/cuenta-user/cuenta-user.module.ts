import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuentaUserPageRoutingModule } from './cuenta-user-routing.module';

import { CuentaUserPage } from './cuenta-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuentaUserPageRoutingModule
  ],
  declarations: [CuentaUserPage]
})
export class CuentaUserPageModule {}
