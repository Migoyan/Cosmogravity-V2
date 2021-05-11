/*
	Simulation_universe.
	inheritance from Simulation class

	attributes :
		- temperature : current temperature of the universe
		- hubble_cst : current value of the Hubble-LeMaître constant
		- matter_parameter : current value of the matter density parameter.
		- dark_energy : object containing current value of dark energy density parameter, value of w_0 and value of w_1.
			Note : When w_0 = -1 and w_0 = 0, the universe is equivalent to his counterpart with only a cosmologic constant.
		- has_cmb : Has Cosmic Microwave Background (CMB).
		- has_neutrino : self explanatory.
		- is_flat : Forcing the curvature density parameter to 0.

	methods names :
		- modify_dark_energy
		- calcul_omega_r
		- calcul_omega_k
		- Y
		- F
		- get_interval_a
		- compute_a_tau

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
		* modify_dark_energy \
		* replace the setter for this attribute 
		* 
		* @param DE_parameter_value value of the dark energy density parameter
		* @param DE_w_0 value of w_0
		* @param DE_w_1 value of w_1
		*
		* Note : w_0, w_1 are parameters that describe the nature of the dark energy.
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
		* calcul_omega_r \
		* @returns the radiation density parameter
	*/
	public calcul_omega_r() {
		let sigma: number = (2 * Math.pow(Math.PI, 5) * Math.pow(k, 4)) / (15 * Math.pow(h, 3) * Math.pow(c, 2))
		let rho_r: number = (4 * sigma * Math.pow(this.get_temperature(), 4)) / (Math.pow(c, 3));
		let H0parsec: number = this.get_hubble_cst() * 1e3 / ((AU * (180 * 3600)) / Math.PI * 1e6);
		let omega_r: number = (8 * Math.PI * G * rho_r) / (3 * Math.pow(H0parsec, 2));

		if (this.get_has_neutrino()) {
			omega_r *= 1.68;
		}
		if (this.get_has_cmb()) {
			omega_r **= 3;
		}
		if(!(this.get_has_neutrino() && this.get_has_cmb())) {
			omega_r = 0;
		}

		return omega_r;
	}

	/**
		* calcul_omega_k \
		* @returns the curvature density parameter
	*/
	 public calcul_omega_k() {
		return 1 - this.calcul_omega_r() - this.get_matter_parameter() - this.get_dark_energy().parameter_value;
	}

	/**
		* Y function \
		* see Theory about cosmology and dark_energy
		* @param x variable
		* @returns value of Y(x)
	*/
	public Y(x: number) {
		return Math.exp(
			-3 * (this.get_dark_energy().w_0 + this.get_dark_energy().w_1 + 1) * Math.log(x) -
			3 * this.get_dark_energy().w_1 * (1 - x)
		);
	}

	/**
		* F function \
		* see Theory about cosmology and dark_energy
		* @param x variable
		* @returns value of F(x)
	*/
	public F(x: number) {
		return (x** -2) * this.calcul_omega_k() +
		(x** -3) * this.get_matter_parameter() +
		(x** -4) * this.calcul_omega_r() +
		this.Y(x) * this.get_dark_energy().parameter_value;
	}

	/**
	 * get_interval_a
	 * @returns array [amin, amax]
	*/
	public get_interval_a() {
		return [];
	}

	/**
	 * equa_diff_a
	 * @param a variable
	 */
	public equa_diff_a(a: number) {
		return -(this.calcul_omega_r() / (a**2)) -
		0.5 * this.calcul_omega_r() / (a**2) +
		this.get_dark_energy().parameter_value * (a * this.Y(a) + (a**2) *  / 2);
	}

	/**
	 * compute_a_tau
	 * @param n Number of computation points
	*/
	public compute_a_tau(n: number) {
		let interval = this.get_interval_a();
		let pas = (interval[1] - interval[0]) / n
		let result = this.runge_kutta();
	}


}