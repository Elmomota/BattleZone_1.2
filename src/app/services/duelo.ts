export class Duelo {
  id?: number;
  id_torneo?: number;
  ronda!: number;
  id_jugador1!: number;  // ID del jugador 1
  id_jugador2!: number | null;  // ID del jugador 2, puede ser null si es un BYE
  estado_jugador1!: string;  // 'pendiente', 'ganó', 'perdió'
  estado_jugador2!: string;  // 'pendiente', 'ganó', 'perdió'
  ganador?: number | null;  // ID del ganador (jugador)
}
