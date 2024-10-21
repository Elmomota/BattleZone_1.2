import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EdicionPerfilPageRoutingModule } from './edicion-perfil-routing.module';

import { EdicionPerfilPage } from './edicion-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EdicionPerfilPageRoutingModule
  ],
  declarations: [EdicionPerfilPage]
})
export class EdicionPerfilPageModule {}
