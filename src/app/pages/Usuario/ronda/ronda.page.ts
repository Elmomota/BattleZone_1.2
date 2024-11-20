import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { MenuController, NavController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ronda',
  templateUrl: './ronda.page.html',
  styleUrls: ['./ronda.page.scss'],
})
export class RondaPage implements OnInit {
  usuario: any = {};
  torneo: any = {}; // Para almacenar el torneo actual
  duelos: any[] = [];  // Lista para almacenar los duelos
  rondaActual: string = '';  // Para almacenar la ronda actual
  oponente: any = {};  // Para almacenar los datos del oponente
  
  constructor(
    private SqliteService: SqliteService,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

  async obtenerDatosUsuario() {
    try {
      this.usuario = await this.SqliteService.obtenerSesion(); // Obtener sesión activa
      if (this.usuario) {
        console.log('Datos del usuario:', this.usuario);
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

  async obtenerTorneosInscritos(userId: number) {
    try {
      const torneos = await this.SqliteService.obtenerTorneosInscritos(userId);
      if (torneos.length > 0) {
        // Suponemos que el primer torneo es el que interesa
        this.torneo = torneos[0];
        this.obtenerDuelosDelUsuario(this.torneo.id_torneo, userId);
      }
    } catch (error) {
      console.error('Error obteniendo los torneos inscritos o duelos', error);
    }
  }

  async obtenerDuelosDelUsuario(idTorneo: number, idUsuario: number) {
    try {
      const duelos = await this.SqliteService.obtenerDuelosDelUsuario(idTorneo, idUsuario);
      if (duelos.length > 0) {
        // Obtener el duelo actual (supuesto)
        const dueloActual = duelos[0];
        this.rondaActual = `Ronda ${dueloActual.ronda}`;  // O el formato que necesites
        this.oponente = dueloActual.id_jugador1 === idUsuario ? dueloActual.id_jugador2 : dueloActual.id_jugador1;
      }
    } catch (error) {
      console.error('Error obteniendo los duelos del usuario', error);
    }
  }

  irAtras() {
    this.router.navigate(['/progreso']);
  }
}
