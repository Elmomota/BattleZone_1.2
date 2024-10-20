import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';  // Asegúrate de que esté correctamente importado

@Component({
  selector: 'app-vista-torneo',
  templateUrl: './vista-torneo.page.html',
  styleUrls: ['./vista-torneo.page.scss'],
})
export class VistaTorneoPage implements OnInit {

  constructor(private SqliteService: SqliteService,private navCtrl: NavController) { }

  ngOnInit() {
  }

  irAtras() {
    this.navCtrl.back();
  }


  
}
