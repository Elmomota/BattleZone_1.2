import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { IniciarSesionPageRoutingModule } from './iniciar-sesion-routing.module';
import { IniciarSesionPage } from './iniciar-sesion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,  // Asegúrate de tenerlo aquí también
    IonicModule,
    IniciarSesionPageRoutingModule
  ],
  declarations: [IniciarSesionPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Agrega esto para manejar componentes personalizados
})
export class IniciarSesionPageModule {}
