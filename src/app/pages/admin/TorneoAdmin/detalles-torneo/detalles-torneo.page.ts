import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service'; // Servicio SQLite
import { TorneoService } from 'src/app/services/torneo-service.service'; // Servicio de notificaciones
import { Duelo } from 'src/app/services/duelo'; // Clase Duelo
import { Torneo } from 'src/app/services/torneo'; // Clase Torneo
import { Usuario } from 'src/app/services/usuario';
@Component({
  selector: 'app-detalles-torneo',
  templateUrl: './detalles-torneo.page.html',
  styleUrls: ['./detalles-torneo.page.scss'],
})
export class DetallesTorneoPage implements OnInit {
  torneo?: Torneo;  // Ahora usamos la clase Torneo
  usuarios: Usuario[] = []; // Cambiado para usar Usuario en lugar de string[]
  rondas: Duelo[][] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private sqliteService: SqliteService,
    private torneoService: TorneoService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['torneo']) {
        try {
          this.torneo = JSON.parse(params['torneo']);
          if (this.torneo && this.torneo.id) {
            this.cargarUsuariosInscritos(this.torneo.id);
          }
        } catch (error) {
          console.error('Error al parsear el torneo:', error);
          this.router.navigate(['/cuenta-admin']);
        }
      }
    });
  }

  async cargarUsuariosInscritos(id_torneo: number) {
    try {
      this.usuarios = await this.sqliteService.obtenerUsuariosInscritos(id_torneo);
    } catch (error) {
      console.error('Error al cargar usuarios inscritos:', error);
    }
  }
  

  async generarDuelos(torneoId: number, usuarios: Usuario[], numRondas: number) {
    try {
      let participantes = usuarios.map(usuario => usuario.pnombre + ' ' + usuario.papellido); // Extrae nombre y apellido
      this.rondas = [];
      console.log('Participantes:', participantes); // Verifica los participantes
      for (let ronda = 1; ronda <= numRondas; ronda++) {
        const duelos: Duelo[] = [];
        for (let i = 0; i < participantes.length; i += 2) {
          const jugador1 = participantes[i];
          const jugador2 = participantes[i + 1] || null;
          duelos.push({
            id_torneo: torneoId,
            ronda,
            jugador1,
            jugador2,
            estado_jugador1: 'pendiente',
            estado_jugador2: jugador2 ? 'pendiente' : 'ganó',
            ganador: null,
          });
        }
        this.rondas.push(duelos);
        participantes = duelos.map((duelo) => duelo.ganador || duelo.jugador1);
      }
      console.log('Rondas generadas:', this.rondas); // Verifica la organización de los duelos
      await this.sqliteService.insertarDuelo(this.rondas.reduce((acc, ronda) => acc.concat(ronda), []));
    } catch (error) {
      console.error('Error al generar los duelos:', error);
    }
  }
  

  async seleccionarDuelo(duelo: Duelo) {
    const alert = await this.alertController.create({
      header: 'Actualizar Duelo',
      message: `Selecciona el resultado para el duelo: ${duelo.jugador1} vs ${duelo.jugador2 || 'BYE'}`,
      inputs: [
        { type: 'radio', label: duelo.jugador1, value: 'jugador1' },
        { type: 'radio', label: duelo.jugador2 || 'BYE', value: 'jugador2' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (ganador) => {
            duelo.estado_jugador1 = ganador === 'jugador1' ? 'ganó' : 'perdió';
            duelo.estado_jugador2 = ganador === 'jugador2' ? 'ganó' : 'perdió';
            duelo.ganador = ganador === 'jugador1' ? duelo.jugador1 : duelo.jugador2;
            await this.sqliteService.actualizarDuelo(duelo);
            await this.actualizarDuelos();
          },
        },
      ],
    });

    await alert.present();
  }

  async actualizarDuelos() {
    if (this.torneo) {
      try {
        const duelos = await this.sqliteService.obtenerDuelosPorTorneo(this.torneo.id);
        this.rondas = [];
        for (let ronda = 1; ronda <= this.torneo.rondas; ronda++) {
          this.rondas.push(duelos.filter((duelo) => duelo.ronda === ronda));
        }
      } catch (error) {
        console.error('Error al actualizar duelos:', error);
      }
    }
  }

  modificarTorneo() {
    if (this.torneo && this.torneo.id) {
      this.router.navigate(['/modificar-torneo'], {
        queryParams: { torneo: JSON.stringify(this.torneo) },
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
                await this.sqliteService.eliminarInscripcionesPorTorneo(this.torneo.id);
                await this.sqliteService.eliminarTorneo(this.torneo.id);
                this.torneoService.notificarTorneoEliminado();
                const successAlert = await this.alertController.create({
                  header: 'Éxito',
                  message: 'El torneo ha sido eliminado con éxito.',
                  buttons: ['OK'],
                });
                await successAlert.present();
                this.router.navigate(['/cuenta-admin']);
              } catch (error) {
                console.error('Error al eliminar el torneo:', error);
                const errorAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'Hubo un error al eliminar el torneo. Inténtalo de nuevo.',
                  buttons: ['OK'],
                });
                await errorAlert.present();
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
