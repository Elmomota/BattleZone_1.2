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

  // Nueva función para seleccionar una foto con validaciones
  seleccionarFoto(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const archivo = event.target.files[0];
      if (!archivo) {
        alert('No se seleccionó ninguna imagen.');
        return;
      }

      const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!tiposPermitidos.includes(archivo.type)) {
        alert('Solo se permiten imágenes en formato PNG o JPEG.');
        return;
      }

      if (archivo.size > 2 * 1024 * 1024) { // Máximo 2MB
        alert('La imagen no debe superar los 2MB.');
        return;
      }

      const lector = new FileReader();
      lector.onload = () => {
        this.previewImage = lector.result as string; // Asigna la imagen cargada a la propiedad
        this.usuario.imagen_user = this.previewImage; // Guarda la imagen en el usuario
      };
      lector.readAsDataURL(archivo);
    };

    input.click(); // Abre el selector de archivos
  }
}
