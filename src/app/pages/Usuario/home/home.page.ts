import { Component, OnInit } from '@angular/core'; // Importación de componentes y OnInit para manejar el ciclo de vida del componente
import { ActivatedRoute, Router } from '@angular/router'; // Importación para manejar rutas activas y navegación
import { NavController } from '@ionic/angular'; // Importación del controlador de navegación de Ionic
import { SqliteService } from 'src/app/services/sqlite.service'; // Importación del servicio SQLite para gestionar datos
import { Juego } from 'src/app/services/juego'; // Importación del modelo de datos de juego

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  adminUser: string = ''; // Almacena el nombre del administrador
  juegos: Juego[] = []; // Lista de juegos
  filteredJuegos: Juego[] = [];  // Lista de juegos filtrados
  searchTerm: string = '';  // Término de búsqueda introducido por el usuario
  loading: boolean = true; // Estado de carga

  constructor(
    private router: Router, // Inyección del servicio Router para navegar entre páginas
    private activedrouter: ActivatedRoute, // Inyección del servicio ActivatedRoute para obtener parámetros de la ruta
    private navCtrl: NavController, // Inyección del controlador de navegación
    private sqliteService: SqliteService, // Inyección del servicio SQLite
    
  ) {
    // Suscribirse a los parámetros de consulta de la ruta activa
    this.activedrouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras?.state) {
        // Obtener el nombre del administrador desde los parámetros de navegación
        this.adminUser = this.router.getCurrentNavigation()?.extras?.state?.['nombreUser'];
      }
    });
  }

  async ngOnInit() { // Método que se ejecuta al inicializar el componente
    await this.loadJuegos(); // Cargar los juegos al inicializar la página

   
  }

  async loadJuegos() { // Método para cargar juegos desde el servicio
    this.loading = true; // Cambiar el estado de carga a verdadero
    try {
      this.sqliteService.fetchJuegos().subscribe(juegos => { // Obtener juegos desde el servicio SQLite
        this.juegos = juegos; // Almacenar todos los juegos
        this.filteredJuegos = juegos;  // Inicialmente mostrar todos los juegos
        this.loading = false; // Cambiar el estado de carga a falso
      });
    } catch (error) {
      console.error('Error loading juegos', error); // Manejo de errores al cargar juegos
      this.loading = false; // Asegurarse de cambiar el estado de carga a falso
    }
  }

  verDetallesJuego(juego: Juego) { // Método para navegar a la página de detalles de un juego
    if (juego && juego.id) { // Verificar que el juego es válido y tiene ID
      this.navCtrl.navigateForward(`/detalle-juego/${juego.id}`, { // Navegar a la página de detalles del juego
        queryParams: {
          juego: JSON.stringify(juego) // Pasar datos del juego como parámetros de consulta
        }
      });
    } else {
      console.warn('Juego no válido', juego); // Advertencia si el juego no es válido
    }
  }

}
