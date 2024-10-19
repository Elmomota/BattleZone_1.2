import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular'; // Agregar ToastController para mostrar mensajes
import { SqliteService } from 'src/app/services/sqlite.service'; // Servicio de SQLite
import { Torneo } from 'src/app/services/torneo'; // Interfaz de Torneo
import { UserTorneo } from 'src/app/services/user-torneo'; // Interfaz de inscripción

@Component({
  selector: 'app-detalle-inscripcion',
  templateUrl: './detalle-inscripcion.page.html',
  styleUrls: ['./detalle-inscripcion.page.scss'],
})
export class DetalleInscripcionPage implements OnInit {
  torneo?: Torneo; // Datos del torneo
  usuario: any = {}; // Datos del usuario

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private sqliteService: SqliteService, // Inyectamos el servicio de SQLite
    private router: Router,
    private toastController: ToastController // Agregar ToastController para los mensajes
  ) {}

  async ngOnInit() {
    // Obtener los datos del torneo de los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      if (params && params['torneo']) {
        try {
          this.torneo = JSON.parse(params['torneo']);
        } catch (error) {
          console.error('Error al parsear el torneo:', error);
        }
      }
    });

    // Obtener los datos del usuario desde la sesión
    await this.obtenerDatosUsuario();
  }

  // Método para obtener los datos del usuario de la sesión
  async obtenerDatosUsuario() {
    try {
      this.usuario = await this.sqliteService.obtenerSesion(); // Obtener sesión activa
      if (this.usuario) {
        console.log('Datos del usuario:', this.usuario);
      } else {
        console.error('No se encontró una sesión activa.');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  }

// Método para confirmar la inscripción
async confirmarInscripcion() {
  if (this.torneo && this.torneo.id !== undefined && this.usuario) {
    // Verificar si el número de equipos disponibles es mayor que 0
    if (this.torneo.numEquipos <= 0) {
      this.mostrarMensaje('No hay cupos disponibles para este torneo.');
      return; // Si no hay cupos, no proceder con la inscripción
    }

    // Verificar si el usuario ya está inscrito en el torneo usando correo y nickname
    const yaInscrito = await this.sqliteService.verificarInscripcionPorCorreoYNickname(this.torneo.id, this.usuario.correo, this.usuario.nickname);
    
    if (yaInscrito) {
      this.mostrarMensaje('Ya estás inscrito en este torneo.');
      return; // Si ya está inscrito, detener el proceso
    }

    // Crear la inscripción
    const inscripcion: UserTorneo = {
      id: Date.now(), // Genera un ID único
      id_torneo: this.torneo.id,
      id_usuario: this.usuario.id,
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      nickname: this.usuario.nickname,
      correo: this.usuario.correo
    };

    try {
      // Inscribir al usuario en el torneo
      await this.sqliteService.inscribirTorneo(inscripcion);

      // Restar 1 al número de equipos (cupo disponible)
      if (this.torneo.numEquipos > 0) {
        this.torneo.numEquipos -= 1;
        await this.sqliteService.actualizarTorneo(this.torneo); // Actualizar el torneo en la base de datos
      }

      // Mostrar mensaje de éxito
      this.mostrarMensaje('Inscripción exitosa en el torneo.');
      console.log('Inscripción guardada:', inscripcion);

      // Redirigir a la página de inicio después de la inscripción
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al inscribir en el torneo:', error);
    }
  } else {
    console.error('Faltan datos del torneo o del usuario.');
  }
}


  // Método para mostrar mensajes
  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  // Método para regresar a la página anterior
  regresar() {
    this.navCtrl.navigateBack('/detalle-juego');
  }
}
