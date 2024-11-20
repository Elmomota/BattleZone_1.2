import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service'; // Importa tu servicio SQLite
import { Network } from '@capacitor/network'; // Importa el plugin Network
import { AlertController } from '@ionic/angular'; // Para mostrar alertas

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Torneos', url: '/torneos', icon: 'trophy' },
    { title: 'Mi Perfil', url: '/cuenta', icon: 'person' },
  ];
  private rolUsuario: number | null = null; // Para almacenar el rol del usuario

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private sqliteService: SqliteService, // Inyecta el servicio SQLite
    private alertCtrl: AlertController // Inyecta el servicio AlertController
  ) {}

  ngOnInit() {
    this.checkSession(); // Verifica la sesión al iniciar la aplicación
    this.checkNetworkStatus(); // Verifica el estado de la conexión al iniciar la aplicación
  }

  // Función para verificar la sesión
  async checkSession() {
    try {
      // Recupera la sesión desde SQLite o localStorage/sessionStorage
      const session = await this.sqliteService.obtenerSesion(); // Asumiendo que tienes una función que recupera la sesión desde la base de datos
    
      if (session) {
        this.rolUsuario = session.rol; // Guarda el rol del usuario

        // Actualiza las opciones del menú según el rol
        this.updateMenu();

        // Redirige al usuario dependiendo de su rol
        if (session.rol === 1) {
          // Redirige al administrador
          this.router.navigate(['/cuenta-admin']);
        } else if (session.rol === 2) {
          // Redirige al cliente
          this.router.navigate(['/home']);
        }
      } else {
        // Si no hay sesión, redirige a la página de inicio (login)
        this.router.navigate(['/inicio']);
      }
    } catch (error) {
      console.error('Error al obtener la sesión:', error);
      this.router.navigate(['/inicio']); // Redirige al login si hay un error
    }
  }

  // Función para actualizar el menú según el rol del usuario
  updateMenu() {
    if (this.rolUsuario === 1) {
      // Rol de administrador: cambia "Home" a "Cuenta Admin" y elimina "Torneos"
      this.appPages = [
        { title: 'Cuenta Admin', url: '/cuenta-admin', icon: 'person' },
        { title: 'Mi Perfil', url: '/cuenta', icon: 'person' },
      ];
    } else if (this.rolUsuario === 2) {
      // Rol de cliente: mantiene el menú completo
      this.appPages = [
        { title: 'Home', url: '/home', icon: 'home' },
        { title: 'Torneos', url: '/torneos', icon: 'trophy' },
        { title: 'Mi Perfil', url: '/cuenta', icon: 'person' },
        { title: 'Mis Torneos', url: '/progreso', icon: 'trophy' },
      ];
    }
  }

  // Función para verificar el estado de la conexión a Internet
  async checkNetworkStatus() {
    const status = await Network.getStatus();

    if (!status.connected) {
      // Si no hay conexión a Internet, muestra una alerta y redirige al inicio
      this.showNoInternetAlert();
      this.router.navigate(['/inicio']);
    }

    // Detecta el cambio de estado de la conexión
    Network.addListener('networkStatusChange', (status) => {
      if (!status.connected) {
        console.log('Sin conexión a Internet');
        this.showNoInternetAlert();
        this.router.navigate(['/inicio']);
      } else {
        console.log('Conexión a Internet disponible');
        // Aquí puedes liberar la navegación o tomar alguna acción
      }
    });
  }

  // Función para mostrar la alerta cuando no haya Internet
  async showNoInternetAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Sin Conexión',
      message: 'No tienes conexión a Internet. Revisa tu conexión y vuelve a intentarlo.',
      buttons: ['OK']
    });

    await alert.present();
  }

  // Función para cerrar sesión
  async logout() {
    // Llamar a eliminarSesion() del servicio SQLite para eliminar la sesión almacenada
    await this.sqliteService.eliminarSesion();

    // Limpiar datos adicionales si es necesario (localStorage, sessionStorage, etc.)
    localStorage.clear(); // O sessionStorage.clear() si usas sessionStorage

    // Cierra el menú si está abierto
    this.menuCtrl.close();

    // Redirige al usuario a la página de inicio de sesión
    this.router.navigate(['/inicio']);
  }
}
