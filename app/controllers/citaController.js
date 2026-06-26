import inquirer from "inquirer";
import chalk from "chalk";

import Cita from "../models/cita.js";

export default class CitaController {
  opcion = 0;
  opciones = [
    {
      name: "🔙 Menú anterior",
      value: 0,
    },
    {
      name: "📋 Mostrar citas",
      value: 1,
    },
    {
      name: "➕ Agendar cita",
      value: 2,
    },
  ];

  constructor(opcion) {
    this.opcion = opcion;
    this.cita = new Cita();
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
    console.log(chalk.bgMagenta.white("**** 📅 Menú de Citas ****"));
    const setup = await inquirer.prompt([
      {
        type: "select",
        name: "optCita",
        message: `¿Qué deseas hacer?`,
        choices: this.opciones,
      },
    ]);

    return setup.optCita;
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
    console.log(chalk.bgGreenBright.black("📅 Agendando cita..."));

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
        name: "dueno",
        message: "Ingrese el nombre del dueño:",
        validate: (input) => {
          if (input.trim() === "") {
            return "El nombre del dueño no puede estar vacío.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "fecha",
        message: "Ingrese la fecha de la cita (DD/MM/AAAA):",
        validate: (input) => {
          if (input.trim() === "") {
            return "La fecha no puede estar vacía.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "hora",
        message: "Ingrese la hora de la cita (HH:MM):",
        validate: (input) => {
          if (input.trim() === "") {
            return "La hora no puede estar vacía.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "motivo",
        message: "Ingrese el motivo de la cita:",
        validate: (input) => {
          if (input.trim() === "") {
            return "El motivo no puede estar vacío.";
          }
          return true;
        },
      },
    ]);

    await this.cita.save({
      table: this.cita.getTable(),
      id: Date.now(),
      mascota: payload.mascota,
      dueno: payload.dueno,
      fecha: payload.fecha,
      hora: payload.hora,
      motivo: payload.motivo,
      estado: "Pendiente",
    });

    console.log();
    console.log(chalk.bgGreenBright.black("✔ Cita agendada exitosamente"));

    await this.await();
  }

  async read() {
    console.log(chalk.bgCyan.white("📋 Mostrando citas agendadas..."));
    console.log();
    const citas = await this.cita.load();
    if (citas.length === 0) {
      console.log(chalk.magenta("No hay citas agendadas aún."));
    } else {
      console.table(citas);
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
