import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { TorneoService } from 'src/app/services/torneo-service.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface Torneo {
  id: number;
  nombre: string;
  juego: string;
  estado: string;
  numEquipos: number;
  fechaInicio: string;
  imagen: string;
}

@Component({
  selector: 'app-modificar-torneo',
  templateUrl: './modificar-torneo.page.html',
  styleUrls: ['./modificar-torneo.page.scss'],
})
export class ModificarTorneoPage implements OnInit {
  nuevoTorneo: any = {};
  torneo?: Torneo;
  selectedFile?: File;
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
          this.torneo = JSON.parse(params['torneo']);
          console.log('Torneo recibido:', this.torneo);
  
          // Asignar la imagen para la vista previa
          this.previewImage = this.torneo?.imagen;
  
          // Si es necesario, aquí puedes inicializar "nuevoTorneo" con los valores de "torneo"
          this.nuevoTorneo = { ...this.torneo }; 
  
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
      source: CameraSource.Photos // Esto abre la galería del móvil
    });

    if (image && image.dataUrl) {
      this.previewImage = image.dataUrl; // Vista previa de la imagen
      if (this.torneo) {
        this.torneo.imagen = image.dataUrl; // Asigna la imagen al torneo
      }
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
            if (this.torneo) {
              try {
                // Verificación antes de actualizar
                console.log('Torneo antes de guardar:', this.torneo);
  
                // Llama al servicio para actualizar el torneo
                await this.sqliteService.actualizarTorneo(this.torneo);
                this.torneoService.notificarTorneoActualizado();
  
                // Mensaje de éxito y redirección
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
        }
      ]
    });
  
    await alert.present();
  }
  
}
