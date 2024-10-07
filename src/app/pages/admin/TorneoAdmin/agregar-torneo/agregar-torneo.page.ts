import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SqliteService } from 'src/app/services/sqlite.service';

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
  selector: 'app-agregar-torneo',
  templateUrl: './agregar-torneo.page.html',
  styleUrls: ['./agregar-torneo.page.scss'],
})
export class AgregarTorneoPage {
  nuevoTorneo: Torneo = {
    nombre: '',
    juego: '',
    estado: 'Próximo',
    numEquipos: 0,
    fechaInicio: new Date().toISOString(),
    imagen: ''
  };

  constructor(private sqliteService: SqliteService, private navCtrl: NavController) {}

  async onFileSelected() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos // Esto abre la galería del móvil
    });

    if (image && image.dataUrl) {
      this.nuevoTorneo.imagen = image.dataUrl;
    }
  }

  async agregarTorneo() {
    if (!this.nuevoTorneo.nombre || !this.nuevoTorneo.juego || this.nuevoTorneo.numEquipos <= 0) {
      console.warn('Debes completar todos los campos obligatorios');
      return;
    }
  
    try {
      await this.sqliteService.addTorneo(this.nuevoTorneo);
      this.navCtrl.navigateBack('/cuenta-admin'); // Redirige al admin tras agregar el torneo
    } catch (error) {
      console.error('Error al agregar el torneo:', error);
      // Puedes mostrar un mensaje de error al usuario aquí
    }
  }
}
