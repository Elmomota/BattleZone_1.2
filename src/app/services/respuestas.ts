export class Respuestas {
    id?: number;           // ID de la respuesta (autoincremental)
    preguntaId?: number;    // ID de la pregunta de seguridad seleccionada
    usuarioId?: number;     // ID del usuario al que pertenece la respuesta
    respuesta!: string;     // Respuesta a la pregunta de seguridad
}
