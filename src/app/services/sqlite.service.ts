
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { from } from 'rxjs';


import { Torneo } from './torneo';
import { Juego } from './juego'
import { TorneoService } from './torneo-service.service';
import { Platform, AlertController } from '@ionic/angular';
import { Usuario } from './usuario';
import { UserTorneo } from './user-torneo';
import { Preguntas } from './preguntas';
import { Respuestas } from './respuestas';
import { Duelo } from './duelo';

@Injectable({
  providedIn: 'root'
})


////////////creacion instancia bdd
export class SqliteService {


  public dbInstance!: SQLiteObject;
  private _storage: Storage | null = null;
    public usuarioSesionSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public usuarioSesion$ = this.usuarioSesionSubject.asObservable();


  // Observable para el estado de la base de datos
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  // Observables para los datos
  private listaTorneos = new BehaviorSubject<Torneo[]>([]);
 //ELIMINACION DE ADMINISTRADORES (CLASS Y TABLA)
  private listaJuegos = new BehaviorSubject<Juego[]>([]);
  private listaUsuarios = new BehaviorSubject<Usuario[]>([]);
  private listaPreguntas =new BehaviorSubject<Preguntas[]>([]);
  private listaRespuestas =new BehaviorSubject<Respuestas[]>([]);






  /////////////////////////////constructor para las conexciones (pa ke todo funcione basicamente)
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
  async guardarSesion(usuario: any) {
    if (!this._storage) await this.init();
    await this._storage?.set('usuario', usuario);
}

async obtenerSesion() {
    if (!this._storage) await this.init();
    return await this._storage?.get('usuario');
}

async eliminarSesion() {
    if (!this._storage) await this.init();
    await this._storage?.remove('usuario');
}

async actualizarSesion(usuario: Usuario) {
  if (!this._storage) await this.init();
  await this._storage?.set('usuario', usuario); 
  this.usuarioSesionSubject.next(usuario); 
}





  // Observar el estado de la base de datos
  dbState(): Observable<boolean> {
    return this.isDbReady.asObservable();
  }




  // Obtener los torneos desde la base de datos
  fetchTorneos(): Observable<Torneo[]> {
    return this.listaTorneos.asObservable();
  }


  // Obtener los juegos desde la base de datos
  fetchJuegos(): Observable<Juego[]> {
    return this.listaJuegos.asObservable();
  }

    // Obtener los preguntas desde la base de datos
    fetchPreguntas(): Observable<Preguntas[]> {
      return this.listaPreguntas.asObservable();
    }
    // Obtener los respuestas desde la base de datos
    fetchRespuestas(): Observable<Respuestas[]> {
      return this.listaRespuestas.asObservable();
    }

    // Obtener los usuarios desde la base de datos
    fetchUsuarios(): Observable<Usuario[]> {
      return this.listaUsuarios.asObservable(); // Añadir esta línea
    }






  /////////////////////////////funcion async para crear  alertas pidiendo titulo y msj 
  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }



/////////////////////////////crear bd 
  crearBD() {
    this.platform.ready().then(async () => {
      try {
        this.dbInstance = await this.sqlite.create({
          name: 'torneos.db',
          location: 'default'
        });




/////////////////////////////lineas para funciones de sql
        await this.dbInstance.executeSql('PRAGMA foreign_keys = ON;', []);
        await this.crearTablas();
        this.isDbReady.next(true); // Base de datos lista


///////////////////////////// si hay error agarrar con esta alerta
      } catch (error) {
        this.presentAlert('Creación de BD', 'Error: ' + JSON.stringify(error));
      }
    });
  }


///////////////////////////// obtener torneo por nombrey feha 

   async obtenerTorneoPorNombreYFecha(nombre: string, fecha: string): Promise<Torneo | null> {
    const query = `SELECT * FROM torneos WHERE nombre = ? OR fechaInicio = ?`;
    const result = await this.dbInstance!.executeSql(query, [nombre, fecha]); // Cambiado 'database' por 'dbInstance'
    return result.rows.length > 0 ? result.rows.item(0) : null;
  }







/////////////////////////////creacion de tablas general///////////////////////////////////












