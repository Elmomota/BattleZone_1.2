import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { TorneoService } from 'src/app/services/torneo-service.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Torneo } from 'src/app/services/torneo';

@Component({
  selector: 'app-modificar-torneo',
  templateUrl: './modificar-torneo.page.html',
  styleUrls: ['./modificar-torneo.page.scss'],
})
export class ModificarTorneoPage implements OnInit {
  torneo: Torneo = new Torneo(); // Instancia de Torneo
  previewImage?: string;
  inscritos: any[] = []; // Lista de usuarios inscritos

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private sqliteService: SqliteService,
    private torneoService: TorneoService
  ) {}

  ngOnInit() {
    // Cargar el torneo de los parámetros de la URL
    this.route.queryParams.subscribe(async (params) => {
      if (params && params['torneo']) {
        try {
          this.torneo = JSON.parse(params['torneo']);
          console.log('Torneo recibido:', this.torneo);
          this.previewImage = this.torneo.imagen;

          // Cargar usuarios inscritos y verificar la cantidad de equipos
          this.inscritos = await this.obtenerUsuariosInscritos(this.torneo.id!);
          this.validarEquipos();
        } catch (error) {
          console.error('Error al parsear el torneo:', error);
          this.router.navigate(['/cuenta-admin']);
        }
      }
    });
  }

  async obtenerUsuariosInscritos(idTorneo: number): Promise<any[]> {
    return await this.sqliteService.obtenerUsuariosInscritos(idTorneo);
  }

  validarEquipos(): boolean {
    const numeroEquipos = this.inscritos.length;

    if (numeroEquipos < 6 || numeroEquipos > 30 || numeroEquipos % 2 !== 0) {
      this.alertController.create({
        header: 'Error en la cantidad de equipos',
        message: 'El número de equipos debe ser par, y estar entre 6 y 30 participantes.',
        buttons: ['OK']
      }).then(alert => alert.present());
      return false;
    }

    if (this.torneo.numEquipos! < numeroEquipos) {
      this.alertController.create({
        header: 'Cantidad de equipos insuficiente',
        message: `El número de equipos no puede ser menor a los participantes inscritos (${numeroEquipos}).`,
        buttons: ['OK']
      }).then(alert => alert.present());
      return false;
    }

    return true;
  }

  async onFileSelected() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });

    if (image && image.dataUrl) {
      this.previewImage = image.dataUrl; // Vista previa de la imagen
      this.torneo.imagen = image.dataUrl; // Asigna la imagen al torneo
    }
  }

  async guardarCambios() {
    // Validar equipos antes de guardar
    if (!this.validarEquipos()) return;

    const alert = await this.alertController.create({
      header: 'Confirmar Cambios',
      message: '¿Estás seguro de que deseas guardar los cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: async () => {
            try {
              console.log('Torneo antes de guardar:', this.torneo);
              await this.sqliteService.actualizarTorneo(this.torneo);
              this.torneoService.notificarTorneoActualizado();
              console.log('Cambios guardados correctamente');
              await this.router.navigate(['/cuenta-admin']);
            } catch (error) {
              console.error('Error al guardar los cambios:', error);
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo guardar los cambios. Intenta nuevamente.',
                buttons: ['OK'],
              });
              await errorAlert.present();
            }
          }
        }
      ]
    });

    await alert.present();
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
            try {
              console.log('Torneo a eliminar:', this.torneo);
              await this.sqliteService.eliminarTorneo(this.torneo.id!);
              this.torneoService.notificarTorneoEliminado();
              console.log('Torneo eliminado correctamente');
              await this.router.navigate(['/cuenta-admin']);
            } catch (error) {
              console.error('Error al eliminar el torneo:', error);
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo eliminar el torneo. Intenta nuevamente.',
                buttons: ['OK'],
              });
              await errorAlert.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
