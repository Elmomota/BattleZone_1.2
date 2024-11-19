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
