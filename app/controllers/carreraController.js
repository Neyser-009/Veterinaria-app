import inquirer from "inquirer";
import chalk from "chalk";

import Carrera from "../models/carrera.js";

export default class CarreraController {
  opcion = 0;
  opciones = [
    {
      name: "Menu anterior",
      value: 0,
    },
    {
      name: "Mostrar Carreras",
      value: 1,
    },
    {
      name: "Crear Carrera",
      value: 2,
    },
    {
      name: "Editar Carrera",
      value: 3,
    },
    {
      name: "Eliminar Carrera",
      value: 4,
    },
  ];

  constructor(opcion) {
    this.opcion = opcion;
    this.carrera = new Carrera();
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
    console.log(chalk.bgCyan.white("**** Menú de Carreras ****"));
    const setup = await inquirer.prompt([
      {
        type: "select",
        name: "optCarrera",
        message: `¿Qué deseas hacer?`,
        choices: this.opciones,
      },
    ]);

    return setup.optCarrera;
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
    console.log(chalk.bgGreen.white("Creando carrera..."));

    let payload = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: `Ingrese el nombre de la carrera:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "El nombre de la carrera no puede estar vacío.";
          }
          return true;
        },
      },
    ]);

    // Buascar que la carrera no exista;
    const existe = await this.validateCarrera(payload.nombre);
    if (existe) {
      console.log(chalk.bgRed.white("No se puede crear la carrera, ya existe"));
      console.log();
      await this.await();
      return;
    }

    await this.carrera.save({
      table: this.carrera.getTable(),
      id: Date.now(),
      nombre: payload.nombre,
    });

    console.log();
    console.log(chalk.bgGreen.white("Carrera creada exitosamente"));

    await this.await();
  }

  async read() {
    console.log(chalk.bgBlue.white("Mostrando carreras..."));
    console.log();
    const carreras = await this.carrera.load();
    console.table(carreras);
    console.log();
    await this.await();
  }
  update() {
    console.log(chalk.bgYellow.white("Actualizando carrera..."));
  }
  delete() {
    console.log(chalk.bgRed.white("Eliminando carrera..."));
  }

  //Metodo para validar que no exista la carrera
  async validateCarrera(nombre) {
    const carrera = await this.buscarCarrera(nombre);
    if (carrera) {
      return true;
    }
    return false;
  }

  async buscarCarrera(nombre) {
    const carreras = await this.carrera.load();
    const carrera = carreras.find(
      (carrera) =>
        carrera.nombre.toLowerCase().trim() === nombre.toLowerCase().trim(),
    );
    return carrera;
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
