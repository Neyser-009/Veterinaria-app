import Model from "./model.js";

export default class Mascota extends Model {
  table = "mascotas";
  constructor(nombre, tipo, raza, edad, dueno) {
    super();
    this.id = Date.now();
    this.nombre = nombre;
    this.tipo = tipo;
    this.raza = raza;
    this.edad = edad;
    this.dueno = dueno;
  }
}
