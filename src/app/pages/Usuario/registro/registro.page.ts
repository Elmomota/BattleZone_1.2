import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Usuario } from 'src/app/services/usuario';
import { Preguntas } from 'src/app/services/preguntas';
import { Respuestas } from 'src/app/services/respuestas';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // Importa Camera

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
  imagenPerfil: string = '';

  constructor(
    private sqliteService: SqliteService,
    private router: Router
  ) {
    this.obtenerPreguntas();
  }

  seleccionarFoto(): void {
    // Aquí puedes manejar la lógica para abrir un selector de archivos o capturar una foto
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
        this.imagenPerfil = lector.result as string; // Asigna la imagen cargada a la propiedad
      };
      lector.readAsDataURL(archivo);
    };
  
    input.click();
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
    // Normalizar a minúsculas para validación
    this.nuevoUsuario.pnombre = (this.nuevoUsuario.pnombre || '').toLowerCase().trim();
    this.nuevoUsuario.papellido = (this.nuevoUsuario.papellido || '').toLowerCase().trim();
    this.nuevoUsuario.nickname = (this.nuevoUsuario.nickname || '').toLowerCase().trim();
    this.nuevoUsuario.correo = (this.nuevoUsuario.correo || '').toLowerCase().trim();
  
    const nombreValido = this.nuevoUsuario.pnombre.length >= 3 && /^[a-z\s]+$/.test(this.nuevoUsuario.pnombre);
    const apellidoValido = this.nuevoUsuario.papellido.length >= 3 && /^[a-z\s]+$/.test(this.nuevoUsuario.papellido);
    const nicknameValido = this.nuevoUsuario.nickname.length >= 3;
    const correoValido = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(this.nuevoUsuario.correo);
  
    if (!nombreValido) {
      alert('El nombre debe tener al menos 3 caracteres y no contener números ni caracteres especiales.');
      return false;
    }
    if (!apellidoValido) {
      alert('El apellido debe tener al menos 3 caracteres y no contener números ni caracteres especiales.');
      return false;
    }
    if (!nicknameValido) {
      alert('El nickname debe tener al menos 3 caracteres.');
      return false;
    }
    if (!correoValido) {
      alert('Debe ingresar un correo válido en minúsculas.');
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
  
    // Validación de imagen
    if (!this.imagenPerfil) {
      alert('Debe seleccionar una imagen de perfil.');
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
