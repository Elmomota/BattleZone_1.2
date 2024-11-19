import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';  // Asegúrate de que esté correctamente importado
import { MenuController, NavController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ronda',
  templateUrl: './ronda.page.html',
  styleUrls: ['./ronda.page.scss'],
})
export class RondaPage implements OnInit {


  usuario: any = {};
  torneosJugados: any[] = [];


  constructor(private SqliteService: SqliteService,private navCtrl: NavController,private cdr: ChangeDetectorRef, private router:Router,private menuCtrl: MenuController) { }

  ngOnInit() {
    this.obtenerDatosUsuario();

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


  irAtras() {
    this.router.navigate(['/progreso']);
  }



}
