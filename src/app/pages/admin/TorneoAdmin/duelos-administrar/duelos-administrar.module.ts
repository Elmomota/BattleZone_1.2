import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DuelosAdministrarPageRoutingModule } from './duelos-administrar-routing.module';

import { DuelosAdministrarPage } from './duelos-administrar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DuelosAdministrarPageRoutingModule
  ],
  declarations: [DuelosAdministrarPage]
})
export class DuelosAdministrarPageModule {}
