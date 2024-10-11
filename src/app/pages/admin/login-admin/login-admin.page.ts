import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service'; // Importar el servicio

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
})
export class LoginAdminPage implements OnInit {
  
  newNameUser: string = "";
  password: string = "";

  constructor(
    private router: Router,
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private sqliteService: SqliteService // Inyectar el servicio SQLite
  ) { }

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

  async validarRegistro() {
    if (this.newNameUser === "" || this.password === "") {
      await this.presentAlert('Campos incompletos', 'Por favor, rellena todos los campos obligatorios.');
      return;
    }
    
    // Verificar el admin con la base de datos
    this.sqliteService.fetchAdministradores().subscribe(async administradores => {
      // Verificar si administradores está definido
      if (!administradores) {
        await this.presentAlert('Error', 'No se pudo obtener la lista de administradores.');
        return;
      }
      
      // Buscar el administrador correspondiente
      const admin = administradores.find(admin => admin.nombre === this.newNameUser);
  
      if (!admin || admin.contrasena !== this.password) {
        await this.presentAlert('Datos incorrectos', 'Los datos ingresados son incorrectos');
        return;
      }
      
      this.irPagina(admin.nombre);
    }, async error => {
      console.error('Error validando el administrador:', error);
      await this.presentAlert('Error', 'Hubo un problema al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
    });
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

