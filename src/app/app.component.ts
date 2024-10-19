import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service'; // Importa tu servicio SQLite

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Torneos', url: '/torneos', icon: 'trophy' },
    { title: 'Mi Perfil', url: '/cuenta', icon: 'person' },
  ];
  
  constructor(
    private router: Router, 
    private menuCtrl: MenuController, 
    private sqliteService: SqliteService // Inyecta el servicio SQLite
  ) {}

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
