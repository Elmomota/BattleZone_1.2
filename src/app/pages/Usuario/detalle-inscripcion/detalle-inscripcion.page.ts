import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Torneo } from 'src/app/services/torneo';
import { UserTorneo } from 'src/app/services/user-torneo';

@Component({
  selector: 'app-detalle-inscripcion',
  templateUrl: './detalle-inscripcion.page.html',
  styleUrls: ['./detalle-inscripcion.page.scss'],
})
export class DetalleInscripcionPage implements OnInit {
  torneo?: Torneo;
  usuario: any = {};

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private sqliteService: SqliteService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['torneo']) {
        try {
          this.torneo = JSON.parse(params['torneo']);
        } catch (error) {
          console.error('Error al parsear el torneo:', error);
        }
      }
    });
    await this.obtenerDatosUsuario();
  }

  async obtenerDatosUsuario() {
    try {
      this.usuario = await this.sqliteService.obtenerSesion();
      if (this.usuario) {
        console.log('Datos del usuario:', this.usuario);
      } else {
        console.error('No se encontró una sesión activa.');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  }

  async confirmarInscripcion() {
    if (this.torneo && this.torneo.id !== undefined && this.usuario) {
      if (this.torneo.numEquipos <= 0) {
        this.mostrarMensaje('No hay cupos disponibles para este torneo.');
        return;
      }

      const yaInscrito = await this.sqliteService.verificarInscripcionPorCorreoYNickname(
        this.torneo.id, 
        this.usuario.correo, 
        this.usuario.nickname
      );

      if (yaInscrito) {
        this.mostrarMensaje('Ya estás inscrito en este torneo.');
        return;
      }

      const inscripcion: UserTorneo = {
        id: Date.now(),
        id_torneo: this.torneo.id,
        id_usuario: this.usuario.id,
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        nickname: this.usuario.nickname,
        correo: this.usuario.correo
      };

      try {
        await this.sqliteService.inscribirTorneo(inscripcion);

        if (this.torneo.numEquipos > 0) {
          this.torneo.numEquipos -= 1;
          await this.sqliteService.actualizarTorneo(this.torneo);
        }


        // Crear duelo inicial
        const fechaInicio = new Date(this.torneo.fechaInicio);
        const duelo = await this.crearDuelo(fechaInicio, this.usuario.nickname);

        console.log('Duelo inicial creado:', duelo);

        this.mostrarMensaje('Inscripción y duelo inicial creados.');
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al inscribir en el torneo:', error);
      }
    } else {
      console.error('Faltan datos del torneo o del usuario.');
    }
  }











  async crearDuelo(fechaInicio: Date, jugador1: string) {
    const duelo = {
      id_torneo: this.torneo?.id,
      jugador1: jugador1,
      jugador2: null, // Se asigna cuando haya otro jugador disponible
      ronda: 1,
      tiempoInicio: fechaInicio.toISOString(),
    };
    await this.sqliteService.crearDuelo(duelo);
    return duelo;
  }

  async procesarSiguienteRonda(dueloActual: any, ganador: string) {
    const siguienteTiempo = new Date(dueloActual.tiempoInicio);
    siguienteTiempo.setMinutes(siguienteTiempo.getMinutes() + 20);

    const nuevoDuelo = {
      id_torneo: dueloActual.id_torneo,
      jugador1: ganador,
      jugador2: null,
      ronda: dueloActual.ronda + 1,
      tiempoInicio: siguienteTiempo.toISOString(),
    };

    await this.sqliteService.crearDuelo(nuevoDuelo);
    await this.sqliteService.eliminarJugadorPerdedor(dueloActual.jugador2);

    console.log('Nuevo duelo creado:', nuevoDuelo);
    console.log('Jugador perdedor eliminado:', dueloActual.jugador2);
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  regresar() {
    this.navCtrl.back();
  }
}
