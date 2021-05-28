import { Simulation_universe } from "./class/simulation/simulation_universe";
// Physics constants
const c: number = 2.99792458e8;        // Light constant
const k: number = 1.38064852e-23;      // Boltzmann constant
const h: number = 6.62607004e-34;      // Planck constant
const G: number = 6.67430e-11;         // Newton constant : Système international 2018


// Distances
const AU: number = 1.495978707e11;      // Astronomical unit in meters
const parsec: number = 3.0857e16;       // Parsec in meters
const k_parsec: number = 3.0857e19;     // Kiloparsec in meters
const M_parsec: number = 3.0857e22;     // Megaparsec in meters
const ly: number = 9.4607e15;           // Light-year in meters

let our_universe = new Simulation_universe("our_universe", 2.7255, 67.74, 3.0890e-1, true, true, false);
let result_a_tau = our_universe.compute_a_tau(0.001);
let trace_1 = {
	x: result_a_tau.x,
	y: result_a_tau.y,
	mode: 'lines'
};

console.log(trace_1.y);