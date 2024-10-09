import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { TorneoService } from 'src/app/services/torneo-service.service';
import { Torneo } from 'src/app/services/torneo';

@Component({
  selector: 'app-cuenta-admin',
  templateUrl: './cuenta-admin.page.html',
  styleUrls: ['./cuenta-admin.page.scss'],
})
export class CuentaAdminPage implements OnInit {
  adminUser: string = '';
  torneos: Torneo[] = [];
  loading: boolean = true;

  constructor(
    private router: Router,
    private activedrouter: ActivatedRoute,
    private navCtrl: NavController,
    private sqliteService: SqliteService,
    private torneoService: TorneoService
  ) {
    this.activedrouter.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation()?.extras?.state) {
        this.adminUser = this.router.getCurrentNavigation()?.extras?.state?.['nombreUser'];
      }
    });
  }

  async ngOnInit() {
    await this.loadTorneos();

    this.torneoService.torneoAgregado$.subscribe(() => {
      this.loadTorneos();
    });
    this.torneoService.torneoEliminado$.subscribe(() => {
      this.loadTorneos();
    });
  }

  async loadTorneos() {
    this.loading = true;
    try {
      this.sqliteService.fetchTorneos().subscribe(torneos => {
        this.torneos = torneos;
        this.loading = false;
      });
    } catch (error) {
      console.error('Error loading torneos', error);
      this.loading = false;
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
    this.router.navigate(['/agregar-torneo']);
  }
}
