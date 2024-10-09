import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-juego',
  templateUrl: './detalle-juego.page.html',
  styleUrls: ['./detalle-juego.page.scss'],
})
export class DetalleJuegoPage implements OnInit {

  juego: any = {};  // Detalles del juego seleccionado
  torneos$ = new BehaviorSubject<any[]>([]); // Lista de torneos asociados al juego

  constructor(
    private sqliteService: SqliteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id']; // Obtener ID del juego desde la URL
    this.cargarJuego(id); // Cargar el juego al iniciar la página
  }

  // Método para cargar los detalles del juego
  cargarJuego(id: number) {
    this.sqliteService.fetchJuegos().subscribe(juegos => {
      const juegoEncontrado = juegos.find((j: any) => j.id === id);
      if (juegoEncontrado) {
        this.juego = juegoEncontrado; // Cargar los detalles del juego
        this.cargarTorneos(this.juego.nombre); // Cargar los torneos asociados al juego
      }
    }, err => {
      console.error('Error al cargar el juego:', err);
    });
  }

  // Método para cargar los torneos asociados al juego
  cargarTorneos(juegoNombre: string) {
    this.sqliteService.fetchTorneos().subscribe(torneos => {
      const torneosAsociados = torneos.filter(t => t.juego === juegoNombre);
      this.torneos$.next(torneosAsociados); // Actualizar el observable con la lista de torneos
    }, err => {
      console.error('Error al cargar los torneos:', err);
    });
  }


  home(){
    
    this.router.navigate(['/home']);
  }
}
