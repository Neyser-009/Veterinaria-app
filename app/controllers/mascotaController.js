import inquirer from "inquirer";
import chalk from "chalk";

import Mascota from "../models/mascota.js";

export default class MascotaController {
  opcion = 0;
  opciones = [
    {
      name: "🔙 Menu anterior",
      value: 0,
    },
    {
      name: "📋 Mostrar Mascotas",
      value: 1,
    },
    {
      name: "➕ Crear Mascota",
      value: 2,
    },
    {
      name: "✏️ Editar Mascota",
      value: 3,
    },
    {
      name: "🗑️ Eliminar Mascota",
      value: 4,
    },
  ];

  constructor(opcion) {
    this.opcion = opcion;
    this.mascota = new Mascota();
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
    console.log(chalk.bgCyan.white("**** 🐕 Menú de Mascotas ****"));
    const setup = await inquirer.prompt([
      {
        type: "select",
        name: "optMascota",
        message: `¿Qué deseas hacer?`,
        choices: this.opciones,
      },
    ]);

    return setup.optMascota;
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
    console.log(chalk.bgGreen.white("🐕 Creando mascota..."));

    let payload = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: `Ingrese el nombre de la mascota:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "El nombre de la mascota no puede estar vacío.";
          }
          return true;
        },
      },
      {
        type: "select",
        name: "tipo",
        message: `Seleccione el tipo de mascota:`,
        choices: [
          { name: "🐶 Perro", value: "Perro" },
          { name: "🐈 Gato", value: "Gato" },
          { name: "🐰 Conejo", value: "Conejo" },
          { name: "🐦 Ave", value: "Ave" },
          { name: "🐠 Pez", value: "Pez" },
          { name: "🐹 Roedor", value: "Roedor" },
          { name: "Otro", value: "Otro" },
        ],
      },
      {
        type: "input",
        name: "raza",
        message: `Ingrese la raza de la mascota:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "La raza no puede estar vacía.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "edad",
        message: `Ingrese la edad de la mascota (en años):`,
        validate: (input) => {
          if (isNaN(input) || input.trim() === "") {
            return "La edad debe ser un número válido.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "dueno",
        message: `Ingrese el nombre del dueño:`,
        validate: (input) => {
          if (input.trim() === "") {
            return "El nombre del dueño no puede estar vacío.";
          }
          return true;
        },
      },
    ]);

    // Buscar que la mascota no exista
    const existe = await this.validateMascota(payload.nombre);
    if (existe) {
      console.log(chalk.bgRed.white("No se puede crear la mascota, ya existe"));
      console.log();
      await this.await();
      return;
    }

    await this.mascota.save({
      table: this.mascota.getTable(),
      id: Date.now(),
      nombre: payload.nombre,
      tipo: payload.tipo,
      raza: payload.raza,
      edad: payload.edad,
      dueno: payload.dueno,
    });

    console.log();
    console.log(chalk.bgGreen.white("✔ Mascota creada exitosamente"));

    await this.await();
  }

  async read() {
    console.log(chalk.bgBlue.white("📋 Mostrando mascotas..."));
    console.log();
    const mascotas = await this.mascota.load();
    console.table(mascotas);
    console.log();
    await this.await();
  }

  update() {
    console.log(chalk.bgYellow.white("✏️ Actualizando mascota..."));
  }

  delete() {
    console.log(chalk.bgRed.white("🗑️ Eliminando mascota..."));
  }

  // Método para validar que no exista la mascota
  async validateMascota(nombre) {
    const mascota = await this.buscarMascota(nombre);
    if (mascota) {
      return true;
    }
    return false;
  }

  async buscarMascota(nombre) {
    const mascotas = await this.mascota.load();
    const mascota = mascotas.find(
      (m) =>
        m.nombre.toLowerCase().trim() === nombre.toLowerCase().trim(),
    );
    return mascota;
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
