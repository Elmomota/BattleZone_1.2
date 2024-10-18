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
      this.torneos = torneos.filter(torneo => torneo.juego === nombreJuego); // Filtrar torneos por nombre de juego
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




  home(){
    this.router.navigate(['/home']);
  }
  
  verDetallesTorneo(){

    
  }

  
}



