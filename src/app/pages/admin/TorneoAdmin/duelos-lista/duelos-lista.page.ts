import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service'; // Importar el servicio
import { Torneo } from 'src/app/services/torneo'; // Importa la interfaz Torneo


interface Juego {
  id: number; 
  nombre: string;
  tipo: string;
  descripcion: string;
  logo: string;
  cabecera: string;
}
@Component({
  selector: 'app-duelos-lista',
  templateUrl: './duelos-lista.page.html',
  styleUrls: ['./duelos-lista.page.scss'],
})








export class DuelosListaPage implements OnInit {
  usuario: any = {};

  juego?: Juego;
  torneos: Torneo[] = []; // Lista de torneos asociados al juego  usuario: any = {};
  torneosJugados: any[] = [];
  seleccion: string = 'Torneos jugados';  // Valor por defecto del segmento
  menuVisible: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private sqliteService: SqliteService, // Aquí se inyecta el servicio
    private navCtrl: NavController
  ) {}

  ngOnInit() {

    

    this.obtenerDatosUsuario();

  }

  async obtenerDatosUsuario() {
    
    try {
      this.usuario = await this.sqliteService.obtenerSesion(); // Obtener sesión activa
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
    this.sqliteService.obtenerTorneosInscritos(userId).then(torneos => {
      this.torneos = torneos;
      
    }).catch(err => {
      console.error('Error obteniendo los torneos inscritos', err);
    });
  }





// En la página de listado de torneos (detalle-juego.page.ts)
irADetalleInscripcion(torneo: Torneo) {
  this.navCtrl.navigateForward('/ronda', {
    queryParams: { torneo: JSON.stringify(torneo) }  // Pasar los datos del torneo
  });
}




  home(){
    this.router.navigate(['/home']);
  }
  
  verDetallesTorneo(){

    
  }

  
}
