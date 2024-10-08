import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';  // Asegúrate de importar tu servicio de SQLite
import * as bcrypt from 'bcryptjs';  // Para comparar las contraseñas encriptadas

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
})
export class LoginAdminPage implements OnInit {
  newNameUser: string = '';
  correo: string = "";
  password: string = "";

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private menuCtrl: MenuController,
    private sqliteService: SqliteService  // Inyectamos el servicio
  ) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.predefinirAdmin();  // Crear el admin predefinido al iniciar la página
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

  // Función para crear un admin predefinido
  async predefinirAdmin() {
    try {
      const adminExistente = await this.sqliteService.getAdminByEmail('elmoadicto770@gmail.com');
      if (!adminExistente) {
        await this.sqliteService.addAdministrador({
          nombre: 'elmomota',
          correo: 'elmoadicto770@gmail.com',
          contraseña: 'elmo2003*'  // La contraseña será encriptada en el servicio
        });
        console.log('Administrador predefinido creado');
      } else {
        console.log('Administrador predefinido ya existe');
      }
    } catch (error) {
      console.error('Error al crear el administrador predefinido', error);
    }
  }

  // Función para validar el login
  async validarRegistro() {
    if (this.correo === "" || this.password === "") {
      await this.presentAlert('Campos incompletos', 'Por favor, rellena todos los campos obligatorios.');
      return;
    }

    try {
      const admin = await this.sqliteService.getAdminByEmail(this.correo);
      if (admin) {
        const passwordCorrecta = await bcrypt.compare(this.password, admin.contraseña);
        if (passwordCorrecta) {
          this.irPagina(admin.nombre);
        } else {
          await this.presentAlert('Datos incorrectos', 'La contraseña es incorrecta.');
        }
      } else {
        await this.presentAlert('Datos incorrectos', 'No se encontró una cuenta con este correo.');
      }
    } catch (error) {
      console.error('Error en el login', error);
      await this.presentAlert('Error', 'Ocurrió un error al intentar iniciar sesión.');
    }
  }

  irPagina(nombreAdmin: string) {
    let contex: NavigationExtras = {
      state: {
        nombreUser: nombreAdmin
      }
    };
    this.router.navigate(['/cuenta-admin'], contex);
  }
}
