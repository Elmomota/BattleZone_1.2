import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  NameUser: string = "";
  password: string = "";

  constructor(
    private router: Router,
    private alertController: AlertController,
    private menuCtrl: MenuController,
    private sqliteService: SqliteService,
    private toastController: ToastController // Añadir ToastController para mostrar mensajes
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

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Sesión iniciada correctamente',
      duration: 2500,
      position: position,
    });
    await toast.present();
  }

  async validarRegistro() {
    if (this.NameUser === "" || this.password === "") {
      await this.presentAlert('Campos incompletos', 'Por favor, rellena todos los campos obligatorios.');
      return;
    }
    
    // Verificar el usuario con la base de datos
    this.sqliteService.fetchUsuarios().subscribe(async usuarios => {
      if (!usuarios) {
        await this.presentAlert('Error', 'No se pudo obtener la lista de usuarios.');
        return;
      }

      // Buscar el usuario por nickname o correo electrónico
      const user = usuarios.find(user => user.nickname === this.NameUser || user.correo === this.NameUser);
  
      if (!user || user.contrasena !== this.password) {
        await this.presentAlert('Datos incorrectos', 'Los datos ingresados son incorrectos');
        return;
      }
      
      this.irPagina(user.pnombre); // Pasar el nombre de usuario a la siguiente página
    }, async error => {
      console.error('Error validando el usuario:', error);
      await this.presentAlert('Error', 'Hubo un problema al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
    });
  }

  irPagina(nombreUsuario: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        nombreUser: nombreUsuario
      }
    };

    this.presentToast('bottom');
    this.router.navigate(['/home'], navigationExtras);
  }

  irRegister() {
    this.router.navigate(['/register']);
  }
}
