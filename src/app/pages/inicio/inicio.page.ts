import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
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
    private storage: Storage, // Inyecta el servicio de almacenamiento
    private navCtrl: NavController
  ) {
    this.storage.create(); // Inicializa Ionic Storage
  }

  async ngOnInit() {
    this.menuCtrl.enable(false); 

    // Comprueba si hay una sesión activa
    const usuario = await this.storage.get('usuario'); // Recupera los datos del usuario
    if (usuario.rol === 1) {
      this.navCtrl.navigateForward(`/cuenta-admin`, {
        queryParams: { usuario: JSON.stringify(usuario) }
      });
    } else if (usuario.rol === 2) {
      this.navCtrl.navigateForward(`/home`, {
        queryParams: { usuario: JSON.stringify(usuario) }
      });
    }
    
    
    else {
      console.log('No hay sesión activa');
      // Si no hay sesión activa, puedes permanecer en esta página o redirigir a otra página
    }
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true); 
  }

  inicio() {
    this.router.navigate(['/iniciar-sesion']);
  }

  adminLogin() {
    this.router.navigate(['/iniciar-sesion']);
  }
}
