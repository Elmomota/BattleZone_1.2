import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Usuario } from 'src/app/services/usuario'; // Asegúrate de tener este modelo definido

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  eleCorreo: string = '';
  pnombre: string = '';  // Para el nombre
  papellido: string = '';  // Para el apellido
  nuevaContrasena: string = '';  // Para la nueva contraseña
  confirmarContrasena: string = '';  // Confirmar nueva contraseña

  constructor(
    private router: Router,
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private sqliteService: SqliteService  // Servicio para interactuar con la base de datos
  ) {}

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Verificar si todos los campos son válidos antes de continuar
  async validarCampos() {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!this.pnombre || !this.papellido || !this.eleCorreo || !this.nuevaContrasena || !this.confirmarContrasena) {
      await this.presentAlert('Error', 'Todos los campos son obligatorios.');
      return false;
    }
    if (!emailRegex.test(this.eleCorreo)) {
      await this.presentAlert('Error', 'Por favor, ingresa un correo electrónico válido.');
      return false;
    }
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      await this.presentAlert('Error', 'Las contraseñas no coinciden.');
      return false;
    }
    return true;
  }

  // Método para enviar la solicitud de cambio de contraseña
  async enviarConfirmacion() {
    if (await this.validarCampos()) {
      try {
        // Buscar usuario por correo electrónico
        const usuario = await this.sqliteService.getUsuarioByCorreo(this.eleCorreo);
        if (usuario) {
          // Actualizar datos del usuario
          usuario.pnombre = this.pnombre;
          usuario.papellido = this.papellido;
          usuario.contrasena = this.nuevaContrasena; // Debería ser una contraseña encriptada
          
          await this.sqliteService.actualizarUsuario(usuario);
          await this.presentAlert('Éxito', 'Tu contraseña ha sido actualizada.');
          this.irPagina();
        } else {
          await this.presentAlert('Error', 'Usuario no encontrado con el correo proporcionado.');
        }
      } catch (error) {
        await this.presentAlert('Error', 'Hubo un problema al actualizar tu contraseña.');
      }
    }
  }
  

  // Método para redirigir a la página de inicio de sesión después de cambiar la contraseña
  irPagina() {
    this.router.navigate(['/login']);
  }
}
