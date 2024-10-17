import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Usuario } from 'src/app/services/usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nuevoUsuario: Usuario = new Usuario();
  confirmarContrasena: string = '';
  edad: number = 0;

  constructor(private sqliteService: SqliteService, private router: Router) {}

  registrarUsuario() {
    // Validar si el correo o nickname ya existen
    this.sqliteService.getUsuarioByCorreoONickname(this.nuevoUsuario.correo, this.nuevoUsuario.nickname)
      .then(existe => {
        if (existe === true) {  // Asegurarse de que sea true
          alert('El correo o nickname ya están en uso.');
        } else {
          // Si todo está bien, registra al usuario
          this.sqliteService.addUsuario(this.nuevoUsuario).then(() => {
            this.router.navigate(['/iniciar-sesion']);
          });
        }
      })
      .catch(error => {
        console.error('Error al registrar usuario:', error);
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
