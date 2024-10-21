import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Usuario } from 'src/app/services/usuario'; // Asegúrate de tener este modelo definido

@Component({
  selector: 'app-edicion-perfil',
  templateUrl: './edicion-perfil.page.html',
  styleUrls: ['./edicion-perfil.page.scss'],
})
export class EdicionPerfilPage implements OnInit {
  eleCorreo: string = '';
  pnombre: string = '';  // Para el nombre
  papellido: string = '';  // Para el apellido
  nickname: string = '';  // Para el nickname
  usuario: Usuario | null = null; // Almacena los datos del usuario

  constructor(
    private router: Router,
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private sqliteService: SqliteService  // Servicio para interactuar con la base de datos
  ) {}

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.obtenerDatosUsuario(); // Llama al método para obtener los datos del usuario
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

  // Obtener los datos del usuario desde la sesión
  async obtenerDatosUsuario() {
    this.usuario = await this.sqliteService.obtenerSesion(); // Obtener la sesión del usuario
    if (this.usuario) {
      this.pnombre = this.usuario.pnombre || ''; // Asignar el nombre del usuario
      this.papellido = this.usuario.papellido || ''; // Asignar el apellido del usuario
      this.nickname = this.usuario.nickname || ''; // Asignar el nickname del usuario
      this.eleCorreo = this.usuario.correo || ''; // Asignar el correo electrónico del usuario
    } else {
      await this.presentAlert('Error', 'No se encontró la sesión del usuario.');
    }
  }

  // Verificar si todos los campos son válidos antes de continuar
  async validarCampos() {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!this.pnombre || !this.papellido || !this.nickname || !this.eleCorreo) {
      await this.presentAlert('Error', 'Todos los campos son obligatorios.');
      return false;
    }
    if (!emailRegex.test(this.eleCorreo)) {
      await this.presentAlert('Error', 'Por favor, ingresa un correo electrónico válido.');
      return false;
    }
    return true;
  }

  // Método para enviar la solicitud de cambio de datos
  async enviarConfirmacion() {
    if (await this.validarCampos()) {
      try {
        // Actualizar datos del usuario
        if (this.usuario) {
          this.usuario.pnombre = this.pnombre; // Actualizar nombre
          this.usuario.papellido = this.papellido; // Actualizar apellido
          this.usuario.nickname = this.nickname; // Actualizar nickname
          this.usuario.correo = this.eleCorreo; // Actualizar correo
          
          await this.sqliteService.actualizarUsuario(this.usuario);
          await this.presentAlert('Éxito', 'Tus datos han sido actualizados.');
          this.irPagina();
        } else {
          await this.presentAlert('Error', 'No se encontró el usuario en la sesión.');
        }
      } catch (error) {
        await this.presentAlert('Error', 'Hubo un problema al actualizar tus datos.');
      }
    }
  }

  // Método para redirigir a la página de inicio de sesión después de cambiar los datos
  irPagina() {
    this.router.navigate(['/cuenta']);
  }
}
