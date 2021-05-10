import { Simulation } from "./simulation";
class Simulation_universe extends Simulation {

    private temperature: number;
    private hubble_cst: number;
    private matter_parameter;
    private dark_energy: object;
    private has_rfc: boolean = true;
    private has_neutrino: boolean = true;
    private is_flat: boolean = false;

    //-------------------------constructor-----------------------
    constructor(
        id: string,
        temperature: number = 2.7255,
        hubble_cst: number = 67.74,
        matter_parameter: number = 3.0890e-1,
        dark_energy: object = {
            parameter_value: 6.9110e-1,
            w_0: -1,
            w_1: 0
        },
        has_rfc: boolean = true,
        has_neutrino: boolean = true,
        is_flat: boolean = false
        ) {
        super(id);
        this.temperature = temperature;
        this.hubble_cst = hubble_cst;
        this.matter_parameter = matter_parameter;
        this.dark_energy = dark_energy;
        this.has_rfc = has_rfc;
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

    public set_dark_energy(dark_energy: object) {
        this.dark_energy = dark_energy;
    }

    // has_rfc
    public get_has_rfc() {
        return this.has_rfc;
    }

    public set_has_rfc(has_rfc: boolean) {
        this.has_rfc = has_rfc;
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
     * modfiy_dark_energy
     */
    public modfiy_dark_energy() {
        
    }
}