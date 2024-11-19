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
  selector: 'app-detalle-juego',
  templateUrl: './detalle-juego.page.html',
  styleUrls: ['./detalle-juego.page.scss'],
})
export class DetalleJuegoPage implements OnInit {
  juego?: Juego;
  torneos: Torneo[] = []; // Lista de torneos asociados al juego
  usuario: any = {};
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

    

    this.route.queryParams.subscribe(params => {
      if (params && params['juego']) {
        try {
          this.juego = JSON.parse(params['juego']);
          if (this.juego) { // Asegurarse de que juego no sea undefined
            this.loadTorneos(this.juego.nombre); // Cargar torneos relacionados al juego
          }
        } catch (error) {
          console.error('Error al parsear el juego:', error);
          
        }
      }
    });
  }

  loadTorneos(nombreJuego: string) {
    this.sqliteService.fetchTorneos().subscribe(torneos => {
      this.torneos = torneos.filter(torneo => torneo.juegoNombre === nombreJuego); // Filtrar torneos por nombre de juego
    }, error => {
      console.error('Error al cargar torneos:', error);
    });
  }

// En la página de listado de torneos (detalle-juego.page.ts)
irADetalleInscripcion(torneo: Torneo) {
  this.navCtrl.navigateForward('/detalle-inscripcion', {
    queryParams: { torneo: JSON.stringify(torneo) }  // Pasar los datos del torneo
  });
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
    this.torneosJugados = torneos;
    
  }).catch(err => {
    console.error('Error obteniendo los torneos inscritos', err);
  });
}


  home(){
    this.router.navigate(['/home']);
  }
  
  verDetallesTorneo(){

    
  }

  
}



