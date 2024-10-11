import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { TorneoService } from 'src/app/services/torneo-service.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface Torneo {
  id?: number;
  nombre: string;
  juego: string;
  estado: string;
  numEquipos: number;
  fechaInicio: string;
  imagen: string;
}

@Component({
  selector: 'app-nuevo-torneo',
  templateUrl: './nuevo-torneo.page.html',
  styleUrls: ['./nuevo-torneo.page.scss'],
})
export class NuevoTorneoPage implements OnInit {
  nuevoTorneo: Torneo = {
    nombre: '',
    juego: '',
    estado: '',
    numEquipos: 0,
    fechaInicio: '',
    imagen: ''
  };
  previewImage?: string;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private sqliteService: SqliteService,
    private torneoService: TorneoService
  ) {}

  ngOnInit() {}

  async onFileSelected() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos // Esto abre la galería del móvil
    });

    if (image && image.dataUrl) {
      this.previewImage = image.dataUrl; // Vista previa de la imagen
      this.nuevoTorneo.imagen = image.dataUrl; // Asigna la imagen al nuevo torneo
    }
  }

  async guardarTorneo() {
    // Verificación del número de equipos
    if (this.nuevoTorneo.numEquipos < 0 || this.nuevoTorneo.numEquipos > 20) {
      const alert = await this.alertController.create({
        header: 'Error de validación',
        message: 'El número de equipos debe estar entre 0 y 20.',
        buttons: ['OK']
      });
      await alert.present();
      return; // Salir del método si hay un error
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Creación',
      message: '¿Estás seguro de que deseas crear este torneo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Crear',
          handler: async () => {
            try {
              // Simulación: Obtén el adminId actual (aquí puedes implementar una lógica para obtener el adminId real)
              const adminId = await this.obtenerAdminIdActual();

              // Verificación antes de crear
              console.log('Nuevo torneo:', this.nuevoTorneo);

              // Llama al servicio para crear el nuevo torneo, pasando el torneo y el adminId
              await this.sqliteService.addTorneo(this.nuevoTorneo, adminId);
              this.torneoService.notificarTorneoAgregado();

              // Mensaje de éxito y redirección
              console.log('Torneo creado correctamente');
              await this.router.navigate(['/cuenta-admin']);
            } catch (error) {
              console.error('Error al crear el torneo:', error);
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo crear el torneo. Intenta nuevamente.',
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

  async obtenerAdminIdActual(): Promise<number> {
    // Aquí implementas la lógica para obtener el adminId, por ejemplo desde un servicio o del almacenamiento local
    // En este ejemplo simulo que el adminId es 1
    return 1; // Reemplaza esto con la lógica adecuada para obtener el adminId real
  }

  admin_c(){
    this.router.navigate(['/cuenta-admin']);
  }
} 