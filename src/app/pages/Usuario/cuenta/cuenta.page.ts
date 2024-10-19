import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';  // Asegúrate de que esté correctamente importado

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {

  user: any = {};
  torneosJugados: any[] = [];
  seleccion: string = 'Torneos jugados';  // Valor por defecto del segmento

  constructor(private SqliteService: SqliteService) {}

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario() {
    // Obtener los datos de la sesión
    this.SqliteService.obtenerSesion().then(sesion => {
      this.user = sesion.user;  // Aquí se almacenan los datos del usuario
      // Obtener los torneos inscritos según el ID del usuario
      this.obtenerTorneosInscritos(sesion.id);
    }).catch(err => {
      console.error('Error obteniendo la sesión activa', err);
    });
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
}

