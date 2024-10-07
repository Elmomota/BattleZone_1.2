export class Administracion {
    id?: number;  // El id puede ser opcional
    nombre!: string;
    correo!: string;
    contraseña!: string;  // Asegúrate de encriptar la contraseña
  }