async crearTablas() {
  if (!this.dbInstance) {
    console.error('La instancia de la base de datos no está lista.');
    return;
  }

  try {
    // Eliminar todas las tablas si existen
    /*
    await this.dbInstance.executeSql(`DROP TABLE IF EXISTS duelos`, []);
    await this.dbInstance.executeSql(`DROP TABLE IF EXISTS respuestas_seguridad`, []);
    await this.dbInstance.executeSql(`DROP TABLE IF EXISTS preguntas`, []);
    await this.dbInstance.executeSql(`DROP TABLE IF EXISTS inscripcion_torneo`, []);
    await this.dbInstance.executeSql(`DROP TABLE IF EXISTS torneos`, []);
    await this.dbInstance.executeSql(`DROP TABLE IF EXISTS juegos`, []);
    await this.dbInstance.executeSql(`DROP TABLE IF EXISTS usuarios`, []);
    await this.dbInstance.executeSql(`DROP TABLE IF EXISTS administradores`, []);
    */

    await this.dbInstance.executeSql(
      `CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pnombre TEXT NOT NULL,
        papellido TEXT NOT NULL,
        nickname TEXT NOT NULL,
        correo TEXT NOT NULL UNIQUE,
        contrasena TEXT NOT NULL,
        fechaNacimiento TEXT NOT NULL,
        pais TEXT NOT NULL,
        rol INTEGER NOT NULL DEFAULT 2,  -- 1 para administrador, 2 para cliente
        imagen_user TEXT

      )`, []
    );
    // Crear tabla usuarios con campo de rol
    await this.dbInstance.executeSql(
      `CREATE TABLE IF NOT EXISTS duelos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_torneo INTEGER NOT NULL,
        ronda INTEGER NOT NULL,
        id_jugador1 INTEGER NOT NULL,  -- Referencia al id del jugador 1
        id_jugador2 INTEGER NOT NULL,  -- Referencia al id del jugador 2
        estado_jugador1 TEXT DEFAULT 'pendiente',  -- pendiente, ganó, perdió
        estado_jugador2 TEXT DEFAULT 'pendiente',  -- pendiente, ganó, perdió
        ganador INTEGER,  -- ID del ganador
        FOREIGN KEY (id_torneo) REFERENCES torneos (id),
        FOREIGN KEY (id_jugador1) REFERENCES usuarios (id),
        FOREIGN KEY (id_jugador2) REFERENCES usuarios (id),
        FOREIGN KEY (ganador) REFERENCES usuarios (id)  -- Relacionamos al ganador con un usuario
      )`, []
    );
    

    // Insertar un usuario administrador por defecto (si no existe)
    await this.dbInstance.executeSql(
      `INSERT OR IGNORE INTO usuarios (id, pnombre, papellido, nickname, correo, contrasena, fechaNacimiento, pais, rol, imagen_user)
       VALUES (1, 'Elmo', 'Admin', 'ElmoAdmin', 'al.barreras@gmail.com', 'elmomota770', '2000-01-01', 'Pais1', 1, ''),
              (2, 'Srchito', 'Admin', 'SrchitoAdmin', 'srchitita@gmail.com', 'Srchito123', '2000-01-02', 'Pais2', 1 , '')`, []
    );

    // Crear tabla juegos con clave primaria
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

    // Crear tabla torneos con dependencia de la tabla juegos
    await this.dbInstance.executeSql(
      `CREATE TABLE IF NOT EXISTS torneos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        juegoId INTEGER,
        estado TEXT,
        numEquipos INTEGER,
        fechaInicio TEXT,
        imagen TEXT,
        rondas INTEGER,
        creadorId INTEGER,
        FOREIGN KEY(juegoId) REFERENCES juegos(id) ON DELETE CASCADE,
        FOREIGN KEY(creadorId) REFERENCES usuarios(id) ON DELETE CASCADE
      )`, []
    );

    // Crear tabla inscripción de torneo con dependencias
    await this.dbInstance.executeSql(`
      CREATE TABLE IF NOT EXISTS inscripcion_torneo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_torneo INTEGER,
        id_usuario INTEGER,
        nombre TEXT,
        apellido TEXT,
        nickname TEXT,
        correo TEXT,
        FOREIGN KEY (id_torneo) REFERENCES torneos(id) ON DELETE CASCADE,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
      );
    `, []);

    // Insertar juegos por defecto
    await this.dbInstance.executeSql(
      `INSERT OR IGNORE INTO juegos (id, nombre, tipo, descripcion, logo, cabecera) VALUES 
        (1, 'Valorant', 'Shooter', 'Juego de disparos táctico en primera persona.', 'https://www.lavanguardia.com/files/image_990_484/uploads/2020/06/02/5fa91dbc37517.png', 'https://www.lavanguardia.com/files/image_990_484/uploads/2020/06/02/5fa91dbc37517.png'),
        (2, 'League of Legends', 'MOBA', 'Juego de estrategia y combate por equipos.', 'assets/logos/logo-leagu-of-legends.jpg', 'assets/img/imagen-league-of-legends.jpg'),
        (3, 'Fortnite', 'Battle Royale', 'Juego de supervivencia en un entorno de batalla masiva.', 'assets/logos/logo-fortnite.jpg', 'assets/img/imagen-fortnite.jpg'),
        (4, 'Street Fighter', 'Pelea', 'Juego de lucha con personajes emblemáticos.', 'assets/logos/logo-street-fighter.jpg', 'assets/img/imagen-street-fighter.jpg')`, []
    );











    await this.dbInstance.executeSql(
      `CREATE TABLE IF NOT EXISTS preguntas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pregunta TEXT
      )`, []
    );

    // Insertar pregunta por defecto
    await this.dbInstance.executeSql(
      `INSERT OR IGNORE INTO preguntas (id, pregunta) VALUES 
        (1, '¿Cuál es el nombre de tu primera mascota?' ),
        (2, '¿En qué ciudad naciste?' ),
        (3, '¿Cuál es tu comida favorita?' ),
        (4, '¿Cuál fue tu primer trabajo?' ),
        (5, '¿Cómo se llama tu mejor amigo?' )`, []
    );

    // Crear tabla respuestas de seguridad
    await this.dbInstance.executeSql(
      `CREATE TABLE IF NOT EXISTS respuestas_seguridad (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        preguntaId INTEGER,
        usuarioId INTEGER,
        respuesta TEXT,
        FOREIGN KEY (preguntaId) REFERENCES preguntas(id) ON DELETE CASCADE,
        FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
      )`, []
    );

    // Mostrar mensaje de bienvenida
    console.log('Bienvenido a', 'BATTLE ZONE');

    // Cargar datos
    this.selectTorneos();
    this.selectJuegosMenu();
    this.selectUsuarios();

  } catch (error) {
    // Mostrar alerta en caso de error
    console.error('Creación de Tablas', 'Error: ' + JSON.stringify(error));
  }
}




