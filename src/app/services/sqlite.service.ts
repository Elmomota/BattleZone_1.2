import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Torneo } from './torneo';
import { Administracion } from './administracion';
import { Juego } from './juego'
import { TorneoService } from './torneo-service.service';
import { Platform, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private dbInstance: SQLiteObject | null = null;
  
  // Observable para el estado de la base de datos
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  // Observables para los datos
  private listaTorneos = new BehaviorSubject<Torneo[]>([]);
  private listaAdministradores = new BehaviorSubject<Administracion[]>([]);
  private listaJuegos = new BehaviorSubject<Juego[]>([]);

  constructor(
    private sqlite: SQLite, 
    private torneoService: TorneoService,
    private platform: Platform, 
    private alertController: AlertController
  ) {
    this.crearBD();
  }

  // Observar el estado de la base de datos
  dbState(): Observable<boolean> {
    return this.isDbReady.asObservable();
  }

  // Obtener los torneos desde la base de datos
  fetchTorneos(): Observable<Torneo[]> {
    return this.listaTorneos.asObservable();
  }

  // Obtener los administradores desde la base de datos
  fetchAdministradores(): Observable<Administracion[]> {
    return this.listaAdministradores.asObservable();
  }

  // Obtener los juegos desde la base de datos
  fetchJuegos(): Observable<Juego[]> {
    return this.listaJuegos.asObservable();
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }

  crearBD() {
    this.platform.ready().then(async () => {
      try {
        this.dbInstance = await this.sqlite.create({
          name: 'torneos.db',
          location: 'default'
        });

        await this.dbInstance.executeSql('PRAGMA foreign_keys = ON;', []);
        await this.crearTablas();
        this.isDbReady.next(true); // Base de datos lista
      } catch (error) {
        this.presentAlert('Creación de BD', 'Error: ' + JSON.stringify(error));
      }
    });
  }
  async crearTablas() {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }
  
    try {
      // Eliminar tablas si existen (para evitar errores de estructura)
      await this.dbInstance.executeSql('DROP TABLE IF EXISTS torneos', []);
      await this.dbInstance.executeSql('DROP TABLE IF EXISTS administradores', []);
  
      // Crear tabla administradores
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS administradores (
          id INTEGER PRIMARY KEY,
          nombre TEXT,
          correo TEXT,
          contrasena TEXT
        )`, []
      );
  
      // Insertar un administrador por defecto
      await this.dbInstance.executeSql(
        `INSERT OR IGNORE INTO administradores (nombre, correo, contrasena)
         VALUES ('Admin1', 'al.barreras@gmail.com', 'Admin123')`, []
      );
  
      // Crear tabla torneos
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS torneos (
          id INTEGER PRIMARY KEY,
          nombre TEXT,
          juego TEXT,
          estado TEXT,
          numEquipos INTEGER,
          fechaInicio TEXT,
          imagen TEXT,
          creadorId INTEGER,
          FOREIGN KEY(creadorId) REFERENCES administradores(id)
        )`, []
      );
  
      // Insertar un torneo por defecto
      await this.dbInstance.executeSql(
        `INSERT OR IGNORE INTO torneos (nombre, juego, estado, numEquipos, fechaInicio, imagen, creadorId)
         VALUES ('Valorant Championship', 'Valorant', 'Abierto', 16, '2024-10-10', 'valorant.jpg', 
         (SELECT id FROM administradores WHERE nombre = 'Admin1'))`, []
      );    // Crear tabla juegos
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS juegos (
          id INTEGER PRIMARY KEY,
          nombre TEXT,
          tipo TEXT,
          descripcion TEXT,
          logo TEXT,
          cabecera TEXT
        )`, []
      );
  
      // Insertar juegos por defecto
      await this.dbInstance.executeSql(
        `INSERT OR IGNORE INTO juegos (nombre, tipo, descripcion, logo, cabecera) VALUES 
          ('Valorant', 'Shooter', 'Juego de disparos táctico en primera persona.', 'assets/logos/logo-valorant.png', 'assets/img/imagen-valorant.jpg'),
          ('LoL', 'MOBA', 'Juego de estrategia y combate por equipos.', 'assets/logos/logo-leagu-of-legends.png', 'assets/img/imagen-league-of-legends.jpg'),
          ('Fortnite', 'Battle Royale', 'Juego de supervivencia en un entorno de batalla masiva.', 'assets/logos/logo-fortnite.png', 'assets/img/imagen-fortnite.jpg'),
          ('Street Fighter', 'Pelea', 'Juego de lucha con personajes emblemáticos.', 'assets/logos/logo-street-fighter.png', 'assets/img/imagen-street-fighter.jpg');

        `, []
      );
  
      this.presentAlert('Bienvenido a', 'BATTLE ZONE');
      this.selectTorneos();
      this.selectAdministradores();
      this.selectJuegos(); // Llamar a la selección de juegos
    } catch (error) {
      this.presentAlert('Creación de Tablas', 'Error: ' + JSON.stringify(error));
    }
  }
  
  
  selectJuegos() {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }
  
    return this.dbInstance.executeSql(`SELECT * FROM juegos`, []).then(res => {
      let items: Juego[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        let juego = res.rows.item(i);
        items.push({
          ...juego,
          logo: juego.logo,        // Rutas del logo
          cabecera: juego.cabecera // Rutas de la cabecera
        });
      }
      this.listaJuegos.next(items); // Actualizar el observable de juegos
    }).catch(e => {
      this.presentAlert('Error al seleccionar juegos', JSON.stringify(e));
    });
  }
  
  


  selectTorneos() {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }

    return this.dbInstance.executeSql(`
      SELECT t.*, a.nombre AS creadorNombre 
      FROM torneos t 
      JOIN administradores a ON t.creadorId = a.id
    `, []).then(res => {
      let items: Torneo[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        let torneo = res.rows.item(i);
        items.push({
          ...torneo,
          creadorNombre: torneo.creadorNombre
        });
      }
      this.listaTorneos.next(items);
    }).catch(e => {
      this.presentAlert('Error al seleccionar torneos', JSON.stringify(e));
    });
  }

  selectAdministradores() {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }

    return this.dbInstance.executeSql(`SELECT * FROM administradores`, []).then(res => {
      let items: Administracion[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        let admin = res.rows.item(i);
        items.push(admin);
      }
      this.listaAdministradores.next(items); // Actualizar el observable de administradores
    }).catch(e => {
      this.presentAlert('Error al seleccionar administradores', JSON.stringify(e));
    });
  }

  async addTorneo(torneo: Torneo, adminId: number) {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }

    const sql = `INSERT INTO torneos (nombre, juego, estado, numEquipos, fechaInicio, imagen, creadorId) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [torneo.nombre, torneo.juego, torneo.estado, torneo.numEquipos, torneo.fechaInicio, torneo.imagen, adminId];
    
    try {
      console.log('Insertando torneo con valores:', values);
      await this.dbInstance.executeSql(sql, values);
      this.selectTorneos();
    } catch (error) {
      this.presentAlert('Error al añadir torneo', JSON.stringify(error));
    }
  }

  async actualizarTorneo(torneo: Torneo) {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }

    const sql = `UPDATE torneos SET nombre = ?, juego = ?, estado = ?, numEquipos = ?, fechaInicio = ?, imagen = ? WHERE id = ?`;
    const values = [torneo.nombre, torneo.juego, torneo.estado, torneo.numEquipos, torneo.fechaInicio, torneo.imagen, torneo.id];
    try {
      await this.dbInstance.executeSql(sql, values);
      await this.torneoService.notificarTorneoActualizado();
      this.selectTorneos(); // Actualizar datos
    } catch (error) {
      this.presentAlert('Error al actualizar torneo', JSON.stringify(error));
    }
  }

  async eliminarTorneo(id: number) {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }

    const sql = `DELETE FROM torneos WHERE id = ?`;
    try {
      await this.dbInstance.executeSql(sql, [id]);
      await this.torneoService.notificarTorneoEliminado();
      this.selectTorneos(); // Actualizar datos
    } catch (error) {
      this.presentAlert('Error al eliminar torneo', JSON.stringify(error));
    }
  }

  // Las funciones de administrador pueden seguir la misma estructura que los torneos
}
