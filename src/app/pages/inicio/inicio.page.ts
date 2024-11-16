import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular'; // Para manejar la sesión
import { Network } from '@capacitor/network'; // Importa Network API

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private storage: Storage,
    private navCtrl: NavController,
    private alertController: AlertController // Para mostrar alertas
  ) {
    this.storage.create();
  }

  async ngOnInit() {
    this.menuCtrl.enable(false);

    // Detectar cambios en el estado de la red
    this.detectarConexion();

    // Comprueba si hay una sesión activa
    const usuario = await this.storage.get('usuario'); 
    if (usuario?.rol === 1) {
      this.navCtrl.navigateForward(`/cuenta-admin`, {
        queryParams: { usuario: JSON.stringify(usuario) }
      });
    } else if (usuario?.rol === 2) {
      this.navCtrl.navigateForward(`/home`, {
        queryParams: { usuario: JSON.stringify(usuario) }
      });
    } else {
      console.log('No hay sesión activa');
    }
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  inicio() {
    this.router.navigate(['/iniciar-sesion']);
  }

  adminLogin() {
    this.router.navigate(['/iniciar-sesion']);
  }

  async detectarConexion() {
    // Verifica la conexión inicial
    const status = await Network.getStatus();
    if (!status.connected) {
      this.mostrarAlertaSinConexion();
    }

    // Escucha cambios en el estado de la red
    Network.addListener('networkStatusChange', (status) => {
      if (!status.connected) {
        this.mostrarAlertaSinConexion();
      }
    });
  }

  async mostrarAlertaSinConexion() {
    const alert = await this.alertController.create({
      header: 'Sin conexión a Internet',
      message: 'Por favor, verifica tu conexión a Internet.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
