import { Component, AfterViewInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements AfterViewInit {

  constructor(private navCtrl: NavController) {}

  ngAfterViewInit() {
    // Opcional: Redirige después de 5 segundos, incluso si el video no termina
    setTimeout(() => this.goToHome(), 5000);
  }

  goToHome() {
    this.navCtrl.navigateForward('/inicio'); // Cambia '/home' a la ruta de tu página de inicio
  }
}

