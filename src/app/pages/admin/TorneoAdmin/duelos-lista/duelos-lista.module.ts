import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DuelosListaPageRoutingModule } from './duelos-lista-routing.module';

import { DuelosListaPage } from './duelos-lista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DuelosListaPageRoutingModule
  ],
  declarations: [DuelosListaPage]
})
export class DuelosListaPageModule {}
