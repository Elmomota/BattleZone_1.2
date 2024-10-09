export class Juego {
    id?: number;  // El id puede ser opcional, ya que al crear un nuevo torneo no tendrá un id
    nombre!: string;
    tipoJugabilidad!: string;
    descripcion!: string;
    logo!: string;
    cabecera!: string;
}
