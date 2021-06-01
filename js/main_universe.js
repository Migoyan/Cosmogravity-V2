"use strict";
// Init page
Object.defineProperty(exports, "__esModule", { value: true });
const Plotly = require("plotly.js");
const simulation_universe_1 = require("./class/simulation/simulation_universe");
let universe = new simulation_universe_1.Simulation_universe("universe");
function trace_scale_factor() {
    let result_a_tau = universe.compute_a_tau(0.001);
    let trace_1 = {
        x: result_a_tau.x,
        y: result_a_tau.y,
        mode: 'lines'
    };
    let graphic = document.getElementById("graphic_scale_factor");
    Plotly.newPlot(graphic, [trace_1], { margin: { t: 0 } });
}
function update_universe_value() {
    universe.temperature = Number(document.getElementById("T0").value);
    universe.hubble_cst = Number(document.getElementById("H0").value);
    universe.matter_parameter = Number(document.getElementById("omegam0").value);
    universe.dark_energy.parameter_value = Number(document.getElementById("omegaDE0").value);
    document.getElementById("resultat_omegar0").innerHTML = universe.calcul_omega_r().toExponential(4);
    document.getElementById("resultat_omegak0").innerHTML = universe.calcul_omega_k().toExponential(4);
}
