import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';  // Importa tu servicio SQLite

@Component({
  selector: 'app-cambiar-contra',
  templateUrl: './cambiar-contra.page.html',
  styleUrls: ['./cambiar-contra.page.scss'],
})
export class CambiarContraPage implements OnInit {
  nuevaContrasena: string = '';
  contrasenaActual: string = '';
  usuario: any; // Objeto de usuario para almacenar los datos actuales (puedes obtenerlos desde sesión o base de datos)

  constructor(
    private sqliteService: SqliteService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    // Aquí puedes obtener el usuario desde sesión o base de datos
    this.usuario = { id: 1, correo: 'test@correo.com' }; // Ejemplo de datos de usuario
  }

  async cambiarContrasena() {
    if (!this.nuevaContrasena || !this.contrasenaActual) {
      await this.presentAlert('Error', 'Ambos campos son obligatorios.');
      return;
    }

    try {
      // Verificar la contraseña actual
      const usuarioVerificado = await this.sqliteService.loginUsuario(this.usuario.correo, this.contrasenaActual);

      if (usuarioVerificado) {
        // Si la contraseña actual es correcta, proceder a actualizar la nueva contraseña
        this.usuario.contrasena = this.nuevaContrasena;
        await this.sqliteService.actualizarUsuario(this.usuario); // Actualizar en la base de datos

        // Mostrar éxito y redirigir a la página de inicio de sesión
        await this.presentAlert('Éxito', 'Contraseña actualizada correctamente.');
        this.router.navigate(['/iniciar-sesion']);
      } else {
        // Si la contraseña actual es incorrecta
        await this.presentAlert('Error', 'La contraseña actual es incorrecta.');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      await this.presentAlert('Error', 'Ocurrió un error al cambiar la contraseña.');
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
