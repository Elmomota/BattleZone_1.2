export class Torneo {
  id?: number;             // ID del torneo
  nombre!: string;         // Nombre del torneo
  juegoId!: number;        // ID del juego asociado
  estado!: string;         // Estado del torneo
  numEquipos!: number;     // Número de equipos en el torneo
  fechaInicio!: string;    // Fecha de inicio del torneo
  imagen!: string;         // Imagen representativa del torneo
  rondas!: number;
  creadorId!: number;      // ID del creador del torneo
  creadorNombre?: string;  // Nombre del creador del torneo
  juegoNombre?: string;    // Nombre del juego asociado al torneo
}
