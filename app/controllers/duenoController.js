import inquirer from "inquirer";
import chalk from "chalk";

import Dueno from "../models/dueno.js";

export default class DuenoController {
  opcion = 0;
  opciones = [
    {
      name: "🔙 Menu anterior",
      value: 0,
    },
    {
      name: "📋 Mostrar Dueños",
      value: 1,
    },
    {
      name: "➕ Crear Dueño",
      value: 2,
    },
    {
      name: "✏️ Editar Dueño",
      value: 3,
    },
    {
      name: "🗑️ Eliminar Dueño",
      value: 4,
    },
  ];

  constructor(opcion) {
    this.opcion = opcion;
    this.dueno = new Dueno();
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
    console.log(chalk.bgCyan.white("**** 👤 Menú de Dueños ****"));
    const setup = await inquirer.prompt([
      {
        type: "select",
        name: "optDueno",
        message: `¿Qué deseas hacer?`,
        choices: this.opciones,
      },
    ]);

    return setup.optDueno;
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
    console.log(chalk.bgGreen.white("👤 Creando dueño..."));

    let payload = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: `Ingrese el nombre del dueño:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "El nombre del dueño no puede estar vacío.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "telefono",
        message: `Ingrese el teléfono del dueño:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "El teléfono no puede estar vacío.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "email",
        message: `Ingrese el email del dueño:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "El email no puede estar vacío.";
          }
          return true;
        },
      },
    ]);

    // Buscar que el dueño no exista
    const existe = await this.validateDueno(payload.nombre);
    if (existe) {
      console.log(chalk.bgRed.white("No se puede crear el dueño, ya existe"));
      console.log();
      await this.await();
      return;
    }

    await this.dueno.save({
      table: this.dueno.getTable(),
      id: Date.now(),
      nombre: payload.nombre,
      telefono: payload.telefono,
      email: payload.email,
    });

    console.log();
    console.log(chalk.bgGreen.white("✔ Dueño creado exitosamente"));

    await this.await();
  }

  async read() {
    console.log(chalk.bgBlue.white("📋 Mostrando dueños..."));
    console.log();
    const duenos = await this.dueno.load();
    console.table(duenos);
    console.log();
    await this.await();
  }

  update() {
    console.log(chalk.bgYellow.white("✏️ Actualizando dueño..."));
  }

  delete() {
    console.log(chalk.bgRed.white("🗑️ Eliminando dueño..."));
  }

  // Método para validar que no exista el dueño
  async validateDueno(nombre) {
    const dueno = await this.buscarDueno(nombre);
    if (dueno) {
      return true;
    }
    return false;
  }

  async buscarDueno(nombre) {
    const duenos = await this.dueno.load();
    const dueno = duenos.find(
      (d) =>
        d.nombre.toLowerCase().trim() === nombre.toLowerCase().trim(),
    );
    return dueno;
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
