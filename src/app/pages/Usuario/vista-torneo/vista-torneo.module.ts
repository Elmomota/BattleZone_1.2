import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaTorneoPageRoutingModule } from './vista-torneo-routing.module';

import { VistaTorneoPage } from './vista-torneo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaTorneoPageRoutingModule
  ],
  declarations: [VistaTorneoPage]
})
export class VistaTorneoPageModule {}
