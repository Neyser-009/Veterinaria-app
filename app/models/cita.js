import Model from "./model.js";

export default class Cita extends Model {
  table = "citas";
  constructor(mascota, dueno, fecha, hora, motivo, estado) {
    super();
    this.id = Date.now();
    this.mascota = mascota;
    this.dueno = dueno;
    this.fecha = fecha;
    this.hora = hora;
    this.motivo = motivo;
    this.estado = estado;
  }
}
