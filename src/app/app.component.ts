import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service'; // Servicio SQLite
import { Network } from '@capacitor/network'; // Plugin Network

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
  private rolUsuario: number | null = null; // Rol actual del usuario

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private sqliteService: SqliteService, // Servicio SQLite
    private alertCtrl: AlertController // AlertController para mostrar mensajes
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios de sesión
    this.sqliteService.usuarioSesion$.subscribe((usuario) => {
      if (usuario) {
        this.rolUsuario = usuario.rol; // Actualiza el rol del usuario
        this.updateMenu(); // Actualiza las opciones del menú
      } else {
        this.rolUsuario = null; // Limpia el rol
        this.appPages = []; // Limpia las opciones del menú
        this.router.navigate(['/inicio']); // Redirige al login
      }
    });

    this.checkSession(); // Verifica la sesión inicial
    this.checkNetworkStatus(); // Monitorea el estado de la red
  }

  // Verifica la sesión almacenada al iniciar
  async checkSession() {
    try {
      const session = await this.sqliteService.obtenerSesion(); // Recupera la sesión
      if (session) {
        this.sqliteService.usuarioSesionSubject.next(session); // Emite la sesión actual
      } else {
        this.router.navigate(['/inicio']); // Redirige al login si no hay sesión
      }
    } catch (error) {
      console.error('Error al obtener la sesión:', error);
      this.router.navigate(['/inicio']); // Redirige al login si ocurre un error
    }
  }

  // Actualiza el menú según el rol del usuario
  updateMenu() {
    if (this.rolUsuario === 1) {
      // Menú para administrador
      this.appPages = [
        { title: 'Cuenta Admin', url: '/cuenta-admin', icon: 'person' },
        { title: 'Mi Perfil', url: '/cuenta', icon: 'person' },
      ];
    } else if (this.rolUsuario === 2) {
      // Menú para cliente
      this.appPages = [
        { title: 'Home', url: '/home', icon: 'home' },
        { title: 'Torneos', url: '/torneos', icon: 'trophy' },
        { title: 'Mi Perfil', url: '/cuenta', icon: 'person' },
        { title: 'Mis Torneos', url: '/progreso', icon: 'trophy' },
      ];
    }
  }

  // Verifica el estado de la conexión a Internet
  async checkNetworkStatus() {
    const status = await Network.getStatus();

    if (!status.connected) {
      this.showNoInternetAlert(); // Muestra alerta si no hay conexión
      this.router.navigate(['/inicio']);
    }

    // Escucha cambios en la conexión
    Network.addListener('networkStatusChange', (status) => {
      if (!status.connected) {
        console.log('Sin conexión a Internet');
        this.showNoInternetAlert();
        this.router.navigate(['/inicio']);
      } else {
        console.log('Conexión a Internet disponible');
      }
    });
  }

  // Muestra una alerta cuando no hay conexión a Internet
  async showNoInternetAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Sin Conexión',
      message: 'No tienes conexión a Internet. Revisa tu conexión y vuelve a intentarlo.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Cierra sesión y elimina la sesión almacenada
  async logout() {
    await this.sqliteService.eliminarSesion(); // Elimina la sesión de SQLite
    this.rolUsuario = null; // Limpia el rol
    this.appPages = []; // Limpia las opciones del menú
    await this.menuCtrl.close(); // Cierra el menú
    this.router.navigate(['/inicio']); // Redirige al login
  }
}
