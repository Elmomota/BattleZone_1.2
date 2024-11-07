import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular'; // Importa Storage para manejar la sesión

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private storage: Storage // Inyecta el servicio de almacenamiento
  ) {
    this.storage.create(); // Inicializa Ionic Storage
  }

  async ngOnInit() {
    this.menuCtrl.enable(false); 

    // Comprueba si hay una sesión activa
    const usuario = await this.storage.get('usuario'); // Recupera los datos del usuario
    if (usuario) {
      console.log('Sesión activa:', usuario);
      this.router.navigate(['/home']); // Redirige a la página de inicio
    } else {
      console.log('No hay sesión activa');
      // Si no hay sesión activa, puedes permanecer en esta página o redirigir a otra página
    }
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true); 
  }

  inicio() {
    this.router.navigate(['/registro']);
  }

  adminLogin() {
    this.router.navigate(['/iniciar-sesion']);
  }
}
