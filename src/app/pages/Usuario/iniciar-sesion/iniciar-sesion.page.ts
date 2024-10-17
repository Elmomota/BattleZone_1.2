import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage {
  correo: string = '';
  contrasena: string = '';

  constructor(private sqliteService: SqliteService , private router: Router, private navCtrl: NavController) {}

  loginUsuario() {
    this.sqliteService.loginUsuario(this.correo, this.contrasena).then(usuario => {
      if (usuario) {
        this.navCtrl.navigateForward(`/home`, {
          queryParams: {
            usuario: JSON.stringify(usuario) // Pasar los detalles del usuario al home
          }
        });
      } else {
        // Manejar error
      }
    });
  }
  
  


}

