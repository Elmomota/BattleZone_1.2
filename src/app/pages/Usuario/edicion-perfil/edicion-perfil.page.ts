import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Usuario } from 'src/app/services/usuario';

@Component({
  selector: 'app-edicion-perfil',
  templateUrl: './edicion-perfil.page.html',
  styleUrls: ['./edicion-perfil.page.scss'],
})
export class EdicionPerfilPage implements OnInit {
  usuario: Usuario = new Usuario();
  previewImage: string | null = null;

  constructor(
    private sqliteService: SqliteService,
    private alertController: AlertController,
    private navController: NavController
  ) {}

  async ngOnInit() {
    try {
      const usuarioSesion = await this.sqliteService.obtenerSesion();
      if (usuarioSesion) {
        this.usuario = usuarioSesion;
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se encontró un usuario activo.',
          buttons: ['OK'],
        });
        await alert.present();
        this.navController.navigateBack('/login');
      }
    } catch (error) {
      console.error('Error al obtener la sesión:', error);
    }
  }

  async guardarCambios() {
    try {
      await this.sqliteService.actualizarSesion(this.usuario);
      const alert = await this.alertController.create({
        header: 'Perfil Actualizado',
        message: 'Los cambios se guardaron correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
      this.navController.navigateBack('/cuenta');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudieron guardar los cambios. Inténtalo de nuevo.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.previewImage = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click(); // Activa el input de archivo
  }
}