///////////////////LOGICA TORNEOS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// LOGICA TORNEOS


async crearDuelo(duelo: any) {
  const query = `
    INSERT INTO duelos (id_torneo, id_jugador1, id_jugador2, ronda) 
    VALUES (?, ?, ?, ?)
  `;
  const values = [duelo.id_torneo, duelo.id_jugador1, duelo.id_jugador2, duelo.ronda];

  try {
    await this.dbInstance.executeSql(query, values);
    console.log('Duelo creado:', duelo);
  } catch (error) {
    console.error('Error al crear el duelo:', error);
  }
}


async eliminarJugadorPerdedor(nickname: string) {
  const query = `
    DELETE FROM user_torneo 
    WHERE nickname = ?
  `;
  try {
    await this.dbInstance.executeSql(query, [nickname]);
    console.log('Jugador eliminado:', nickname);
  } catch (error) {
    console.error('Error al eliminar jugador:', error);
  }
}








async insertarDueloConUsuario(idTorneo: number, ronda: number, jugador1: number, jugador2: number | null = null): Promise<void> {
  if (!this.dbInstance) {
    console.error('La base de datos no está inicializada.');
    return;
  }

  try {
    // Asegúrate de que los parámetros sean números (ID de los jugadores)
    const query = `
      INSERT INTO duelos (id_torneo, ronda, id_jugador1, id_jugador2) 
      VALUES (?, ?, ?, ?);
    `;
    
    // Ejecuta la consulta con los valores correspondientes
    await this.dbInstance.executeSql(query, [idTorneo, ronda, jugador1, jugador2]);

    // Muestra la alerta de éxito
    this.presentAlert('Éxito', 'El duelo ha sido agregado correctamente.');
  } catch (error) {
    // Muestra la alerta de error si algo falla
    this.presentAlert('Error', 'No se pudo agregar el duelo: ' + JSON.stringify(error));
    console.error('Error al insertar duelo:', error);
  }
}












