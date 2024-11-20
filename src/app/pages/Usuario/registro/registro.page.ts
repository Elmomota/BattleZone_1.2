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
    if (this.paso === 1) {
      if (this.validarPaso1()) {
        this.paso++;
      }
    } else if (this.paso === 2) {
      if (this.validarPaso2()) {
        this.paso++;
      }
    } else if (this.paso === 3) {
      if (this.validarPaso3()) {
        this.registrarUsuario();
      }
    }
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

  validarPaso1() {
    const nombreValido = this.nuevoUsuario.pnombre && this.nuevoUsuario.pnombre.length >= 3 && /^[A-Za-z\s]+$/.test(this.nuevoUsuario.pnombre);
    const apellidoValido = this.nuevoUsuario.papellido && this.nuevoUsuario.papellido.length >= 3 && /^[A-Za-z\s]+$/.test(this.nuevoUsuario.papellido);
    const nicknameValido = this.nuevoUsuario.nickname && this.nuevoUsuario.nickname.length >= 3;
    const correoValido = this.nuevoUsuario.correo && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.nuevoUsuario.correo);

    if (!nombreValido) {
      alert('El nombre debe tener al menos 3 caracteres y no contener números.');
      return false;
    }
    if (!apellidoValido) {
      alert('El apellido debe tener al menos 3 caracteres y no contener números.');
      return false;
    }
    if (!nicknameValido) {
      alert('El nickname debe tener al menos 3 caracteres.');
      return false;
    }
    if (!correoValido) {
      alert('Debe ingresar un correo válido.');
      return false;
    }
    return true;
  }

  validarPaso2() {
    const contrasenaValida = this.nuevoUsuario.contrasena && this.nuevoUsuario.contrasena.length >= 8 && /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(this.nuevoUsuario.contrasena);
    const contrasenaConfirmada = this.confirmarContrasena === this.nuevoUsuario.contrasena;
    const edadValida = this.edad >= 14;

    if (!contrasenaValida) {
      alert('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.');
      return false;
    }
    if (!contrasenaConfirmada) {
      alert('Las contraseñas no coinciden.');
      return false;
    }
    if (!edadValida) {
      alert('Debe tener al menos 14 años.');
      return false;
    }
    return true;
  }

  validarPaso3() {
    const respuestaValida = this.respuesta && this.respuesta.trim().length > 0;

    if (!respuestaValida) {
      alert('Debe ingresar una respuesta.');
      return false;
    }
    if (!this.preguntaSeleccionadaId) {
      alert('Debe seleccionar una pregunta de seguridad.');
      return false;
    }
    return true;
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
