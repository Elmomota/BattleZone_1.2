import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage {
  correoNickname: string = '';  // Puede ser correo o nickname
  contrasena: string = '';

  constructor(
    private sqliteService: SqliteService,
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  loginUsuario() {
    // Intentamos el inicio de sesión con el correo/nickname y contraseña
    this.sqliteService.loginUsuario(this.correoNickname, this.contrasena).then(usuario => {
      if (usuario) {
        // Guardar la sesión con los detalles del usuario
        this.sqliteService.guardarSesion(usuario).then(() => {
          // Redirigir según el rol del usuario
          if (usuario.rol === 1) {
            this.navCtrl.navigateForward(`/cuenta-admin`, {
              queryParams: { usuario: JSON.stringify(usuario) }
            });
          } else if (usuario.rol === 2) {
            this.navCtrl.navigateForward(`/home`, {
              queryParams: { usuario: JSON.stringify(usuario) }
            });
          }
        });
      } else {
        // Manejar error de login
        this.mostrarAlertaError();
      }
    });
  }

  async mostrarAlertaError() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Inicio de sesión fallido',
      message: 'Correo o contraseña incorrectos.',
      buttons: ['OK']
    });

    await alert.present();
  }

  irPagina() {
    this.router.navigate(['/forgot-password']);
  }

  irRegister(){
    this.router.navigate(['/registro'])
  }
}
