export class Usuario {
    id?: number;  // El id puede ser opcional, ya que al crear un nuevo torneo no tendrá un id
    nombre!: string;
    correo!: string;
    contrasena!: string;
    fechaNacimiento!: string;
    
}
