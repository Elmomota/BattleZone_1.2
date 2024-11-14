import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';  // Asegúrate de que esté correctamente importado
import { MenuController, NavController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {

  usuario: any = {};
  torneosJugados: any[] = [];
  seleccion: string = 'Torneos jugados';  // Valor por defecto del segmento
  menuVisible: boolean = false;

  constructor(private SqliteService: SqliteService,private navCtrl: NavController,private cdr: ChangeDetectorRef, private router:Router,private menuCtrl: MenuController) {}

  ngOnInit() {
    this.obtenerDatosUsuario();
  }
  toggleMenu() {
    this.menuVisible = !this.menuVisible; // Cambia el estado de visibilidad
  }
  toggleMenuController() {
    this.menuVisible ? this.menuCtrl.enable(true) : this.menuCtrl.enable(false);
  }

  async obtenerDatosUsuario() {
    try {
      this.usuario = await this.SqliteService.obtenerSesion(); // Obtener sesión activa
      if (this.usuario) {
        console.log('Datos del usuario:', this.usuario);
        // Asegúrate de que el usuario tenga un ID
        if (this.usuario.id) {
          this.obtenerTorneosInscritos(this.usuario.id); // Obtener torneos inscritos del usuario
        } else {
          console.error('El usuario no tiene un ID válido.');
        }
      } else {
        console.error('No se encontró una sesión activa.');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  }
  

  obtenerTorneosInscritos(userId: number) {
    this.SqliteService.obtenerTorneosInscritos(userId).then(torneos => {
      this.torneosJugados = torneos;
      
    }).catch(err => {
      console.error('Error obteniendo los torneos inscritos', err);
    });
  }
  

  home() {
    // Redirigir a la página principal
  }


/////////////////////////////////funcion para retroceder
  


irAtras() {
  this.router.navigate(['/home']);
}



  ediPerfil() {
    this.router.navigate(['/edicion-perfil']);
  }
///////////////////////////////////////////////////////////////////


  onSegmentChange(event: any) {
    this.seleccion = event.detail.value;
    this.cdr.detectChanges();  // Forzar la actualización de la vista
  }


  cambiarContra(){

    this.router.navigate(['/cambiar-contra']);

  }
}