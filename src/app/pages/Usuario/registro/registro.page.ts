

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Usuario } from 'src/app/services/usuario';
import { Preguntas } from 'src/app/services/preguntas';
import { Respuestas } from 'src/app/services/respuestas';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nuevoUsuario: Usuario = new Usuario();
  confirmarContrasena: string = '';
  edad: number = 0;
  paso: number = 1;
  preguntas: Preguntas[] = [];
  preguntaSeleccionadaId: number | undefined;
  respuesta: string = '';

  constructor(
    private sqliteService: SqliteService,
    private router: Router
  ) {
    this.obtenerPreguntas();
  }

  siguientePaso() {
    if (this.paso < 3) this.paso++;
  }

  pasoAnterior() {
    if (this.paso > 1) this.paso--;
  }

  obtenerPreguntas() {
    this.sqliteService.getPreguntas()
      .then((preguntas) => {
        this.preguntas = preguntas;
      })
      .catch((error) => {
        console.error('Error al obtener preguntas:', error);
      });
  }

  registrarUsuario() {
    this.sqliteService.getUsuarioByCorreo(this.nuevoUsuario.correo)
      .then(existe => {
        if (existe) {
          alert('El correo o nickname ya están en uso.');
        } else {
          this.sqliteService.addUsuario(this.nuevoUsuario)
            .then((usuarioId) => {
              if (usuarioId && this.preguntaSeleccionadaId && this.respuesta) {
                const nuevaRespuesta = new Respuestas();
                nuevaRespuesta.preguntaId = this.preguntaSeleccionadaId;
                nuevaRespuesta.usuarioId = usuarioId;
                nuevaRespuesta.respuesta = this.respuesta;
                
                this.sqliteService.addRespuesta(
                  nuevaRespuesta.preguntaId,
                  nuevaRespuesta.usuarioId,
                  nuevaRespuesta.respuesta
                )
                .then(() => {
                  this.router.navigate(['/iniciar-sesion']);
                })
                .catch(error => {
                  console.error('Error al guardar la respuesta de seguridad:', error);
                });
              } else {
                console.error('No se pudo obtener el ID del usuario.');
              }
            })
            .catch(error => {
              console.error('Error al registrar usuario:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error al validar usuario:', error);
      });
  }

  calcularEdad(event: any) {
    const fechaNacimiento = new Date(event.detail.value);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fechaNacimiento.getTime();
    this.edad = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25));
  }

  irLogin() {
    this.router.navigate(['/iniciar-sesion']);
  }
}
