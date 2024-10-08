import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
})
export class LoginAdminPage implements OnInit {
  correoONombre: string = "";  
  password: string = "";

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private menuCtrl: MenuController,
    private sqliteService: SqliteService
  ) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.sqliteService.initDB();
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

  // Cambio de nombre de la función de validación
  async validacionLogin() {
    console.log('Datos ingresados:', this.correoONombre, this.password);
    if (this.correoONombre === "" || this.password === "") {
      await this.presentAlert('Error', 'Por favor, completa todos los campos');
      return;
    }

    try {
      let admin = null;
      // Verificar si es un correo o nombre
      if (this.correoONombre.includes('@')) {
        admin = await this.sqliteService.getAdminByEmail(this.correoONombre);
      } else {
        admin = await this.sqliteService.getAdminByName(this.correoONombre);
      }

      // Si se encontró un administrador, procedemos a comparar las contraseñas
      if (admin) {
        console.log('Contraseña almacenada:', admin.contraseña);
        console.log('Contraseña ingresada:', this.password);

        if (admin.contraseña === this.password) {
          this.irPagina(admin.nombre); // Navegamos a la siguiente página si coincide
        } else {
          await this.presentAlert('Error', 'Nombre de usuario/correo o contraseña incorrectos');
        }
      } else {
        await this.presentAlert('Error', 'Nombre de usuario/correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al validar el login', error);
      await this.presentAlert('Error', 'Ocurrió un error al validar el login');
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
