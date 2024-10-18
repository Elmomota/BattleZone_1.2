import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { NavController } from '@ionic/angular'; 
import { SqliteService } from 'src/app/services/sqlite.service'; 
import { Juego } from 'src/app/services/juego'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  usuario: string = ''; // Almacena el nickname del usuario
  juegos: Juego[] = []; // Lista de juegos
  filteredJuegos: Juego[] = [];  // Lista de juegos filtrados
  searchTerm: string = '';  // Término de búsqueda introducido por el usuario
  loading: boolean = true; // Estado de carga

  constructor(
    private router: Router, 
    private activedrouter: ActivatedRoute, 
    private navCtrl: NavController, 
    private sqliteService: SqliteService, 
  ) {}

  async ngOnInit() {
    // Obtener la sesión del usuario usando el servicio SQLite
    this.sqliteService.obtenerSesion().then(usuario => {
      if (usuario) {
        this.usuario = usuario.nickname || 'Usuario';  // Asignar el nickname del usuario
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

}






