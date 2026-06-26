import inquirer from "inquirer";
import chalk from "chalk";

import Cita from "../models/cita.js";
import Consulta from "../models/consulta.js";

export default class HistorialController {
  constructor() {
    this.cita = new Cita();
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

    console.log(chalk.bgGray.black(setup.awaitTime));
  }

  async read() {
    console.clear();
    console.log(chalk.bgMagenta.white("**** 📋 Historial clínico ****"));

    const citas = await this.cita.load();
    const consultas = await this.consulta.load();

    const historial = [
      ...citas.map((item) => ({ tipo: "Cita", ...item })),
      ...consultas.map((item) => ({ tipo: "Consulta", ...item })),
    ];

    if (historial.length === 0) {
      console.log(chalk.yellow("No hay registros de historial aún."));
    } else {
      console.table(historial);
    }

    console.log();
    await this.await();
  }
}
