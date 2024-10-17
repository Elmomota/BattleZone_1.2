import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';

interface Usuario {
  id?: number;
  pnombre: string;
  papellido: string;
  nickname: string;
  correo: string;
  contrasena: string;
  fechaNacimiento: string;
  edad: number;
  pais: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  nuevoUsuario: Usuario = {
    pnombre: '',
    papellido: '',
    nickname: '',
    correo: '',
    contrasena: '',
    fechaNacimiento: '',
    edad: 0,
    pais: ''
  };
  pnombreError: string = '';
  papellidoError: string = '';
  nicknameError: string = '';
  correoError: string = '';
  contrasenaError: string = '';
  confiPasswordError: string = '';
  fechaNacimientoError: string = '';
  paisError: string = '';

  confiPassword: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private menuCtrl: MenuController,
    private sqliteService: SqliteService,
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

  async presentToast(message: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: position,
    });
    await toast.present();
  }

  verificarEdad() {
    const dob = new Date(this.nuevoUsuario.fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
  
    this.nuevoUsuario.edad = age;
  
    if (this.nuevoUsuario.edad < 15) {
      this.fechaNacimientoError = 'Debes tener al menos 15 años para registrarte.';
    } else {
      this.fechaNacimientoError = '';
    }
  }

  async validarRegistro() {
    this.limpiarErrores();
  
    // Validar cada campo individualmente
    if (!this.nuevoUsuario.pnombre) {
      this.pnombreError = 'El primer nombre es obligatorio';
      return;
    }
    if (this.nuevoUsuario.pnombre.length < 3 || this.nuevoUsuario.pnombre.length > 50) {
      this.pnombreError = 'El primer nombre debe tener entre 2 y 50 caracteres';
      return;
    }
  
    if (!this.nuevoUsuario.papellido) {
      this.papellidoError = 'El apellido es obligatorio';
      return;
    }
    if (this.nuevoUsuario.papellido.length < 3 || this.nuevoUsuario.papellido.length > 50) {
      this.papellidoError = 'El apellido debe tener entre 2 y 50 caracteres';
      return;
    }
  
    if (!this.nuevoUsuario.nickname) {
      this.nicknameError = 'El nickname es obligatorio';
      return;
    }
    if (this.nuevoUsuario.nickname.length < 3 || this.nuevoUsuario.nickname.length > 30) {
      this.nicknameError = 'El nickname debe tener entre 3 y 30 caracteres';
      return;
    }
  
    if (!this.nuevoUsuario.correo) {
      this.correoError = 'El correo es obligatorio';
      return;
    }
  
    if (!this.nuevoUsuario.contrasena) {
      this.contrasenaError = 'La contraseña es obligatoria';
      return;
    }
  
    if (!this.confiPassword) {
      this.confiPasswordError = 'Debes confirmar tu contraseña';
      return;
    }
  
    if (!this.nuevoUsuario.pais) {
      this.paisError = 'El país es obligatorio';
      return;
    }
  
    // Validar el formato del correo electrónico
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.nuevoUsuario.correo)) {
      this.correoError = 'Por favor, introduce un correo electrónico válido.';
      return;
    }
  
    // Validar que las contraseñas coincidan
    if (this.nuevoUsuario.contrasena !== this.confiPassword) {
      this.confiPasswordError = 'Las contraseñas ingresadas no son iguales.';
      return;
    }
  
    // Validar la fortaleza de la contraseña
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordPattern.test(this.nuevoUsuario.contrasena)) {
      this.contrasenaError = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.';
      return;
    }
  
    // Verificar si la fecha de nacimiento es válida
    if (this.fechaNacimientoError) {
      return;
    }
  
    // Comprobar si el correo o nickname ya existen
    let existingUsers: Usuario[] = [];
    try {
      const fetchedUsers = await this.sqliteService.fetchUsuarios().toPromise();
      
      if (fetchedUsers) {
        existingUsers = fetchedUsers; // Solo asignar si no es undefined
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return;
    }
  
    const userExists = existingUsers.some(user => user.correo === this.nuevoUsuario.correo || user.nickname === this.nuevoUsuario.nickname);
    if (userExists) {
      this.correoError = 'El correo o nickname ya está en uso. Por favor, elige otro.';
      return;
    }
  
    // Confirmación antes de registrar al usuario
    const alert = await this.alertController.create({
      header: 'Confirmar Registro',
      message: '¿Estás seguro de que deseas crear este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Crear',
          handler: async () => {
            try {
              await this.sqliteService.addUsuario(this.nuevoUsuario);
              await this.presentToast('Usuario registrado correctamente.', 'top');
              await this.router.navigate(['/login']);
            } catch (error) {
              console.error('Error al registrar el usuario:', error);
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo registrar el usuario. Intenta nuevamente.',
                buttons: ['OK'],
              });
              await errorAlert.present();
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  limpiarErrores() {
    this.pnombreError = '';
    this.papellidoError = '';
    this.nicknameError = '';
    this.correoError = '';
    this.contrasenaError = '';
    this.confiPasswordError = '';
    this.fechaNacimientoError = '';
    this.paisError = '';
  }

  irLogin() {
    this.router.navigate(['/login']);
  }
}
