import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Torneo } from 'src/app/services/torneo';
import { Juego } from 'src/app/services/juego';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-torneos',
  templateUrl: './torneos.page.html',
  styleUrls: ['./torneos.page.scss'],
})
export class TorneosPage implements OnInit {
  torneos: Torneo[] = []; // Lista completa de torneos
  juegos: Juego[] = []; // Lista de juegos disponibles
  torneosFiltrados: Torneo[] = []; // Lista de torneos después de aplicar filtros
  loading: boolean = true;

  nombreFiltro: string = ''; // Filtro de nombre
  juegoFiltro: string = ''; // Filtro de juego

  constructor(private sqliteService: SqliteService, private router: Router,private navCtrl: NavController) {}

  ngOnInit() {
    // Obtener la lista de torneos y juegos desde la base de datos
    this.sqliteService.fetchTorneos().subscribe(torneos => {
      this.torneos = torneos;
      this.torneosFiltrados = torneos; // Inicialmente, mostrar todos los torneos
      this.loading = false; // Cambia el estado de carga
    });

    this.sqliteService.fetchJuegos().subscribe(juegos => {
      this.juegos = juegos; // Cargar juegos disponibles para el filtro
    });
  }

  // Función para aplicar filtros
  filtrarTorneos() {
    this.torneosFiltrados = this.torneos.filter(torneo => {
      const coincideNombre = this.nombreFiltro
        ? torneo.nombre.toLowerCase().includes(this.nombreFiltro.toLowerCase())
        : true;

      const coincideJuego = this.juegoFiltro
        ? torneo.juego.toLowerCase() === this.juegoFiltro.toLowerCase()
        : true;

      return coincideNombre && coincideJuego;
    });
  }

  seleccionarTorneo(torneo: Torneo) {
    this.router.navigate(['/detalle-inscripcion'], {
      queryParams: { torneo: JSON.stringify(torneo) }
    });
  }

  ircuenta() {
    this.router.navigate(['/cuenta']);
  }

  // Función para limpiar filtros
  limpiarFiltros() {
    this.nombreFiltro = '';
    this.juegoFiltro = '';
    this.torneosFiltrados = this.torneos; // Mostrar todos los torneos
  }

  irAtras() {
    this.navCtrl.back();
  }


}
