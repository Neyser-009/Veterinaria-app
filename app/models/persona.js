import Model from "./model.js";
export default class Persona extends Model {
  table = "personas";
  constructor(nombre, edad, sexo, carrera) {
    super();
    this.id = Date.now();
    this.nombre = nombre;
    this.edad = edad;
    this.sexo = sexo;
    this.carrera = carrera;
  }
}
