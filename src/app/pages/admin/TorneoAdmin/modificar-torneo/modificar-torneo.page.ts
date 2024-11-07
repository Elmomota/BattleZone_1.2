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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private sqliteService: SqliteService,
    private torneoService: TorneoService
  ) {}

  ngOnInit() {
    // Cargar el torneo de los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      if (params && params['torneo']) {
        try {
          this.torneo = JSON.parse(params['torneo']); // Inicializar la instancia con los datos
          console.log('Torneo recibido:', this.torneo);

          // Asignar la imagen para la vista previa
          this.previewImage = this.torneo.imagen;
        } catch (error) {
          console.error('Error al parsear el torneo:', error);
          this.router.navigate(['/cuenta-admin']);
        }
      }
    });
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
