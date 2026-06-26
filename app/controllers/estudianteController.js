import inquirer from "inquirer";
import chalk from "chalk";

import Estudiante from "../models/estudiante.js";

export default class EstudianteController {
  opcion = 0;
  opciones = [
    {
      name: "Menu anterior",
      value: 0,
    },
    {
      name: "Mostrar Estudiantes",
      value: 1,
    },
    {
      name: "Crear Estudiante",
      value: 2,
    },
    {
      name: "Editar Estudiante",
      value: 3,
    },
    {
      name: "Eliminar Estudiante",
      value: 4,
    },
  ];

  constructor(opcion) {
    this.opcion = opcion;
    this.estudiante = new Estudiante();
  }

  async await() {
    const setup = await inquirer.prompt([
      {
        type: "input",
        name: "awaitTime",
        message: `Teclee una tecla para continuar...`,
      },
    ]);

    console.log(chalk.bgGray.black(setup.awaitTime));
  }

  async menu() {
    console.clear();
    console.log(chalk.bgCyan.white("**** Menú de Estudiantes ****"));
    const setup = await inquirer.prompt([
      {
        type: "select",
        name: "optEstudiante",
        message: `¿Qué deseas hacer?`,
        choices: this.opciones,
      },
    ]);

    return setup.optEstudiante;
  }

  async validarMenu(opcion) {
    if (opcion == 0) {
      return;
    } else if (opcion == 1) {
      await this.read();
    } else if (opcion == 2) {
      await this.create();
    } else if (opcion == 3) {
      this.update();
    } else if (opcion == 4) {
      this.delete();
    } else {
      console.log(chalk.bgRed.white("Opción no válida"));
    }
  }

  async create() {
    console.clear();
    console.log(chalk.bgGreen.white("Creando estudiante..."));

    let payload = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: `Ingrese el nombre del estudiante:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "El nombre del estudiante no puede estar vacío.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "edad",
        message: `Ingrese la edad del estudiante:`,
        validate: (input) => {
          if (isNaN(input) || input.trim() === "") {
            return "La edad debe ser un número válido.";
          }
          return true;
        },
      },
      {
        type: "select",
        name: "sexo",
        message: `Seleccione el sexo del estudiante:`,
        choices: [
          { name: "Masculino", value: "M" },
          { name: "Femenino", value: "F" },
          { name: "Otro", value: "O" },
        ],
      },
      {
        type: "input",
        name: "carrera",
        message: `Ingrese la carrera del estudiante:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "La carrera no puede estar vacía.";
          }
          return true;
        },
      },
    ]);

    // Buscar que el estudiante no exista
    const existe = await this.validateEstudiante(payload.nombre);
    if (existe) {
      console.log(chalk.bgRed.white("No se puede crear el estudiante, ya existe"));
      console.log();
      await this.await();
      return;
    }

    await this.estudiante.save({
      table: this.estudiante.getTable(),
      id: Date.now(),
      nombre: payload.nombre,
      edad: payload.edad,
      sexo: payload.sexo,
      carrera: payload.carrera,
    });

    console.log();
    console.log(chalk.bgGreen.white("Estudiante creado exitosamente"));

    await this.await();
  }

  async read() {
    console.log(chalk.bgBlue.white("Mostrando estudiantes..."));
    console.log();
    const estudiantes = await this.estudiante.load();
    console.table(estudiantes);
    console.log();
    await this.await();
  }

  update() {
    console.log(chalk.bgYellow.white("Actualizando estudiante..."));
  }

  delete() {
    console.log(chalk.bgRed.white("Eliminando estudiante..."));
  }

  // Método para validar que no exista el estudiante
  async validateEstudiante(nombre) {
    const estudiante = await this.buscarEstudiante(nombre);
    if (estudiante) {
      return true;
    }
    return false;
  }

  async buscarEstudiante(nombre) {
    const estudiantes = await this.estudiante.load();
    const estudiante = estudiantes.find(
      (est) =>
        est.nombre.toLowerCase().trim() === nombre.toLowerCase().trim(),
    );
    return estudiante;
  }

  async init() {
    let opcion;
    do {
      console.clear();
      opcion = await this.menu();
      await this.validarMenu(opcion);
    } while (opcion != 0);
  }
}
