import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { TorneoService } from 'src/app/services/torneo-service.service';
import { Torneo } from 'src/app/services/torneo';
import { Usuario } from 'src/app/services/usuario'; 

@Component({
  selector: 'app-cuenta-admin',
  templateUrl: './cuenta-admin.page.html',
  styleUrls: ['./cuenta-admin.page.scss'],
})
export class CuentaAdminPage implements OnInit {
  adminUser: string = '';
  torneos: Torneo[] = [];
  filteredTorneos: Torneo[] = [];
  torneosPasados: Torneo[] = []; // Lista de torneos finalizados
  usuarios: Usuario[] = []; // Lista de usuarios
  searchTerm: string = '';
  selectedSegment: string = 'actuales'; // Valor inicial del segmento
  loading: boolean = true;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private sqliteService: SqliteService,
    private torneoService: TorneoService
  ) {

  }

  async ngOnInit() {
    const usuario = await this.sqliteService.obtenerSesion();
    
    if (usuario && usuario.rol === 1) {
      this.adminUser = usuario.nickname || 'Admin';
      await this.loadTorneos();
      await this.loadUsuarios();

      // Suscripción a eventos de torneos
      this.torneoService.torneoAgregado$.subscribe(() => this.loadTorneos());
      this.torneoService.torneoEliminado$.subscribe(() => this.loadTorneos());

    } else {
      // Redirigir solo si no es admin o no está autenticado
      this.navCtrl.navigateRoot('/iniciar-sesion');
    }
}

  

  async loadTorneos() {
    this.loading = true;
    try {
        this.sqliteService.fetchTorneos().subscribe(torneos => {
            this.torneos = torneos;
            console.log('Torneos cargados:', this.torneos); // Verifica los torneos cargados
            this.filteredTorneos = torneos;  // Inicialmente mostrar todos los torneos
            this.loading = false;
        });
    } catch (error) {
        console.error('Error loading torneos', error);
        this.loading = false;
    }
}

  async loadUsuarios() {
    try {
      this.sqliteService.fetchUsuarios().subscribe(usuarios => {
        this.usuarios = usuarios;
      });
    } catch (error) {
      console.error('Error loading usuarios', error);
    }
  }
  segmentChanged(event: any) {
    const selectedValue = event.detail.value;

    if (selectedValue === 'actuales') {
        this.filteredTorneos = this.torneos.filter(torneo => 
            torneo.estado === 'Próximo' || torneo.estado === 'En curso'
        );
    } else if (selectedValue === 'pasados') {
        this.filteredTorneos = this.torneos.filter(torneo => 
            torneo.estado === 'Finalizado'
        );
    } else if (selectedValue === 'usuarios') {
        // Aquí ya tenemos los usuarios cargados desde loadUsuarios en ngOnInit
        console.log('Mostrando usuarios');
    }
}


  verDetallesTorneo(torneo: Torneo) {
    if (torneo && torneo.id) {
      this.navCtrl.navigateForward(`/detalles-torneo/${torneo.id}`, {
        queryParams: {
          torneo: JSON.stringify(torneo)
        }
      });
    } else {
      console.warn('Torneo no válido', torneo);
    }
  }

  addTorneo() {
    this.router.navigate(['/nuevo-torneo']);
  }

  // Función de búsqueda
  buscarTorneos() {
    const term = this.searchTerm.toLowerCase();
    if (this.selectedSegment === 'actuales') {
      this.filteredTorneos = this.torneos.filter(torneo => 
        torneo.nombre.toLowerCase().includes(term) && torneo.estado === 'Próximo'|| torneo.estado === 'En curso' 
      );
    } else if (this.selectedSegment === 'pasados') {
      this.filteredTorneos = this.torneos.filter(torneo => 
        torneo.nombre.toLowerCase().includes(term) && torneo.estado === 'Finalizado'
      );
    }
  }
}
