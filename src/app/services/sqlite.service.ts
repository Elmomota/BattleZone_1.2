
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Torneo } from './torneo';
import { Administracion } from './administracion';
import { Juego } from './juego'
import { TorneoService } from './torneo-service.service';
import { Platform, AlertController } from '@ionic/angular';
import { Usuario } from './usuario';
import { UserTorneo } from './user-torneo'

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private dbInstance: SQLiteObject | null = null;
  private _storage: Storage | null = null;
  
  // Observable para el estado de la base de datos
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  // Observables para los datos
  private listaTorneos = new BehaviorSubject<Torneo[]>([]);
  private listaAdministradores = new BehaviorSubject<Administracion[]>([]);
  private listaJuegos = new BehaviorSubject<Juego[]>([]);
  private listaUsuarios = new BehaviorSubject<Usuario[]>([]);

  constructor(
    private sqlite: SQLite, 
    private torneoService: TorneoService,
    private platform: Platform, 
    private alertController: AlertController,
    private storage: Storage
  ) {

    this.crearBD();
    this.init();
  }
  async init() {
    // Inicializa el Storage
    const storage = await this.storage.create();
    this._storage = storage;
  }
   // Guardar datos de sesión
   async guardarSesion(usuario: any) {
    await this._storage?.set('usuario', usuario);
  }

  // Obtener datos de sesión
  async obtenerSesion() {
    return await this._storage?.get('usuario');
  }

  // Eliminar sesión
  async eliminarSesion() {
    await this._storage?.remove('usuario');
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

    // Obtener los usuarios desde la base de datos
    fetchUsuarios(): Observable<Usuario[]> {
      return this.listaUsuarios.asObservable(); // Añadir esta línea
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

   async obtenerTorneoPorNombreYFecha(nombre: string, fecha: string): Promise<Torneo | null> {
    const query = `SELECT * FROM torneos WHERE nombre = ? OR fechaInicio = ?`;
    const result = await this.dbInstance!.executeSql(query, [nombre, fecha]); // Cambiado 'database' por 'dbInstance'
    return result.rows.length > 0 ? result.rows.item(0) : null;
  }

  async crearTablas() {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }
  
    try {

      // Crear tabla administradores si no existe
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS administradores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          correo TEXT,
          contrasena TEXT
        )`, []
      );

      //crear tabla de Usuarios 
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pnombre TEXT NOT NULL,
          papellido TEXT NOT NULL,
          nickname TEXT NOT NULL,
          correo TEXT NOT NULL UNIQUE,
          contrasena TEXT NOT NULL,
          fechaNacimiento TEXT NOT NULL,
          pais TEXT NOT NULL
        )`, []
      );
      // Insertar un administrador por defecto (si no existe)
      await this.dbInstance.executeSql(
        `INSERT OR IGNORE INTO administradores (id, nombre, correo, contrasena)
         VALUES (1,'ElmoAdmin', 'al.barreras@gmail.com', 'elmomota770'),
                (2,'SrchitoAdmin', 'srchitita@gmail.com', 'Srchito123')`, []
      );
  
      // Crear tabla torneos si no existe
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS torneos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          juego TEXT,
          estado TEXT,
          numEquipos INTEGER,
          fechaInicio TEXT,
          imagen TEXT,
          creadorId INTEGER,
          FOREIGN KEY(creadorId) REFERENCES administradores(id) ON DELETE CASCADE
        )`, []
      );
      // Crear tabla juegos si no existe
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS juegos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          tipo TEXT,
          descripcion TEXT,
          logo TEXT,
          cabecera TEXT
        )`, []
      );

      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS inscripcion_torneo (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          id_torneo INTEGER,
          id_usuario INTEGER,
          nombre TEXT,
          apellido TEXT,
          nickname TEXT,
          correo TEXT,
          FOREIGN KEY (id_torneo) REFERENCES torneos(id),
          FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        );
      `, []);
      


      // Insertar juegos por defecto
      await this.dbInstance.executeSql(
        `INSERT OR IGNORE INTO juegos (id, nombre, tipo, descripcion, logo, cabecera) VALUES 
          (1,'Valorant', 'Shooter', 'Juego de disparos táctico en primera persona.', 'assets/logos/logo-valorant.jpg', 'assets/img/imagen-valorant.jpg'),
          (2,'League of Legends', 'MOBA', 'Juego de estrategia y combate por equipos.', 'assets/logos/logo-leagu-of-legends.jpg', 'assets/img/imagen-league-of-legends.jpg'),
          (3,'Fortnite', 'Battle Royale', 'Juego de supervivencia en un entorno de batalla masiva.', 'assets/logos/logo-fortnite.jpg', 'assets/img/imagen-fortnite.jpg'),
          (4,'Street Fighter', 'Pelea', 'Juego de lucha con personajes emblemáticos.', 'assets/logos/logo-street-fighter.jpg', 'assets/img/imagen-street-fighter.jpg')`, []
      );
  
      // Mostrar mensaje de bienvenida
      this.presentAlert('Bienvenido a', 'BATTLE ZONE');
  
      // Cargar datos
      this.selectTorneos();
      this.selectAdministradores();
      this.selectJuegos();
      this.selectUsuarios();
  
    } catch (error) {
      // Mostrar alerta en caso de error
      this.presentAlert('Creación de Tablas', 'Error: ' + JSON.stringify(error));
    }
  }


  selectUsuarios() {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }

    return this.dbInstance.executeSql(`SELECT * FROM usuarios`, []).then(res => {
      let items: Usuario[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        let usuario = res.rows.item(i);
        items.push({
          id: usuario.id,
          pnombre: usuario.pnombre,
          papellido: usuario.papellido,
          nickname: usuario.nickname,
          correo: usuario.correo,
          contrasena: usuario.contrasena,
          fechaNacimiento: usuario.fechaNacimiento,
          edad:usuario.edad,
          pais: usuario.pais
        });
      }
      this.listaUsuarios.next(items); // Actualizar el observable de usuarios
    }).catch(e => {
      this.presentAlert('Error al seleccionar usuarios', JSON.stringify(e));
    });
  }
  
  selectJuegos() {
    return this.dbInstance!.executeSql(`SELECT * FROM juegos`, []).then(res => {
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
    return this.dbInstance!.executeSql(`
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
  async addUsuario(nuevoUsuario: Usuario) {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }
    const sql = 'INSERT INTO usuarios (pnombre, papellido, nickname, correo, contrasena, fechaNacimiento, pais) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [nuevoUsuario.pnombre, nuevoUsuario.papellido, nuevoUsuario.nickname, nuevoUsuario.correo, nuevoUsuario.contrasena, nuevoUsuario.fechaNacimiento, nuevoUsuario.pais];
    
    try {
      await this.dbInstance.executeSql(sql, values);
      this.selectUsuarios();  // Actualizar la lista observable de usuarios después de insertar
    } catch (error) {
      this.presentAlert('Error al añadir al Usuario', JSON.stringify(error));
    }
  }
  

  async actualizarUsuario(usuario : Usuario){
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }
    const sql = `UPDATE usuarios SET pnombre = ?, papellido = ?, nickname = ?, correo = ?, contrasena = ?, fechaNacimiento = ?, edad = ?, pais = ? WHERE id = ?`;
    const values = [usuario.pnombre, usuario.papellido, usuario.nickname, usuario.correo, usuario.contrasena, usuario.fechaNacimiento, usuario.edad, usuario.pais, usuario.id];
    
    try {
      await this.dbInstance.executeSql(sql, values);
    } catch (error) {
      this.presentAlert('Error al añador al Usuario', JSON.stringify(error));
    }
  }

  async loginUsuario(correo: string, contrasena: string): Promise<Usuario | null> {
    const query = `SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?`;
    const result = await this.dbInstance!.executeSql(query, [correo, contrasena]);
    
    if (result.rows.length > 0) {
      return result.rows.item(0); // Usuario encontrado
    } else {
      return null; // Credenciales incorrectas
    }
  }


  getUsuarioByCorreoONickname(correo: string, nickname: string): Promise<boolean> {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return Promise.resolve(false); // Retorna false si no hay instancia
    }
  
    const query = `SELECT * FROM usuarios WHERE correo = ? OR nickname = ?`;
  
    return this.dbInstance.executeSql(query, [correo, nickname]).then(res => {
      return res.rows.length > 0; // Retorna true si hay resultados
    }).catch(e => {
      console.error('Error al buscar usuario', e);
      return false; // Retorna false en caso de error
    });
  }
  
  // Método para inscribir al usuario en el torneo
  async inscribirTorneo(inscripcion: UserTorneo): Promise<void> {
    if (!this.dbInstance) {
      throw new Error('Database instance is not initialized.');
    }

    const query = `INSERT INTO inscripcion_torneo (id_torneo, id_usuario, nombre, apellido, nickname, correo) VALUES (?, ?, ?, ?, ?, ?);`;
    const values = [inscripcion.id_torneo,inscripcion.id_usuario,inscripcion.nombre,inscripcion.apellido,inscripcion.nickname,inscripcion.correo];

    await this.dbInstance.executeSql(query, values);
  }


  getUsuarioByCorreo(correo: string): Promise<any> {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return Promise.reject('DB no inicializada'); // Retorna una promesa rechazada si no hay instancia
    }
  
    const query = `SELECT * FROM usuarios WHERE correo = ?`;
  
    return this.dbInstance.executeSql(query, [correo]).then(res => {
      if (res.rows.length > 0) {
        // Si se encuentra un usuario, retorna sus detalles
        return {
          id: res.rows.item(0).id,
          pnombre: res.rows.item(0).pnombre,
          papellido: res.rows.item(0).papellido,
          nickname: res.rows.item(0).nickname,
          correo: res.rows.item(0).correo,
          contrasena: res.rows.item(0).contrasena,
          fechaNacimiento: res.rows.item(0).fechaNacimiento,
          pais: res.rows.item(0).pais
        };
      } else {
        return null; // Retorna null si no se encuentra el usuario
      }
    }).catch(e => {
      console.error('Error al buscar usuario', e);
      return null; // Retorna null en caso de error
    });
  }
  
  
}  