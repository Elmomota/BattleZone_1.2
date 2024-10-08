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


  async validacionLogin() {
    console.log('Datos ingresados:', this.correoONombre, this.password);
    
    if (this.correoONombre === "" || this.password === "") {
      await this.presentAlert('Error de validación', 'El campo de correo/nombre o contraseña está vacío');
      return;
    }
  
    try {
      let admin = null;
      
      // Verificar si es un correo o nombre
      if (this.correoONombre.includes('@')) {
        admin = await this.sqliteService.getAdminByEmail(this.correoONombre);
        if (!admin) {
          await this.presentAlert('Error de búsqueda', 'No se encontró un administrador con este correo');
          return;
        }
      } else {
        admin = await this.sqliteService.getAdminByName(this.correoONombre);
        if (!admin) {
          await this.presentAlert('Error de búsqueda', 'No se encontró un administrador con este nombre');
          return;
        }
      }
  
      // Si se encontró un administrador, procedemos a comparar las contraseñas
      console.log('Contraseña almacenada:', admin.contrasena);
      console.log('Contraseña ingresada:', this.password);
  
      if (admin.contrasena === this.password) {
        this.irPagina(admin.nombre); // Navegamos a la siguiente página si coincide
      } else {
        await this.presentAlert('Error de autenticación', 'La contraseña ingresada es incorrecta');
      }
      
    } catch (error) {
      console.error('Error al validar el login', error);
      await this.presentAlert('Error del sistema', 'Ocurrió un error inesperado al validar el login');
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
