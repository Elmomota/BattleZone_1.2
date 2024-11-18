import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Usuario } from 'src/app/services/usuario';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  eleCorreo: string = '';
  preguntaSeguridad: string = ''; // Para mostrar la pregunta de seguridad
  respuestaSeguridad: string = ''; // Para almacenar la respuesta ingresada
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  usuario: Usuario | null = null; // Usuario encontrado por correo

  constructor(
    private router: Router,
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private sqliteService: SqliteService
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

  // Paso 1: Verificar el correo y recuperar la pregunta de seguridad
  async verificarCorreo() {
    if (!this.eleCorreo) {
      await this.presentAlert('Error', 'Debes ingresar un correo electrónico.');
      return;
    }
  
    try {
      // Buscar el usuario por correo
      const usuario = await this.sqliteService.getUsuarioByCorreo(this.eleCorreo);
  
      if (usuario) {
        this.usuario = usuario; // Guarda el usuario encontrado
        const pregunta = await this.sqliteService.getPreguntaSeguridad(usuario.id);
  
        if (pregunta) {
          this.preguntaSeguridad = pregunta; // Muestra la pregunta asociada
        } else {
          await this.presentAlert('Error', 'No se encontró una pregunta de seguridad para este usuario.');
        }
      } else {
        await this.presentAlert('Error', 'No se encontró un usuario con el correo proporcionado.');
      }
    } catch (error) {
      await this.presentAlert('Error', 'Ocurrió un error al verificar el correo.');
    }
  }
  
  // Paso 2: Validar respuesta de seguridad
  async validarRespuesta() {
    if (!this.respuestaSeguridad) {
      await this.presentAlert('Error', 'Debes ingresar una respuesta a la pregunta de seguridad.');
      return;
    }
  
    if (!this.usuario || !this.usuario.id) {
      await this.presentAlert('Error', 'No se pudo verificar al usuario.');
      return;
    }
  
    try {
      const esValida = await this.sqliteService.validarRespuestaSeguridad(this.usuario.id, this.respuestaSeguridad);
  
      if (esValida) {
        // Activar la sección para cambiar la contraseña
        this.nuevaContrasena = '';
        this.confirmarContrasena = '';
      } else {
        await this.presentAlert('Error', 'La respuesta de seguridad no es correcta.');
      }
    } catch (error) {
      await this.presentAlert('Error', 'Ocurrió un error al validar la respuesta de seguridad.');
    }
  }
  

  // Paso 3: Cambiar la contraseña
  async cambiarContrasena() {
    if (!this.nuevaContrasena || !this.confirmarContrasena) {
      await this.presentAlert('Error', 'Debes completar ambos campos de contraseña.');
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      await this.presentAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      this.usuario!.contrasena = this.nuevaContrasena; // Actualizar la contraseña
      await this.sqliteService.actualizarUsuario(this.usuario!);
      await this.presentAlert('Éxito', 'Tu contraseña ha sido actualizada.');
      this.router.navigate(['/iniciar-sesion']);
    } catch (error) {
      await this.presentAlert('Error', 'Ocurrió un error al actualizar la contraseña.');
    }
  }
}
