import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service'; // Servicio SQLite
import { TorneoService } from 'src/app/services/torneo-service.service'; // Servicio de notificaciones de torneos
import { Duelo } from 'src/app/services/duelo';
import { Torneo } from 'src/app/services/torneo';

@Component({
  selector: 'app-detalles-torneo',
  templateUrl: './detalles-torneo.page.html',
  styleUrls: ['./detalles-torneo.page.scss'],
})
export class DetallesTorneoPage implements OnInit {
  segment: string = 'info';
  cambiarSegmento(event: any) {
    this.segment = event.detail.value; // Cambia el segmento según la selección
  }
  
  torneo: any; // Información del torneo
  usuarios: Array<{ id: number; nombre: string; apellido: string; nickname: string; correo: string }> = [];
  duelos: Duelo[] = []; // Lista de duelos creados
  
  nuevoDuelo = {
    id_torneo: null,
    ronda: 1,
    id_jugador1: 0,  // ID del jugador 1, debe ser un número
    id_jugador2: 0,  // ID del jugador 2, debe ser un número
    estado_jugador1: 'Pendiente',
    estado_jugador2: 'Pendiente',
    ganador: null,
  };
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private sqliteService: SqliteService, // Servicio SQLite
    private torneoService: TorneoService // Servicio de notificaciones
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['torneo']) {
        try {
          this.torneo = Object.assign(new Torneo(), JSON.parse(params['torneo']));
          if (this.torneo && this.torneo.id) {
            this.cargarUsuariosInscritos(this.torneo.id);
            this.cargarDuelos(this.torneo.id); // Cargar duelos del torneo
          }
        } catch (error) {
          console.error('Error al parsear el torneo:', error);
          this.router.navigate(['/cuenta-admin']);
        }
      }
    });
  }

  async cargarDuelos(id_torneo: number) {
    try {
      const duelos = await this.sqliteService.obtenerDuelosPorTorneo(id_torneo);
      this.duelos = duelos;
    } catch (error) {
      console.error('Error al cargar los duelos:', error);
    }
  }

  getDuelosPorRonda() {
    return this.duelos.reduce((rondas, duelo) => {
      if (!rondas[duelo.ronda]) {
        rondas[duelo.ronda] = [];
      }
      rondas[duelo.ronda].push(duelo);
      return rondas;
    }, {} as Record<number, Duelo[]>);
  }

  async cargarUsuariosInscritos(id_torneo: number) {
    try {
      this.usuarios = await this.sqliteService.obtenerUsuariosInscritos(id_torneo);
    } catch (error) {
      console.error('Error al cargar usuarios inscritos:', error);
    }
  }

  modificarTorneo() {
    if (this.torneo && this.torneo.id) {
      this.router.navigate(['/modificar-torneo'], {
        queryParams: {
          torneo: JSON.stringify(this.torneo) // Pasa el objeto del torneo
        }
      });
    } else {
      console.warn('No se puede modificar, torneo no válido');
    }
  }

  async eliminarTorneo() {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este torneo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            if (this.torneo) {
              try {
                await this.sqliteService.eliminarInscripcionesPorTorneo(this.torneo.id!);
                await this.sqliteService.eliminarTorneo(this.torneo.id!);
                this.torneoService.notificarTorneoEliminado();
                const successAlert = await this.alertController.create({
                  header: 'Éxito',
                  message: 'El torneo ha sido eliminado con éxito.',
                  buttons: ['OK']
                });
                await successAlert.present();
                this.router.navigate(['/cuenta-admin']);
              } catch (error) {
                console.error('Error al eliminar el torneo:', error);
                const errorAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'Hubo un error al eliminar el torneo. Inténtalo de nuevo.',
                  buttons: ['OK']
                });
                await errorAlert.present();
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async guardarDuelo() {
    if (!this.nuevoDuelo.id_jugador1 || !this.nuevoDuelo.id_jugador2) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Selecciona ambos jugadores para el duelo.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.nuevoDuelo.id_jugador1 === this.nuevoDuelo.id_jugador2) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No puedes seleccionar el mismo jugador dos veces.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      const duelo: Duelo = { ...this.nuevoDuelo, id_torneo: this.torneo.id };
      await this.sqliteService.insertarDuelo(duelo);
      this.duelos.push(duelo);
      const successAlert = await this.alertController.create({
        header: 'Éxito',
        message: 'El duelo se ha guardado correctamente.',
        buttons: ['OK']
      });
      await successAlert.present();
      this.nuevoDuelo.id_jugador1 = 0;
      this.nuevoDuelo.id_jugador2 = 0;
    } catch (error) {
      console.error('Error al guardar el duelo:', error);
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al guardar el duelo. Inténtalo de nuevo.',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }
}
