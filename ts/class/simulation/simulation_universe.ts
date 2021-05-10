/*
Class Simulation_universe.
inheritance from Simulation class

attributes :
    - temperature : current temperature of the universe
    - hubble_cst : current value of the Hubble-LeMaître constant
    - matter_parameter : current value of the matter density parameter.
    - dark_energy : object containing current value of dark energy density parameter, value of w_0 and value of w_1.
        The universes where there is only a constant are equivalent to the universes where w_0 = -1 and w_0 = 0.
    - has_cmb : Has Cosmic Microwave Background (CMB).
    - has_neutrino : self explanatory.
    - is_flat : Forcing the curvature density parameter to 0.

methods names :
    - modify_dark_energy
*/

import { Simulation } from "./simulation";
export class Simulation_universe extends Simulation {

    private temperature: number;
    private hubble_cst: number;
    private matter_parameter: number;
    private dark_energy = {
        parameter_value: 6.9110e-1,
        w_0: -1,
        w_1: 0
    };
    private has_cmb: boolean;
    private has_neutrino: boolean;
    private is_flat: boolean;

    //-------------------------constructor-----------------------
    constructor(
        id: string,
        temperature: number = 2.7255,
        hubble_cst: number = 67.74,
        matter_parameter: number = 3.0890e-1,
        DE_parameter_value: number = 6.9110e-1,
        DE_w_0: number = -1,
        DE_w_1: number = 0,
        has_cmb: boolean = true,
        has_neutrino: boolean = true,
        is_flat: boolean = false
        ) {
        super(id);
        this.temperature = temperature;
        this.hubble_cst = hubble_cst;
        this.matter_parameter = matter_parameter;
        this.dark_energy.parameter_value = DE_parameter_value;
        this.dark_energy.w_0 = DE_w_0;
        this.dark_energy.w_1 = DE_w_1;
        this.has_cmb = has_cmb;
        this.has_neutrino = has_neutrino;
        this.is_flat = is_flat;
    }

    //----------------------getters & setters--------------------
    // temperature
    public get_temperature() {
        return this.temperature;
    }

    public set_temperature(temperature: number) {
        this.temperature = temperature;
    }

    // hubble_cst
    public get_hubble_cst() {
        return this.hubble_cst;
    }

    public set_hubble_cst(hubble_cst: number) {
        this.hubble_cst = hubble_cst;
    }

    // matter_parameter
    public get_matter_parameter() {
        return this.matter_parameter;
    }

    public set_matter_parameter(matter_parameter: number) {
        this.matter_parameter = matter_parameter;
    }

    // dark_energy
    public get_dark_energy() {
        return this.dark_energy;
    }

    // has_cmb
    public get_has_cmb() {
        return this.has_cmb;
    }

    public set_has_cmb(has_cmb: boolean) {
        this.has_cmb = has_cmb;
    }

    // has_neutrino
    public get_has_neutrino() {
        return this.has_neutrino;
    }

    public set_has_neutrino(has_neutrino: boolean) {
        this.has_neutrino = has_neutrino;
    }

    // dark_energy
    public get_is_flat() {
        return this.is_flat;
    }

    public set_is_flat(is_flat: boolean) {
        this.is_flat = is_flat;
    }

    //---------------------------methods-------------------------

    /**
        * modify_dark_energy
        * replace the setter for this attribute
    */
    public modify_dark_energy(DE_parameter_value?: number, DE_w_0?: number, DE_w_1?: number) {
        if (DE_parameter_value !== undefined) {
            this.dark_energy.parameter_value = DE_parameter_value;
        }
        if (DE_w_0 !== undefined) {
            this.dark_energy.w_0 = DE_w_0;
        }
        if (DE_w_1 !== undefined) {
            this.dark_energy.w_1 = DE_w_1;
        }
    }

    /**
        * E
        * Comptute the E(z) function for the annex calculs part
    */
    public E(z) {
        
    }
}