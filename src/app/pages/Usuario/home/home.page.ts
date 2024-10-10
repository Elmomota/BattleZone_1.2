import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

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

  cargarJuegos() {
    this.sqliteService.fetchJuegos().pipe(
      distinctUntilChanged() // Evitar que se emitan los mismos valores duplicados
    ).subscribe(juegos => {
      this.juegos$.next(juegos); // Actualizar el observable con la lista de juegos
    }, err => {
      console.error('Error al cargar los juegos:', err);
    });
  }

  verDetalleJuego(id: number) {
    this.router.navigate(['/detalle-juego', id]); // Navegar a la página de detalles
  }

  Ircuenta() {
    this.router.navigate(['/cuenta']); // Navegar a la página de cuenta
  }
}
