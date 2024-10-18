import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Torneo } from 'src/app/services/torneo'; // Importa la interfaz de Torneo

@Component({
  selector: 'app-detalle-inscripcion',
  templateUrl: './detalle-inscripcion.page.html',
  styleUrls: ['./detalle-inscripcion.page.scss'],
})
export class DetalleInscripcionPage implements OnInit {

  torneo?: Torneo; // Variable para almacenar los datos del torneo

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    // Recuperar los parámetros de consulta para obtener el torneo
    this.route.queryParams.subscribe(params => {
      if (params && params['torneo']) {
        try {
          this.torneo = JSON.parse(params['torneo']); // Parsear el torneo desde los parámetros
        } catch (error) {
          console.error('Error al parsear el torneo:', error);
        }
      }
    });
  }

  // Método para confirmar inscripción
  confirmarInscripcion() {
    // Aquí puedes agregar la lógica para inscribir al usuario en el torneo
    console.log('Inscripción confirmada para el torneo:', this.torneo);
  }

  // Método para regresar a la página anterior
  regresar() {
    this.navCtrl.navigateBack('/detalle-juego');
  }

}
