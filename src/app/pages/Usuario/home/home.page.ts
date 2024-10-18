import { Component, OnInit } from '@angular/core'; // Importación de componentes y OnInit para manejar el ciclo de vida del componente
import { ActivatedRoute, Router } from '@angular/router'; // Importación para manejar rutas activas y navegación
import { NavController } from '@ionic/angular'; // Importación del controlador de navegación de Ionic
import { SqliteService } from 'src/app/services/sqlite.service'; // Importación del servicio SQLite para gestionar datos
import { Juego } from 'src/app/services/juego'; // Importación del modelo de datos de juego
import { ServicioApiService } from 'src/app/services/servicio-api.service';




@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})


export class HomePage implements OnInit {

  usuario: string = ''; // Almacena el nombre del usuario
  juegos: Juego[] = []; // Lista de juegos
  filteredJuegos: Juego[] = [];  // Lista de juegos filtrados
  searchTerm: string = '';  // Término de búsqueda introducido por el usuario
  loading: boolean = true; // Estado de carga
  noticias: any[] = [];

  constructor(
    private router: Router, // Inyección del servicio Router para navegar entre páginas
    private activedrouter: ActivatedRoute, // Inyección del servicio ActivatedRoute para obtener parámetros de la ruta
    private navCtrl: NavController, // Inyección del controlador de navegación
    private sqliteService: SqliteService, // Inyección del servicio SQLite
    private api: ServicioApiService
  ) { }


  async ngOnInit() {
    // Recuperar el nombre del usuario desde los parámetros de la ruta
    this.activedrouter.queryParams.subscribe(params => {
      if (params && params['usuario']) {
        const usuario = JSON.parse(params['usuario']);
        this.usuario = usuario.nickname || 'Usuario';
      }
    });

    await this.loadJuegos(); // Cargar los juegos al inicializar la página


    

    this.api.getNoticias().subscribe((res)=>{
      console.log('Respuesta de la API:', res);
      this.noticias = res.articles;
      },(error)=>{
      console.log(error);
      });
     

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


  Ircuenta(){
    this.router.navigate(['/cuenta']);
  }

  iraux(){
    this.router.navigate(['/home']);
  }

  mostrarTodo: boolean = false;
  limiteNoticias: number = 5; // Mostrar solo 5 inicialmente

  toggleMostrarTodo() {
    this.mostrarTodo = !this.mostrarTodo;
    this.limiteNoticias = this.mostrarTodo ? this.noticias.length : 5; // Si mostrarTodo es true, muestra todo, sino muestra 5
  }

}
