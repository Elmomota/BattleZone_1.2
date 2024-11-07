import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Usuario } from 'src/app/services/usuario';
import { Preguntas } from 'src/app/services/preguntas';

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
  preguntas: Preguntas[] = []; // Modelo ajustado
  registroForm: FormGroup; // Formulario reactivo

  constructor(
    private sqliteService: SqliteService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.registroForm = this.formBuilder.group({
      preguntaSeleccionadaId: ['', Validators.required],
      respuesta: ['', Validators.required]
    });

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
    const { preguntaSeleccionadaId, respuesta } = this.registroForm.value;

    this.sqliteService.getUsuarioByCorreo(this.nuevoUsuario.correo)
      .then(existe => {
        if (existe) {
          alert('El correo o nickname ya están en uso.');
        } else {
          this.sqliteService.addUsuario(this.nuevoUsuario)
            .then((usuarioId) => {
              if (usuarioId && preguntaSeleccionadaId && respuesta) {
                this.sqliteService.addRespuesta(preguntaSeleccionadaId, usuarioId, respuesta)
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
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    this.edad = edad;
  }

  irLogin() {
    this.router.navigate(['/iniciar-sesion']);
  }
}
