import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { TorneoService } from 'src/app/services/torneo-service.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Torneo } from 'src/app/services/torneo';

@Component({
  selector: 'app-nuevo-torneo',
  templateUrl: './nuevo-torneo.page.html',
  styleUrls: ['./nuevo-torneo.page.scss'],
})
export class NuevoTorneoPage implements OnInit {
  nuevoTorneo: Torneo = new Torneo(); // Usamos la clase `Torneo`
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
    // Validación del nombre del torneo
    if (this.nuevoTorneo.nombre.trim().length < 3) {
      const alert = await this.alertController.create({
        header: 'Error de validación',
        message: 'El nombre del torneo debe tener al menos 3 caracteres.',
        buttons: ['OK']
      });
      await alert.present();
      return; // Salir del método si hay un error
    }
  
    // Validación de la fecha de inicio
    const fechaSeleccionada = new Date(this.nuevoTorneo.fechaInicio);
    const fechaActual = new Date();
    
    if (fechaSeleccionada < fechaActual) {
      this.nuevoTorneo.estado = 'Finalizado'; // Cambia el estado a 'Finalizado'
    }
  
    // Verificación del número de equipos
    if (this.nuevoTorneo.numEquipos < 2 || this.nuevoTorneo.numEquipos > 20) {
      const alert = await this.alertController.create({
        header: 'Error de validación',
        message: 'El número de equipos debe estar entre 2 y 20.',
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
              // Simulación: Obtén el adminId actual
              const adminId = await this.obtenerAdminIdActual();
  
              // Verificación antes de crear
              console.log('Nuevo torneo:', this.nuevoTorneo);
  
              // Llama al servicio para crear el nuevo torneo, pasando el torneo y el adminId
              await this.sqliteService.addTorneo(this.nuevoTorneo, adminId); // Agrega `adminId` aquí
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
  
  
  // Método para obtener el adminId actual
  async obtenerAdminIdActual(): Promise<number> {
    try {
      const session = await this.sqliteService.obtenerSesion(); // Llama al método de sesión
      return session && session.adminId ? session.adminId : 1; // Retorna el adminId o un valor por defecto si no existe
    } catch (error) {
      console.error('Error al obtener adminId de la sesión:', error);
      return 0;
    }
  }
  

  admin_c() {
    this.router.navigate(['/cuenta-admin']);
  }
}
