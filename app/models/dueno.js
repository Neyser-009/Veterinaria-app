import Model from "./model.js";

export default class Dueno extends Model {
  table = "duenos";
  constructor(nombre, telefono, email) {
    super();
    this.id = Date.now();
    this.nombre = nombre;
    this.telefono = telefono;
    this.email = email;
  }
}