////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////SELECT////////////////////////////

async getPreguntasSeguridad(usuarioId: number): Promise<string[]> {
  const result = await this.dbInstance.executeSql(
    `SELECT p.pregunta FROM respuestas_seguridad rs
     JOIN preguntas p ON rs.preguntaId = p.id
     WHERE rs.usuarioId = ?`,
    [usuarioId]
  );

  const preguntas: string[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    preguntas.push(result.rows.item(i).pregunta);
  }

  return preguntas;
}

async validarRespuestaSeguridad(
  usuarioId: number,
  pregunta: string,
  respuesta: string
): Promise<boolean> {
  const result = await this.dbInstance.executeSql(
    `SELECT * FROM respuestas_seguridad rs
     JOIN preguntas p ON rs.preguntaId = p.id
     WHERE rs.usuarioId = ? AND p.pregunta = ? AND rs.respuesta = ?`,
    [usuarioId, pregunta, respuesta]
  );

  return result.rows.length > 0;
}







async selectUsuarios() {
  if (!this.dbInstance) {
    console.error('La instancia de la base de datos no está lista.');
    return;
  }

  try {
    const res = await this.dbInstance.executeSql(`SELECT * FROM usuarios`, []);
    const items: Usuario[] = [];

    for (let i = 0; i < res.rows.length; i++) {
      const usuario = res.rows.item(i);
      items.push({
        id: usuario.id,
        pnombre: usuario.pnombre,
        papellido: usuario.papellido,
        nickname: usuario.nickname,
        correo: usuario.correo,
        contrasena: usuario.contrasena,
        fechaNacimiento: usuario.fechaNacimiento,
        pais: usuario.pais,
        rol: usuario.rol, // Agregando el campo 'rol' aquí
        imagen_user: usuario.imagen
      });
    }

    this.listaUsuarios.next(items); // Actualizar el observable de usuarios
  } catch (error) {
    this.presentAlert('Error al seleccionar usuarios', `Error: ${JSON.stringify(error)}`);
  }
}

  
async selectJuegos(): Promise<Juego[]> {
  if (!this.dbInstance) {
    console.error('La instancia de la base de datos no está lista.');
    return [];
  }

  try {
    const res = await this.dbInstance.executeSql(`SELECT * FROM juegos`, []);
    const items: Juego[] = [];

    for (let i = 0; i < res.rows.length; i++) {
      const juego = res.rows.item(i);
      items.push({ ...juego });
    }

    // Devolver la lista de juegos
    return items;
  } catch (error) {
    this.presentAlert('Error al seleccionar juegos', `Error: ${JSON.stringify(error)}`);
    return [];
  }
}
async selectJuegosMenu() {
  if (!this.dbInstance) {
    console.error('La instancia de la base de datos no está lista.');
    return;
  }

  try {
    const res = await this.dbInstance.executeSql(`SELECT * FROM juegos`, []);
    const items: Juego[] = [];

    for (let i = 0; i < res.rows.length; i++) {
      const juego = res.rows.item(i);
      items.push({ ...juego });
    }

    this.listaJuegos.next(items); // Actualizar el observable de juegos
  } catch (error) {
    this.presentAlert('Error al seleccionar juegos', `Error: ${JSON.stringify(error)}`);
  }
}



