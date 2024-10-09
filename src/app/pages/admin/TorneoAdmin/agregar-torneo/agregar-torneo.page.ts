import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Storage } from '@ionic/storage-angular';  // Importar correctamente el módulo de almacenamiento

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

  adminId: number | null = null;

  constructor(
    private sqliteService: SqliteService, 
    private navCtrl: NavController, 
    private storage: Storage  // Inyectar el almacenamiento
  ) {}

  async ngOnInit() {
    await this.storage.create();  // Inicializar el almacenamiento
    this.adminId = await this.storage.get('adminId');  // Obtener el adminId
  }

  async onFileSelected() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
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

    if (this.adminId === null) {
      console.error('Admin ID no disponible');
      return;
    }

    try {
      await this.sqliteService.addTorneo(this.nuevoTorneo, this.adminId);
      this.navCtrl.navigateBack('/cuenta-admin');
    } catch (error) {
      console.error('Error al agregar el torneo:', error);
    }
  }
}