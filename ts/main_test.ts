import Plotly = require("plotly.js");
import { Simulation_universe } from "./class/simulation/simulation_universe";


let our_universe = new Simulation_universe("our_universe");

let result_a_tau = our_universe.compute_a_tau(0.1);
let trace_1 = {
	x: result_a_tau.x,
	y: result_a_tau.y,
	mode: 'lines'
};
let graphe = Plotly.newPlot("graphe_a_tau", [trace_1])