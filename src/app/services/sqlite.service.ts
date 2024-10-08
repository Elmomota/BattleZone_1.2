
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Torneo } from './torneo';
import { Administracion } from './administracion';
import { TorneoService } from './torneo-service.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private dbInstance: SQLiteObject | null = null;

  constructor(private sqlite: SQLite, private torneoService: TorneoService) {}
//====================================================CREACION DE TABLAS====================================================
  async initDB() {
    try {
      this.dbInstance = await this.sqlite.create({
        name: 'torneos.db',
        location: 'default'
      });

      // Habilitar claves foráneas
      await this.dbInstance.executeSql('PRAGMA foreign_keys = ON;', []);

      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS torneos (
          id INTEGER PRIMARY KEY,
          nombre TEXT,
          juego TEXT,
          estado TEXT,
          numEquipos INTEGER,
          fechaInicio TEXT,
          imagen TEXT,
          creadorId INTEGER,
          FOREIGN KEY(creadorId) REFERENCES administradores(id)
        )
      `, []);

      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS administradores (
          id INTEGER PRIMARY KEY,
          nombre TEXT,
          correo TEXT,
          contraseña TEXT
        )
      `, []);
    } catch (error) {
      console.error('Error creating database', error);
    }
  }
  //====================================================FIN DE CERACION DE TABLAS====================================================



  //====================================================INICIO DE ADMINISTRACION====================================================

  async addAdministrador(admin: Administracion): Promise<number> {
    const salt = await bcrypt.genSalt(10);
    admin.contraseña = await bcrypt.hash(admin.contraseña, salt);
    
    if (this.dbInstance) {
      const sql = `INSERT INTO administradores (nombre, correo, contraseña) VALUES (?, ?, ?)`;
      const values = [admin.nombre, admin.correo, admin.contraseña];
      const res = await this.dbInstance.executeSql(sql, values);
      return res.insertId;  // Retorna el id del administrador recién creado
    } else {
      throw new Error('Database is not initialized');
    }
  }
  async getAdminByEmail(correo: string): Promise<Administracion | null> {
    if (this.dbInstance) {
      const res = await this.dbInstance.executeSql(`SELECT * FROM administradores WHERE correo = ?`, [correo]);
      if (res.rows.length > 0) {
        const admin = res.rows.item(0);
        return {
          id: admin.id,
          nombre: admin.nombre,
          correo: admin.correo,
          contraseña: admin.contraseña
        };
      } else {
        return null;  // No se encontró un administrador con ese correo
      }
    } else {
      throw new Error('Database is not initialized');
    }
  }

  async addTorneo(torneo: Torneo, adminId: number) {
    if (this.dbInstance) {
      const sql = `INSERT INTO torneos (nombre, juego, estado, numEquipos, fechaInicio, imagen, creadorId) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [torneo.nombre, torneo.juego, torneo.estado, torneo.numEquipos, torneo.fechaInicio, torneo.imagen, adminId];
      await this.dbInstance.executeSql(sql, values);
      await this.torneoService.notificarTorneoAgregado();  // Esperar la notificación
    } else {
      throw new Error('Database is not initialized');
    }
  }

  async getTorneos(): Promise<Torneo[]> {
    if (this.dbInstance) {
      const res = await this.dbInstance.executeSql(`
        SELECT t.*, a.nombre AS creadorNombre 
        FROM torneos t 
        JOIN administradores a ON t.creadorId = a.id
      `, []);
      const torneos: Torneo[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        const torneo = res.rows.item(i);
        torneos.push({
          ...torneo,
          creadorNombre: torneo.creadorNombre, // Asignar el nombre del creador
        });
      }
      return torneos;
    } else {
      throw new Error('Database is not initialized');
    }
  }
  

  async actualizarTorneo(torneo: Torneo): Promise<void> {
    if (this.dbInstance) {
      const sql = `UPDATE torneos SET nombre = ?, juego = ?, estado = ?, numEquipos = ?, fechaInicio = ?, imagen = ? WHERE id = ?`;
      const values = [torneo.nombre, torneo.juego, torneo.estado, torneo.numEquipos, torneo.fechaInicio, torneo.imagen, torneo.id];
      await this.dbInstance.executeSql(sql, values);
      await this.torneoService.notificarTorneoActualizado();
    } else {
      throw new Error('Database is not initialized');
    }
  }

  async eliminarTorneo(id: number): Promise<void> {
    if (this.dbInstance) {
      const sql = `DELETE FROM torneos WHERE id = ?`;
      await this.dbInstance.executeSql(sql, [id]);
      await this.torneoService.notificarTorneoEliminado();
    } else {
      throw new Error('Database is not initialized');
    }
  }
}
//====================================================FIN DE ADMINISTRACION====================================================