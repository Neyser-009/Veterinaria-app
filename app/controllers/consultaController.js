import inquirer from "inquirer";
import chalk from "chalk";

import Consulta from "../models/consulta.js";

export default class ConsultaController {
  opcion = 0;
  opciones = [
    {
      name: "🔙 Menú anterior",
      value: 0,
    },
    {
      name: "📋 Mostrar consultas",
      value: 1,
    },
    {
      name: "➕ Registrar consulta",
      value: 2,
    },
  ];

  constructor(opcion) {
    this.opcion = opcion;
    this.consulta = new Consulta();
  }

  async await() {
    const setup = await inquirer.prompt([
      {
        type: "input",
        name: "awaitTime",
        message: `Teclee una tecla para continuar...`,
      },
    ]);

    console.log(chalk.bgCyan.black(setup.awaitTime));
  }

  async menu() {
    console.clear();
    console.log(chalk.bgMagenta.white("**** 🩺 Menú de Consultas ****"));
    const setup = await inquirer.prompt([
      {
        type: "select",
        name: "optConsulta",
        message: `¿Qué deseas hacer?`,
        choices: this.opciones,
      },
    ]);

    return setup.optConsulta;
  }

  async validarMenu(opcion) {
    if (opcion == 0) {
      return;
    } else if (opcion == 1) {
      await this.read();
    } else if (opcion == 2) {
      await this.create();
    } else {
      console.log(chalk.bgRedBright.black("Opción no válida"));
    }
  }

  async create() {
    console.clear();
    console.log(chalk.bgGreenBright.black("🩺 Registrando consulta..."));

    const payload = await inquirer.prompt([
      {
        type: "input",
        name: "mascota",
        message: "Ingrese el nombre de la mascota:",
        validate: (input) => {
          if (input.trim() === "") {
            return "El nombre de la mascota no puede estar vacío.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "veterinario",
        message: "Ingrese el nombre del veterinario:",
        validate: (input) => {
          if (input.trim() === "") {
            return "El veterinario no puede estar vacío.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "fecha",
        message: "Ingrese la fecha de la consulta (DD/MM/AAAA):",
        validate: (input) => {
          if (input.trim() === "") {
            return "La fecha no puede estar vacía.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "diagnostico",
        message: "Ingrese el diagnóstico:",
        validate: (input) => {
          if (input.trim() === "") {
            return "El diagnóstico no puede estar vacío.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "tratamiento",
        message: "Ingrese el tratamiento:",
        validate: (input) => {
          if (input.trim() === "") {
            return "El tratamiento no puede estar vacío.";
          }
          return true;
        },
      },
    ]);

    await this.consulta.save({
      table: this.consulta.getTable(),
      id: Date.now(),
      mascota: payload.mascota,
      veterinario: payload.veterinario,
      fecha: payload.fecha,
      diagnostico: payload.diagnostico,
      tratamiento: payload.tratamiento,
    });
    console.log();
    console.log(chalk.bgGreenBright.black("✔ Consulta registrada exitosamente"));

    await this.await();
  }
  async read() {
    console.log(chalk.bgCyan.white("📋 Mostrando consultas registradas..."));
    console.log();

    const consultas = await this.consulta.load();

    if (consultas.length === 0) {
      console.log(chalk.magenta("No hay consultas registradas aún."));
    } else {
      console.table(consultas);
    }
    console.log();
    await this.await();
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
