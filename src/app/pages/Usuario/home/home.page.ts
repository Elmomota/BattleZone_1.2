import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  juegos$ = new BehaviorSubject<any[]>([]); // Lista de juegos

  constructor(
    private router: Router, 
    private sqliteService: SqliteService
  ) {}

  ngOnInit() {
    this.cargarJuegos(); // Cargar los juegos desde la base de datos al iniciar
  }

  // Método para cargar los juegos desde la base de datos
  cargarJuegos() {
    this.sqliteService.fetchJuegos().subscribe(juegos => {
      this.juegos$.next(juegos); // Actualizar el observable con la lista de juegos
    }, err => {
      console.error('Error al cargar los juegos:', err);
    });
  }

  // Navegar a la página de detalles del juego seleccionado
  verDetalleJuego(id: number) {
    this.router.navigate(['/detalle-juego', id]);
  }
  Ircuenta(){
    
    this.router.navigate(['/cuenta']);
  }

}

