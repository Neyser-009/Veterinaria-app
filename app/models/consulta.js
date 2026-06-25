import Model from "./model.js";

export default class Consulta extends Model {
  table = "consultas";
  constructor(mascota, veterinario, fecha, diagnostico, tratamiento) {
    super();
    this.id = Date.now();
    this.mascota = mascota;
    this.veterinario = veterinario;
    this.fecha = fecha;
    this.diagnostico = diagnostico;
    this.tratamiento = tratamiento;
  }
}
