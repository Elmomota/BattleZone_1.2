import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service'; // Importa tu servicio SQLite

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
    private sqliteService: SqliteService // Inyecta el servicio SQLite
  ) {}

  ngOnInit() {
    this.checkSession(); // Verifica la sesión al iniciar la aplicación
  }

  // Función para verificar la sesión
  async checkSession() {
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
