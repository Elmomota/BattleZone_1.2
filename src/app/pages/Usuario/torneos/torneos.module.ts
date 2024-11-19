import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TorneosPageRoutingModule } from './torneos-routing.module';

import { TorneosPage } from './torneos.page';
import { TorneoService } from 'src/app/services/torneo-service.service'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TorneosPageRoutingModule
  ],
  declarations: [TorneosPage],
  providers: [TorneoService]
})
export class TorneosPageModule {}
