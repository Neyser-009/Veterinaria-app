import inquirer from "inquirer";
import chalk from "chalk";

import duenoController from "./app/controllers/duenoController.js";
import mascotaController from "./app/controllers/mascotaController.js";
import citaController from "./app/controllers/citaController.js";
import consultaController from "./app/controllers/consultaController.js";
import historialController from "./app/controllers/historialController.js";

function mostrarEncabezado() {
  console.clear();
}

async function init() {
  mostrarEncabezado();
  const setup = await inquirer.prompt([
    {
      type: "select",
      name: "opcion",
      message: `¿Qué deseas hacer?`,
      choices: [
        {
          name: "👤 Gestionar Dueños",
          value: "1",
        },
        {
          name: "🐕 Gestionar Mascotas",
          value: "2",
        },
        {
          name: "📅 Agendar Citas",
          value: "3",
        },
        {
          name: "🩺 Registrar Consultas",
          value: "4",
        },
        {
          name: "📋 Ver Historial",
          value: "5",
        },
        {
          name: "❌ Salir",
          value: "6",
        },
      ],
    },
  ]);

  console.log(chalk.bgGray.black("Opción seleccionada: " + setup.opcion));
  return setup.opcion;
}

async function MainMenu(opcion) {
  if (opcion === "1") {
    const dueno = new duenoController(opcion);
    await dueno.init();
  } else if (opcion === "2") {
    const mascota = new mascotaController(opcion);
    await mascota.init();
  } else if (opcion === "3") {
    const cita = new citaController(opcion);
    await cita.init();
  } else if (opcion === "4") {
    const consulta = new consultaController(opcion);
    await consulta.init();
  } else if (opcion === "5") {
    const historial = new historialController();
    await historial.read();
  } else if (opcion === "6") {
    // Lógica para salir
    console.log(chalk.green.bold("¡Hasta luego! 👋"));
    process.exit(0);
  } else {
    console.log(
      chalk.bgRed.white(
        "Opción no válida. Por favor, selecciona una opción válida.",
      ),
    );
  }
}

//(async function () {
let opcion;
do {
  opcion = await init();
  await MainMenu(opcion);
} while (opcion !== "6");
//})();