selectTorneos() {
  return this.dbInstance!.executeSql(`
      SELECT t.*, 
            a.pnombre || ' ' || a.papellido AS creadorNombre, 
            j.nombre AS juegoNombre
      FROM torneos t 
      JOIN usuarios a ON t.creadorId = a.id
      JOIN juegos j ON t.juegoId = j.id


  `, []).then(res => {
    let items: Torneo[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      let torneo = res.rows.item(i);
      items.push({
        ...torneo,
        creadorNombre: torneo.creadorNombre,
        juegoNombre: torneo.juegoNombre // Agregar el nombre del juego
      });
    }
    this.listaTorneos.next(items);
  }).catch(e => {
    this.presentAlert('Error al seleccionar torneos', JSON.stringify(e));
  });
}



  async loginUsuario(identificador: string, contrasena: string): Promise<Usuario | null> {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return null;
    }
  

    // Modifica la consulta SQL para buscar tanto por correo como por nickname
    const query = `SELECT * FROM usuarios WHERE (correo = ? OR nickname = ?) AND contrasena = ?`;
  
    try {
      const result = await this.dbInstance.executeSql(query, [identificador, identificador, contrasena]);
  
      if (result.rows.length > 0) {
        // Devuelve el usuario encontrado, transformando el resultado para que coincida con la clase Usuario
        return {
          id: result.rows.item(0).id,
          pnombre: result.rows.item(0).pnombre,
          papellido: result.rows.item(0).papellido,
          nickname: result.rows.item(0).nickname,
          correo: result.rows.item(0).correo,
          contrasena: result.rows.item(0).contrasena,
          fechaNacimiento: result.rows.item(0).fechaNacimiento,
          pais: result.rows.item(0).pais,
          rol: result.rows.item(0).rol,
          imagen_user:result.rows.item(0).imagen
        };
      } else {
        return null; // Credenciales incorrectas
      }
    } catch (error) {
      console.error('Error al realizar el login:', error);
      return null; // Manejo de errores: retornar null en caso de error
    }
  }
  
  
  async verificarContrasenaActual(idUsuario: number, contrasena: string): Promise<boolean> {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return false;
    }
  
    const query = `SELECT * FROM usuarios WHERE id = ? AND contrasena = ?`;
  
    try {
      const result = await this.dbInstance.executeSql(query, [idUsuario, contrasena]);
      return result.rows.length > 0; // Si existe al menos un resultado, la contraseña es válida
    } catch (error) {
      console.error('Error al verificar la contraseña actual:', error);
      return false;
    }
  }
  
  
  getUsuarioByCorreo(correo: string): Promise<any> {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return Promise.reject('DB no inicializada'); // Retorna una promesa rechazada si no hay instancia
    }
  
    const query = `SELECT * FROM usuarios WHERE correo = ?`;
  
    return this.dbInstance.executeSql(query, [correo]).then(res => {
      if (res.rows.length > 0) {
        // Incluye el campo 'rol' en el objeto de usuario retornado
        return {
          id: res.rows.item(0).id,
          pnombre: res.rows.item(0).pnombre,
          papellido: res.rows.item(0).papellido,
          nickname: res.rows.item(0).nickname,
          correo: res.rows.item(0).correo,
          contrasena: res.rows.item(0).contrasena,
          fechaNacimiento: res.rows.item(0).fechaNacimiento,
          pais: res.rows.item(0).pais,
          rol: res.rows.item(0).rol ,// Nuevo campo 'rol',
          imagen:res.rows.item(0).imagen

        };
      } else {
        return null; // Retorna null si no se encuentra el usuario
      }
    }).catch(e => {
      console.error('Error al buscar usuario', e);
      return null; // Retorna null en caso de error
    });
  }
  




async verificarInscripcion(id_torneo: number, id_usuario: number): Promise<boolean> {

  try {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos es nula');
      return false; // Retorna false si la instancia es nula
    }

    const query = 'SELECT * FROM inscripciones WHERE id_torneo = ? AND id_usuario = ?';
    const result = await this.dbInstance.executeSql(query, [id_torneo, id_usuario]);

    // Si hay resultados, significa que ya está inscrito
    return result.rows.length > 0;
    
  } catch (error) {
    console.error('Error al verificar inscripción:', error);
    return false; // En caso de error, asumimos que no está inscrito
  }
}




async obtenerTorneosInscritos(id_usuario: number): Promise<any[]> {
  if (!this.dbInstance) {
    console.error('La instancia de la base de datos es nula');
    return [];
  }

  const query = `
    SELECT t.* 
    FROM torneos t
    JOIN inscripcion_torneo i ON t.id = i.id_torneo
    WHERE i.id_usuario = ?`;

  try {
    const result = await this.dbInstance.executeSql(query, [id_usuario]);
    const torneos = [];
    for (let i = 0; i < result.rows.length; i++) {
      torneos.push(result.rows.item(i));
    }
    return torneos;
  } catch (error) {
    console.error('Error al obtener torneos inscritos:', error);
    return [];
  }
}









