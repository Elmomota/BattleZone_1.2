import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Usuario } from 'src/app/services/usuario';
import { Preguntas } from 'src/app/services/preguntas'; // Interfaz para las preguntas

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  eleCorreo: string = '';
  preguntasDisponibles: Preguntas[] = []; // Todas las preguntas en la base de datos
  preguntasUsuario: string[] = []; // Preguntas de seguridad del usuario específico
  preguntaSeleccionada: string = ''; // Pregunta elegida por el usuario
  respuestaSeguridad: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  usuario: Usuario | null = null;
  step: number = 1; // Controla el paso actual

  constructor(
    private router: Router,
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private sqliteService: SqliteService
  ) {}

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.cargarPreguntas(); // Cargar todas las preguntas al iniciar
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

  // Cargar todas las preguntas disponibles
  async cargarPreguntas() {
    try {
      this.preguntasDisponibles = await this.sqliteService.getPreguntas();
    } catch (error) {
      console.error('Error al cargar preguntas:', error);
    }
  }

  // Verificar correo y cargar preguntas de seguridad del usuario
  async verificarCorreo() {
    if (!this.eleCorreo) {
      await this.presentAlert('Error', 'Debes ingresar un correo electrónico.');
      return;
    }

    try {
      const usuario = await this.sqliteService.getUsuarioByCorreo(this.eleCorreo);
      if (usuario) {
        this.usuario = usuario;
        this.preguntasUsuario = await this.sqliteService.getPreguntasSeguridad(usuario.id);
        if (this.preguntasUsuario.length > 0) {
          this.step = 2; // Avanzar al paso 2
        } else {
          await this.presentAlert('Error', 'No se encontraron preguntas de seguridad.');
        }
      } else {
        await this.presentAlert('Error', 'No se encontró un usuario con este correo.');
      }
    } catch (error) {
      await this.presentAlert('Error', 'Ocurrió un error al verificar el correo.');
    }
  }

  // Validar respuesta de seguridad
  async validarRespuesta() {
    if (!this.preguntaSeleccionada) {
      await this.presentAlert('Error', 'Debes seleccionar una pregunta de seguridad.');
      return;
    }

    if (!this.respuestaSeguridad) {
      await this.presentAlert('Error', 'Debes ingresar una respuesta.');
      return;
    }

    if (!this.usuario) {
      await this.presentAlert('Error', 'No se pudo verificar al usuario.');
      return;
    }

    // Verificar que la pregunta seleccionada coincide con las del usuario
    if (!this.preguntasUsuario.includes(this.preguntaSeleccionada)) {
      await this.presentAlert('Error', 'La pregunta seleccionada no coincide con tus datos.');
      return;
    }

    try {
      const esValida = await this.sqliteService.validarRespuestaSeguridad(
        this.usuario.id!,
        this.preguntaSeleccionada,
        this.respuestaSeguridad
      );

      if (esValida) {
        await this.presentAlert('Éxito', 'Respuesta correcta. Cambia tu contraseña.');
        this.step = 3; // Avanzar al paso 3
      } else {
        await this.presentAlert('Error', 'La respuesta no es correcta.');
      }
    } catch (error) {
      await this.presentAlert('Error', 'Ocurrió un error al validar la respuesta.');
    }
  }

  async cambiarContrasena() {
    if (!this.nuevaContrasena || !this.confirmarContrasena) {
      await this.presentAlert('Error', 'Debes completar ambos campos.');
      return;
    }
  
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      await this.presentAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }
  
    try {
      console.log('Usuario:', this.usuario);
      console.log('Nueva contraseña:', this.nuevaContrasena);
  
      // Actualizar la contraseña del usuario
      this.usuario!.contrasena = this.nuevaContrasena;
      await this.sqliteService.actualizarUsuarioContra(this.usuario!);
  
      await this.presentAlert('Éxito', 'Contraseña actualizada.');
      this.router.navigate(['/iniciar-sesion']);
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      await this.presentAlert('Error', 'No se pudo actualizar la contraseña.');
    }
  }
  
}
