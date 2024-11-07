import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { NavController } from '@ionic/angular'; 
import { SqliteService } from 'src/app/services/sqlite.service'; 
import { Juego } from 'src/app/services/juego'; 
import { ServicioApiService } from 'src/app/services/servicio-api.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})


export class HomePage implements OnInit {

  mostrarNoticias: number = 5;  // Controla cuántas noticias mostrar
  usuario: string = ''; // Almacena el nickname del usuario
  juegos: Juego[] = []; // Lista de juegos
  filteredJuegos: Juego[] = [];  // Lista de juegos filtrados
  searchTerm: string = '';  // Término de búsqueda introducido por el usuario
  loading: boolean = true; // Estado de carga
  noticias: any[] = [];


  constructor(
    private router: Router, 
    private activedrouter: ActivatedRoute, 
    private navCtrl: NavController, 
    private sqliteService: SqliteService,
    private api: ServicioApiService

  ) {}

  async ngOnInit() {
    // Obtener la sesión del usuario usando el servicio SQLite
    this.sqliteService.obtenerSesion().then(usuario => {
      if (usuario) {
        this.usuario = usuario.nickname || 'Usuario';  // Asignar el nickname del usuario
        if (usuario.rol===1){
          this.navCtrl.navigateForward('/cuenta-admin')
        }
      } else {
        // Si no hay sesión activa, redirigir a la página de login
        this.navCtrl.navigateRoot('/iniciar-sesion');
      }
    });
  


    // Recuperar el nombre del usuario desde los parámetros de la ruta (si es necesario)
    this.activedrouter.queryParams.subscribe(params => {
      if (params && params['usuario']) {
        const usuario = JSON.parse(params['usuario']);
        this.usuario = usuario.nickname || this.usuario; // Usar el nickname del parámetro o mantener el de la sesión
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
      this.sqliteService.fetchJuegos().subscribe(juegos => { 
        this.juegos = juegos; 
        this.filteredJuegos = juegos;  
        this.loading = false; 
      });
    } catch (error) {
      console.error('Error loading juegos', error); 
      this.loading = false; 
    }
  }

  verDetallesJuego(juego: Juego) { 
    if (juego && juego.id) { 
      this.navCtrl.navigateForward(`/detalle-juego/${juego.id}`, { 
        queryParams: {
          juego: JSON.stringify(juego) 
        }
      });
    } else {
      console.warn('Juego no válido', juego); 
    }
  }

  Ircuenta(){
    this.router.navigate(['/cuenta']);
  }


  mostrarTodo: boolean = false;
  limiteNoticias: number = 5; // Mostrar solo 5 inicialmente

  toggleMostrarTodo() {
    this.mostrarTodo = !this.mostrarTodo;
    this.limiteNoticias = this.mostrarTodo ? this.noticias.length : 5; // Si mostrarTodo es true, muestra todo, sino muestra 5
  }


  verMas() {
    this.mostrarNoticias = this.noticias.length;
  }

comprobacion(){

  

}
}