async verificarInscripcionPorCorreoYNickname(idTorneo: number, correo: string, nickname: string): Promise<boolean> {

  const query = `SELECT COUNT(*) as count FROM inscripcion_torneo WHERE id_torneo = ? AND (correo = ? OR nickname = ?)`;

  // Ejecutar la consulta y obtener el resultado
  const result = await this.dbInstance?.executeSql(query, [idTorneo, correo, nickname]);

  // Verificar si result y result.rows existen
  return result?.rows.length > 0 && result.rows.item(0).count > 0;
}











async obtenerUsuariosInscritos(id_torneo: number): Promise<any[]> {
  if (!this.dbInstance) {
    console.error('La instancia de la base de datos es nula');
    return [];
  }

  const query = `SELECT u.* FROM usuarios u JOIN inscripcion_torneo i ON u.id = i.id_usuario WHERE i.id_torneo = ?`;
  try {
    const result = await this.dbInstance.executeSql(query, [id_torneo]);
    const usuarios = [];
    for (let i = 0; i < result.rows.length; i++) {
      usuarios.push(result.rows.item(i));
    }
    return usuarios;
  } catch (error) {
    console.error('Error al obtener usuarios inscritos:', error);
    return [];
  }
}




async getPreguntas(): Promise<Preguntas[]> {
  if (!this.dbInstance) {
    console.error('La instancia de la base de datos es nula');
    return [];
  }
  try {
    const res = await this.dbInstance.executeSql(`SELECT * FROM preguntas`, []);
    const preguntas: Preguntas[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      preguntas.push({
        id: res.rows.item(i).id,
        pregunta: res.rows.item(i).pregunta
      });
    }
    return preguntas;
  } catch (error) {
    console.error('Error al obtener preguntas de seguridad:', error);
    return [];
  }
}


async obtenerDuelosPorTorneo(id_torneo: number): Promise<Duelo[]> {
  const query = 'SELECT * FROM duelos WHERE id_torneo = ? ORDER BY ronda, id';
  const resultados = await this.dbInstance.executeSql(query, [id_torneo]);
  const duelos: Duelo[] = [];
  for (let i = 0; i < resultados.rows.length; i++) {
      duelos.push(resultados.rows.item(i));
  }
  return duelos;
}
async obtenerDuelosDelUsuario(idTorneo: number, idUsuario: number) {
  try {
    const query = `
      SELECT * FROM duelos 
      WHERE id_torneo = ? 
      AND (id_jugador1 = ? OR id_jugador2 = ?)
    `;
    const result = await this.dbInstance.executeSql(query, [idTorneo, idUsuario, idUsuario]);
    
    const duelos = [];
    for (let i = 0; i < result.rows.length; i++) {
      duelos.push(result.rows.item(i));
    }
    return duelos;
  } catch (error) {
    console.error('Error al obtener los duelos:', error);
    throw error;
  }
}



































