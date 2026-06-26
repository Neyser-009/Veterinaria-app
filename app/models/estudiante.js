import Persona from "./persona.js";
export default class Estudiante extends Persona {
  table = "estudiantes";
  constructor(nombre, edad, sexo, carrera) {
    super(nombre, edad, sexo, carrera);
    this.id = Date.now();
    this.nombre = nombre;
    this.edad = edad;
    this.sexo = sexo;
    this.carrera = carrera;
  }
}
