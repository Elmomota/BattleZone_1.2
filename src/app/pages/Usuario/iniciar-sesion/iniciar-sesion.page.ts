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
  correo: string = '';
  contrasena: string = '';

  constructor(private sqliteService: SqliteService, private router: Router, private navCtrl: NavController, private alertController: AlertController) {}



  loginUsuario() {
    this.sqliteService.loginUsuario(this.correo, this.contrasena).then(usuario => {
      if (usuario) {
        // Buscar los detalles completos del usuario en la base de datos por correo
        this.sqliteService.getUsuarioByCorreo(this.correo).then(detallesUsuario => {
          if (detallesUsuario) {
            // Guardar la sesión con los detalles del usuario
            this.sqliteService.guardarSesion(detallesUsuario).then(() => {
             
              this.navCtrl.navigateForward(`/home`, {
                queryParams: {
                  usuario: JSON.stringify(detallesUsuario)
                }
              });
            });
          } else {
            console.error('Usuario no encontrado.');
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
}