/////////////////////////////////////////////INSERT///////////////////////////////////////////////////////
async insertarDuelo(duelos: Duelo | Duelo[]): Promise<void> {
  if (!this.dbInstance) {
    console.error('La instancia de la base de datos no está lista.');
    return;
  }

  const duelosArray = Array.isArray(duelos) ? duelos : [duelos];
  const sql = `
    INSERT INTO duelo (id_torneo, ronda, jugador1, jugador2, estado_jugador1, estado_jugador2, ganador)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    for (const duelo of duelosArray) {
      const values = [
        duelo.id_torneo,
        duelo.ronda,
        duelo.id_jugador1,  // Cambié a 'id_jugador1'
        duelo.id_jugador2,  // Cambié a 'id_jugador2'
        duelo.estado_jugador1,
        duelo.estado_jugador2,
        duelo.ganador,
      ];
      console.log('Insertando duelo con valores:', values);
      await this.dbInstance.executeSql(sql, values);
    }
    console.log('Duelos insertados correctamente');
  } catch (error) {
    console.error('Error al insertar duelo:', error);
  }
}






async addRespuesta(preguntaId: number, usuarioId: number, respuesta: string): Promise<void> {
  if (!this.dbInstance) {
    console.error('La instancia de la base de datos no está lista.');
    return;
  }
  try {
    await this.dbInstance.executeSql(
      `INSERT INTO respuestas_seguridad (preguntaId, usuarioId, respuesta) VALUES (?, ?, ?)`,
      [preguntaId, usuarioId, respuesta]
    );
    console.log('Respuesta de seguridad agregada correctamente');
  } catch (error) {
    console.error('Error al agregar respuesta de seguridad:', error);
  }
}





async addTorneo(torneo: Torneo, adminId: number) {
  if (!this.dbInstance) {
    console.error('La instancia de la base de datos no está lista.');
    return;
  }

  const sql = `INSERT INTO torneos (nombre, juegoId, estado, numEquipos, fechaInicio, imagen, rondas, creadorId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [torneo.nombre, torneo.juegoId, torneo.estado, torneo.numEquipos, torneo.fechaInicio, torneo.imagen,torneo.rondas, adminId];
  
  try {
    console.log('Insertando torneo con valores:', values);
    await this.dbInstance.executeSql(sql, values);
    this.selectTorneos();
  } catch (error) {
    this.presentAlert('Error al añadir torneo', JSON.stringify(error));
  }
}


  async addUsuario(nuevoUsuario: Usuario): Promise<number | undefined> {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return undefined;
    }
  
    const sql = `INSERT INTO usuarios (pnombre, papellido, nickname, correo, contrasena, fechaNacimiento, pais, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      nuevoUsuario.pnombre,
      nuevoUsuario.papellido,
      nuevoUsuario.nickname,
      nuevoUsuario.correo,
      nuevoUsuario.contrasena,
      nuevoUsuario.fechaNacimiento,
      nuevoUsuario.pais,
      nuevoUsuario.rol || 2 // Asume rol 2 como valor predeterminado si no se proporciona
    ];
  
    try {
      const result = await this.dbInstance.executeSql(sql, values);
      const usuarioId = result.insertId; // Captura el ID del usuario insertado
      this.selectUsuarios(); // Refrescar la lista de usuarios después de insertar
      this.presentAlert('Usuario Añadido', 'El usuario ha sido registrado exitosamente.');
      return usuarioId;
    } catch (error) {
      this.presentAlert('Error al añadir usuario', JSON.stringify(error));
      return undefined;
    }
  }
  

  async inscribirTorneo(inscripcion: UserTorneo): Promise<void> {
    if (!this.dbInstance) {
      throw new Error('Database instance is not initialized.');
    }

    const query = `INSERT INTO inscripcion_torneo (id_torneo, id_usuario, nombre, apellido, nickname, correo) VALUES (?, ?, ?, ?, ?, ?);`;
    const values = [inscripcion.id_torneo,inscripcion.id_usuario,inscripcion.nombre,inscripcion.apellido,inscripcion.nickname,inscripcion.correo];

    await this.dbInstance.executeSql(query, values);
  }

  async addRespuestaSeguridad(preguntaId: number, usuarioId: number, respuesta: string) {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }
    const query = `
      INSERT INTO respuestas_seguridad (preguntaId, usuarioId, respuesta) VALUES (?, ?, ?)
    `;
    const values = [preguntaId, usuarioId, respuesta];
  
    try {
      await this.dbInstance.executeSql(query, values);
      console.log('Respuesta de seguridad almacenada');
    } catch (error) {
      console.error('Error al almacenar la respuesta de seguridad:', error);
    }
  }
  














////////////////////////////////////////DELETE/////////////////////////////////////




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
  
  async eliminarInscripcionesPorTorneo(id_torneo: number): Promise<void> {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }
  
    const sql = 'DELETE FROM inscripcion_torneo WHERE id_torneo = ?';
    await this.dbInstance.executeSql(sql, [id_torneo]);
  }
  




















///////////////////////////////////////////////UPDATE///////////////////////////////////////7



async actualizarDuelo(duelo: Duelo): Promise<void> {
  if (!this.dbInstance) {
    console.error('La instancia de la base de datos no está lista.');
    return;
  }

  const sql = `
    UPDATE duelos
    SET estado_jugador1 = ?, estado_jugador2 = ?, ganador = ?
    WHERE id_torneo = ? AND ronda = ? AND id_jugador1 = ? AND id_jugador2 = ?
  `;

  const values = [
    duelo.estado_jugador1,  // Estado del jugador 1
    duelo.estado_jugador2,  // Estado del jugador 2
    duelo.ganador,  // ID del ganador
    duelo.id_torneo,  // ID del torneo
    duelo.ronda,  // Ronda del duelo
    duelo.id_jugador1,  // ID del jugador 1
    duelo.id_jugador2,  // ID del jugador 2
  ];

  try {
    console.log('Actualizando duelo con valores:', values);
    await this.dbInstance.executeSql(sql, values);
    console.log('Duelo actualizado correctamente');
    // Realiza alguna acción si es necesario, por ejemplo, notificar al usuario
  } catch (error) {
    console.error('Error al actualizar duelo:', error);
  }
}





  async actualizarTorneo(torneo: Torneo) {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }

    const sql = `UPDATE torneos SET nombre = ?, juegoId = ?, estado = ?, numEquipos = ?, fechaInicio = ?, imagen = ?, rondas = ? WHERE id = ?`;
    const values = [torneo.nombre, torneo.juegoId, torneo.estado, torneo.numEquipos, torneo.fechaInicio, torneo.imagen, torneo.rondas, torneo.id];
    try {
      await this.dbInstance.executeSql(sql, values);
      await this.torneoService.notificarTorneoActualizado();
      this.selectTorneos(); // Actualizar datos
    } catch (error) {
      this.presentAlert('Error al actualizar torneo', JSON.stringify(error));
    }
  }




  async actualizarUsuario(usuario: Usuario) {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }
  
    // Verifica que el usuario tiene un ID válido
    if (!usuario.id) {
      console.error('El usuario no tiene un ID válido.');
      return;
    }
  
    // Consulta SQL para actualizar los datos del usuario
    const sql = `UPDATE usuarios SET pnombre = ?, papellido = ?, nickname = ?, correo = ?, fechaNacimiento = ?, pais = ? WHERE id = ?`;
    const values = [
      usuario.pnombre,
      usuario.papellido,
      usuario.nickname,
      usuario.correo,
      usuario.fechaNacimiento,
      usuario.pais,
      usuario.id,
    ];
  
    try {
      await this.dbInstance.executeSql(sql, values);
      console.log('Usuario actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error;  // Lanzamos el error para que sea capturado por el componente
    }
  }
  async actualizarUsuarioContra(usuario: Usuario): Promise<void> {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos es nula');
      return;
    }
    try {
      const sql = `UPDATE usuarios SET contrasena = ? WHERE id = ?`;
      const params = [usuario.contrasena, usuario.id];
      await this.dbInstance.executeSql(sql, params);
      console.log('Contraseña actualizada exitosamente.');
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      throw error;
    }
  }
  




  async actualizarUsuarioPerfil(usuario: Usuario) {
    if (!this.dbInstance) {
      console.error('La instancia de la base de datos no está lista.');
      return;
    }

  
    // Asegúrate de que la consulta no intente actualizar el ID
    const sql = `UPDATE usuarios SET pnombre = ?, papellido = ?, nickname = ?, correo = ?, fechaNacimiento = ?, pais = ? WHERE id = ?`;
    const values = [usuario.pnombre, usuario.papellido, usuario.nickname, usuario.correo, usuario.fechaNacimiento, usuario.pais, usuario.id];
  
    try {
      await this.dbInstance.executeSql(sql, values);
    } catch (error) {
      this.presentAlert('Error al actualizar al Usuario', JSON.stringify(error));
    }
  }




  

  actualizarFotoUsuario(id_usuario: number, foto: string) {
    const query = `UPDATE usuarios SET imagen_user = ? WHERE id_usuario = ?`;
    return this.dbInstance.executeSql(query, [foto, id_usuario])
      .then(() =>    console.log('Foto actualizada correctamente'))
      .catch(e => console.error('Error al actualizar la foto', e));
  }




  
}  