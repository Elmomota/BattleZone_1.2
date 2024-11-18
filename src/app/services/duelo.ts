export class Duelo {
    id?: number;
    id_torneo?: number;
    ronda!: number;
    jugador1!: string;
    jugador2!: string | null; // Puede ser null si es un BYE
    estado_jugador1!: string; // 'pendiente', 'ganó', 'perdió'
    estado_jugador2!: string | null; // 'pendiente', 'ganó', 'perdió'
    ganador?: string | null; // nickname del ganador
  }
  