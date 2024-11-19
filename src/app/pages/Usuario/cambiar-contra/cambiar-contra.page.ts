import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Usuario } from 'src/app/services/usuario';

@Component({
  selector: 'app-cambiar-contra',
  templateUrl: './cambiar-contra.page.html',
  styleUrls: ['./cambiar-contra.page.scss'],
})
export class CambiarContraPage implements OnInit {
  usuario: Usuario = new Usuario();
  contrasenaActual: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  constructor(
    private sqliteService: SqliteService,
    private alertController: AlertController,
    private navController: NavController
  ) {}

  async ngOnInit() {
    try {
      const usuarioSesion = await this.sqliteService.obtenerSesion();
      if (usuarioSesion) {
        this.usuario = usuarioSesion;
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se encontró un usuario activo.',
          buttons: ['OK'],
        });
        await alert.present();
        this.navController.navigateBack('/login');
      }
    } catch (error) {
      console.error('Error al obtener la sesión:', error);
    }
  }

  async cambiarContrasena() {
    if (!this.contrasenaActual || !this.nuevaContrasena || !this.confirmarContrasena) {
      await this.presentAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      await this.presentAlert('Error', 'Las nuevas contraseñas no coinciden.');
      return;
    }

    try {
      // Verificar si la contraseña actual es correcta
      const usuarioVerificado = await this.sqliteService.loginUsuario(
        this.usuario.correo,
        this.contrasenaActual
      );

      if (usuarioVerificado) {
        // Actualizar la contraseña en la base de datos
        this.usuario.contrasena = this.nuevaContrasena;
        await this.sqliteService.actualizarUsuarioContra(this.usuario);

        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Contraseña actualizada correctamente.',
          buttons: ['OK'],
        });
        await alert.present();

        this.navController.navigateBack('/cuenta');
      } else {
        await this.presentAlert('Error', 'La contraseña actual es incorrecta.');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      await this.presentAlert('Error', 'No se pudo actualizar la contraseña. Inténtalo de nuevo.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
