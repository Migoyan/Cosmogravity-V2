"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simulation_universe_1 = require("./class/simulation/simulation_universe");
// Physics constants
const c = 2.99792458e8; // Light constant
const k = 1.38064852e-23; // Boltzmann constant
const h = 6.62607004e-34; // Planck constant
const G = 6.67430e-11; // Newton constant : Système international 2018
// Distances
const AU = 1.495978707e11; // Astronomical unit in meters
const parsec = 3.0857e16; // Parsec in meters
const k_parsec = 3.0857e19; // Kiloparsec in meters
const M_parsec = 3.0857e22; // Megaparsec in meters
const ly = 9.4607e15; // Light-year in meters
let universe = new simulation_universe_1.Simulation_universe("universe", 2.7255, 67.74, 3.0890e-1, true, true, false);
let age_universe = universe.universe_age() / (3600 * 24 * 365.2425);
let result_a_tau = universe.compute_a_tau(0.001);
let trace_1 = {
    x: result_a_tau.x,
    y: result_a_tau.y,
    mode: 'lines'
};
/*
let durations: number;
try {
    durations = universe.duration(0, 1000)/(3600*24*365.2425);
    console.log(durations);
    console.log(age_universe - durations);
} catch (error) {
    console.log(error);
}
*/
let graphe = document.getElementById("tester");
Plotly.newPlot(graphe, [trace_1], { margin: { t: 0 } });
//# sourceMappingURL=main_test.js.map