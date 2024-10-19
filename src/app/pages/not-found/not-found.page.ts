import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage {
  constructor(private navCtrl: NavController) {}

  goBack() {
    this.navCtrl.pop(); // Regresar a la página anterior
  }
}
