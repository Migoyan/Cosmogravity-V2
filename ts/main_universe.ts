// Init page
import { Decimal } from "decimal.js"
import { Simulation_universe } from "./class/simulation/simulation_universe";

let universe = new Simulation_universe("universe");
let universe_1 = new Simulation_universe("matter_universe", 0, 32, 1, false, false, true);
function trace_scale_factor() {
    console.log(universe.universe_age() / (3600 * 24 * 365.2425 * 1e9))
    let result_a_tau = universe.compute_scale_factor(0.0001, [0.01, 10]);
    universe_1.compute_scale_factor(0.01);
    let trace_1 = {
        x: result_a_tau.x,
        y: result_a_tau.y,
        mode: 'lines'
    };

    let graphic: any = document.getElementById("graphic_scale_factor");
    Plotly.newPlot(graphic, [trace_1], {margin: { t: 0 } });
}

function update_universe_value(x: number) {
    universe.temperature = Number((<HTMLInputElement>document.getElementById("T0")).value);
    universe.hubble_cst = Number((<HTMLInputElement>document.getElementById("H0")).value);
    universe.matter_parameter = Number((<HTMLInputElement>document.getElementById("omegam0")).value);
    universe.dark_energy.parameter_value = Number((<HTMLInputElement>document.getElementById("omegaDE0")).value);
    universe.dark_energy.w_0 = Number((<HTMLInputElement>document.getElementById("omega0")).value);
    universe.dark_energy.w_1 = Number((<HTMLInputElement>document.getElementById("omega1")).value);
    document.getElementById("resultat_omegar0").innerHTML = universe.calcul_omega_r().toExponential(4);
    document.getElementById("resultat_omegak0").innerHTML = universe.calcul_omega_k().toExponential(4);
}

function update_universe_rayonment() {
    let param_ray = Number((<HTMLInputElement>document.getElementById("liste")).value);
    if (param_ray === 0) {
        universe.has_cmb = true;
        universe.has_neutrino = true;
    } else if (param_ray === 1) {
        universe.has_cmb = true;
        universe.has_neutrino = false;
    } else {
        universe.has_cmb = false;
        universe.has_neutrino = false;
    }
}

function update_flat(){
    if((<HTMLInputElement>document.getElementById("univ_plat")).checked){
        universe.is_flat = true;
    }
    else{
        universe.is_flat = false;
    }
}