import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RondaPageRoutingModule } from './ronda-routing.module';

import { RondaPage } from './ronda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RondaPageRoutingModule
  ],
  declarations: [RondaPage]
})
export class RondaPageModule {}
