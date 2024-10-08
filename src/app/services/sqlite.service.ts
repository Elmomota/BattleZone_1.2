import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Torneo } from './torneo';
import { Administracion } from './administracion';
import { TorneoService } from './torneo-service.service';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private dbInstance: SQLiteObject | null = null;

  constructor(private sqlite: SQLite, private torneoService: TorneoService) {}

  async initDB() {
    try {
      this.dbInstance = await this.sqlite.create({
        name: 'torneos.db',
        location: 'default'
      });

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
          contrasena TEXT  
        )
      `, []);
      
      // Inserción de administrador predeterminado con nombre de columna corregido
      await this.dbInstance.executeSql(`
        INSERT OR IGNORE INTO administradores (nombre, correo, contrasena)
        VALUES ('elmomota', 'elmoadicto770@gmail.com', 'elmo2003*')
      `, []);
    
      console.log('Base de datos y tablas creadas correctamente');

    } catch (error) {
      console.error('Error creando la base de datos:', error);
    }
  }

  async addAdministrador(admin: Administracion): Promise<number> {
    if (this.dbInstance) {
      const sql = `INSERT INTO administradores (nombre, correo, contrasena) VALUES (?, ?, ?)`; // Corregido "contraseña" a "contrasena"
      const values = [admin.nombre, admin.correo, admin.contrasena];
      try {
        const res = await this.dbInstance.executeSql(sql, values);
        console.log('Administrador añadido con ID:', res.insertId);
        return res.insertId;
      } catch (error) {
        console.error('Error añadiendo administrador:', error);
        throw error;
      }
    } else {
      throw new Error('Database is not initialized');
    }
  }

  async getAdminByEmail(correo: string): Promise<Administracion | null> {
    if (this.dbInstance) {
      console.log('Buscando administrador con correo:', correo);
      try {
        const res = await this.dbInstance.executeSql(`SELECT * FROM administradores WHERE correo = ?`, [correo]);
        console.log('Resultados obtenidos:', res.rows.length);
        
        if (res.rows.length > 0) {
          const admin = res.rows.item(0);
          console.log('Administrador encontrado:', admin);
          return {
            id: admin.id,
            nombre: admin.nombre,
            correo: admin.correo,
            contrasena: admin.contrasena  // Sin tilde
          };
        } else {
          console.log('No se encontró un administrador con ese correo');
          return null;
        }
      } catch (error) {
        console.error('Error al buscar administrador por correo:', error);
        throw error;
      }
    } else {
      throw new Error('Database is not initialized');
    }
  }

  async getAdminByName(nombre: string): Promise<Administracion | null> {
    if (this.dbInstance) {
      console.log('Buscando administrador con nombre:', nombre);
      try {
        const res = await this.dbInstance.executeSql(`SELECT * FROM administradores WHERE nombre = ?`, [nombre]);
        console.log('Resultados obtenidos:', res.rows.length);
        
        if (res.rows.length > 0) {
          const admin = res.rows.item(0);
          console.log('Administrador encontrado:', admin);
          return {
            id: admin.id,
            nombre: admin.nombre,
            correo: admin.correo,
            contrasena: admin.contrasena  // Sin tilde
          };
        } else {
          console.log('No se encontró un administrador con ese nombre');
          return null;
        }
      } catch (error) {
        console.error('Error al buscar administrador por nombre:', error);
        throw error;
      }
    } else {
      throw new Error('Database is not initialized');
    }
  }

  async addTorneo(torneo: Torneo, adminId: number) {
    if (this.dbInstance) {
      const sql = `INSERT INTO torneos (nombre, juego, estado, numEquipos, fechaInicio, imagen, creadorId) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [torneo.nombre, torneo.juego, torneo.estado, torneo.numEquipos, torneo.fechaInicio, torneo.imagen, adminId];
      try {
        await this.dbInstance.executeSql(sql, values);
        await this.torneoService.notificarTorneoAgregado();
      } catch (error) {
        console.error('Error al añadir torneo:', error);
        throw error;
      }
    } else {
      throw new Error('Database is not initialized');
    }
  }

  async getTorneos(): Promise<Torneo[]> {
    if (this.dbInstance) {
      try {
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
            creadorNombre: torneo.creadorNombre,
          });
        }
        return torneos;
      } catch (error) {
        console.error('Error al obtener torneos:', error);
        throw error;
      }
    } else {
      throw new Error('Database is not initialized');
    }
  }

  async actualizarTorneo(torneo: Torneo): Promise<void> {
    if (this.dbInstance) {
      const sql = `UPDATE torneos SET nombre = ?, juego = ?, estado = ?, numEquipos = ?, fechaInicio = ?, imagen = ? WHERE id = ?`;
      const values = [torneo.nombre, torneo.juego, torneo.estado, torneo.numEquipos, torneo.fechaInicio, torneo.imagen, torneo.id];
      try {
        await this.dbInstance.executeSql(sql, values);
        await this.torneoService.notificarTorneoActualizado();
      } catch (error) {
        console.error('Error al actualizar torneo:', error);
        throw error;
      }
    } else {
      throw new Error('Database is not initialized');
    }
  }

  async eliminarTorneo(id: number): Promise<void> {
    if (this.dbInstance) {
      const sql = `DELETE FROM torneos WHERE id = ?`;
      try {
        await this.dbInstance.executeSql(sql, [id]);
        await this.torneoService.notificarTorneoEliminado();
      } catch (error) {
        console.error('Error al eliminar torneo:', error);
        throw error;
      }
    } else {
      throw new Error('Database is not initialized');
    }
  }
}
