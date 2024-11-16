import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';  // Asegúrate de que esté correctamente importado
import { MenuController, NavController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController, ToastController } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';



@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  imagePerfil: string = ''; // Imagen por defecto

  usuario: any = {};
  torneosJugados: any[] = [];
  seleccion: string = 'Torneos jugados';  // Valor por defecto del segmento
  menuVisible: boolean = false;



  constructor(private SqliteService: SqliteService,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef,
     private router:Router,
     private menuCtrl: MenuController,
    private toastController: ToastController,
    private storage: NativeStorage,
    private alertController: AlertController,


  ) {}

  ngOnInit() {
    this.obtenerDatosUsuario();
  }
  toggleMenu() {
    this.menuVisible = !this.menuVisible; // Cambia el estado de visibilidad
  }
  toggleMenuController() {
    this.menuVisible ? this.menuCtrl.enable(true) : this.menuCtrl.enable(false);
  }

  async obtenerDatosUsuario() {
    try {
      this.usuario = await this.SqliteService.obtenerSesion(); // Obtener sesión activa
      if (this.usuario) {
        console.log('Datos del usuario:', this.usuario);
        // Asegúrate de que el usuario tenga un ID
        if (this.usuario.id) {
          this.obtenerTorneosInscritos(this.usuario.id); // Obtener torneos inscritos del usuario
        } else {
          console.error('El usuario no tiene un ID válido.');
        }
      } else {
        console.error('No se encontró una sesión activa.');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  }
  

  obtenerTorneosInscritos(userId: number) {
    this.SqliteService.obtenerTorneosInscritos(userId).then(torneos => {
      this.torneosJugados = torneos;
      
    }).catch(err => {
      console.error('Error obteniendo los torneos inscritos', err);
    });
  }
  

  home() {
    // Redirigir a la página principal
  }

  async presentToast(mensaje:string,position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: position,
    });
    await toast.present();
  }
/////////////////////////////////funcion para retroceder
  
async presentAlert(message: string) {
  const alert = await this.alertController.create({
    header: 'Error al publicar',
    message: message,
    buttons: ['Action'],
  });
  await alert.present();
}

  ediPerfil() {
    this.router.navigate(['/edicion-perfil']);
  }

irAtras() {
  this.router.navigate(['/home']);
}

async takePicture() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl, // Guarda la imagen en formato base64
    });

    if (image && image.dataUrl) {
      this.imagePerfil = image.dataUrl; // Actualiza la vista con la nueva imagen
      
      // Actualizar la foto en la base de datos
      await this.SqliteService.actualizarFotoUsuario(this.usuario.id_usuario, image.dataUrl);
      
      // Almacenar la nueva foto en la sesión
      const usuarioActualizado = { ...this.usuario, foto: image.dataUrl };
      await this.storage.setItem('usuario_sesion', usuarioActualizado);
      
      // Emitir el cambio de sesión al BehaviorSubject para propagarlo a la app
      this.SqliteService.usuarioSesionSubject.next(usuarioActualizado);
    } else {
      this.presentAlert('No se pudo capturar la imagen.');
    }
  } catch (error) {
    this.presentToast('Salio de la eleccion de foto intente nuevamente para ingresar una foto','bottom');;
  }
}


///////////////////////////////////////////////////////////////////


  onSegmentChange(event: any) {
    this.seleccion = event.detail.value;
    this.cdr.detectChanges();  // Forzar la actualización de la vista
  }


  cambiarContra(){

    this.router.navigate(['/cambiar-contra']);

  }

}