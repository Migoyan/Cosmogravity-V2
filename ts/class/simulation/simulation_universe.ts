import { Simulation } from "./simulation";
/**
 * @class Simulation_universe.
 * inheritance from Simulation class
 * 
 * attributes :
 * @param temperature : current temperature of the universe
 * @param hubble_cst : current value of the Hubble-LeMaître constant
 * @param matter_parameter : current value of the matter density parameter.
 * @param dark_energy : object containing current value of dark energy density parameter, value of w_0 and value of w_1.\
 * Note : When w_0 = -1 and w_0 = 0, the universe is equivalent to his counterpart with only a cosmologic constant.
 * @param constants : contains the value of the physics constants defined for the universe.
 * @param has_cmb : Has Cosmic Microwave Background (CMB).
 * @param has_neutrino : self explanatory.
 * @param is_flat : Forcing the curvature density parameter to 0.
 * 
 * methods names :
 * @method modify_dark_energy
 * @method calcul_omega_r
 * @method calcul_omega_k
 * @method Y
 * @method dY
 * @method F
 * @method get_interval_a
 * @method compute_a_tau
 */
export class Simulation_universe extends Simulation {

	private temperature: number;
	private hubble_cst: number;
	private matter_parameter: number;
	private dark_energy = {
		parameter_value: 6.9110e-1,
		w_0: -1,
		w_1: 0
	};
	private constants = {
		c: c,
		k: k,
		h: h,
		G: G,
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
		has_cmb: boolean = true,
		has_neutrino: boolean = true,
		is_flat: boolean = false
		) {
		super(id);
		this.temperature = temperature;
		this.hubble_cst = hubble_cst;
		this.matter_parameter = matter_parameter;
		this.has_cmb = has_cmb;
		this.has_neutrino = has_neutrino;
		this.is_flat = is_flat;
	}

	//--------------------------Accessors------------------------
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

	// dark_energy
	public get_constants() {
		return this.constants;
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

	// is_flat
	public get_is_flat() {
		return this.is_flat;
	}

	public set_is_flat(is_flat: boolean) {
		this.is_flat = is_flat;
	}

	//---------------------------methods-------------------------
	//                      redefined methods

	//                         new methods

	/**
	 * replace the setter for the dark_energy attribute 
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
	 * replace the setter for the constants attribute 
	 * 
	 * @param c light speed constant
	 * @param k Boltzmann constant
	 * @param h Planck constant
	 * @param G Newton constant
	 */
	public modify_constants(c?: number, k?: number, h?: number, G?: number) {
		if (c !== undefined) {
			this.constants.c = c;
		}
		if (k !== undefined) {
			this.constants.k = k;
		}
		if (h !== undefined) {
			this.constants.h = h;
		}
		if (G!== undefined) {
			this.constants.G = G;
		}
	}

	/** Fourth order Runge-Kutta method for second order derivatives for universe computation.
     * 
     * @param step The step of computation
	 * @param x_0 x_point where the calcul start
	 * @param y_0 initial value of y at x_0
	 * @param initial value of the derivative of y at x_0
	 * @param interval Array containing [ymin, ymax]
	 * @param funct function or method that define the equation to resolve, your function has to accept 3 numbers and return a number
     * 
     * @returns [step: number, x: number[], y:number[], yp: number[]].
     */
	public runge_kutta_universe(
		step: number,
		x_0: number = 0,
		y_0: number,
		yp_0: number,
		funct: (x: number, y: number, yp: number) => number,
		interval: number[] = [0, 5],
	): number[][]
    {
		// Init parameter
		let x: number[] = [x_0];
		let y: number[] = [y_0];
		let yp: number[] = [yp_0];
		
		// Computation loops
		// Computing with a positive step, i increments the array
		let i = 0;
		let result_runge_kutta: number[];
		while ( interval[0] <= y[i] && y[i] < interval[1]) {
			result_runge_kutta = this.runge_kutta(step, x[i], y[i], yp[i], funct);
			x.push(result_runge_kutta[0]);
			y.push(result_runge_kutta[1]);
			yp.push(result_runge_kutta[1]);
			i++;
		}
		

		/*
			Computing with a negative step,
			since we decrease the value of x we add the elements at the beginning of the arrays,
			so for each step we take the first elements of the arrays to compute the next one
		*/
		while ( interval[0] <= y[0] && y[0] < interval[1]) {
			result_runge_kutta = this.runge_kutta(-step, x[0], y[0], yp[0], funct);
			x.unshift(result_runge_kutta[0]);
			y.unshift(result_runge_kutta[1]);
			yp.unshift(result_runge_kutta[1]);
			i++;
		}

		return [x, y, yp];
	}

	/**
	 * @returns the radiation density parameter
	 */
	public calcul_omega_r() {
		let sigma: number = (2 * Math.pow(Math.PI, 5) * Math.pow(this.constants.k, 4)) / (15 * Math.pow(this.constants.h, 3) * Math.pow(this.constants.c, 2))
		let rho_r: number = (4 * sigma * Math.pow(this.get_temperature(), 4)) / (Math.pow(this.constants.c, 3));

		// Hubble-Lemaître constant in international system units (Système International)
		let H0_si: number = this.get_hubble_cst() * 1e3 / ((AU * (180 * 3600)) / Math.PI * 1e6);
		let omega_r: number = (8 * Math.PI * this.constants.G * rho_r) / (3 * Math.pow(H0_si, 2));

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
	 * @returns the curvature density parameter
	 */
	 public calcul_omega_k() {
		return 1 - this.calcul_omega_r() - this.get_matter_parameter() - this.get_dark_energy().parameter_value;
	}

	/**
	 * Y function \
	 * see Theory about cosmology and dark_energy
	 * @param x variable
	 * @returns value of Y at position x
	 */
	public Y(x: number) {
		return Math.exp(
			-3 * (this.get_dark_energy().w_0 + this.get_dark_energy().w_1 + 1) * Math.log(x) -
			3 * this.get_dark_energy().w_1 * (1 - x)
		);
	}

	/**
	 * Y' function \
	 * see Theory about cosmology and dark_energy
	 * @param x variable
	 * @returns value of the derivative of Y at position x
	 */
	public dY(x: number) {
		return this.Y(x) * (
			3 * this.get_dark_energy().w_1 - 3 * (1 + this.get_dark_energy().w_0 + this.get_dark_energy().w_1)
		);
	}

	/**
	 * F function \
	 * see Theory about cosmology and dark_energy
	 * @param x variable
	 * @returns value of F(x)
	 */
	public F(x: number) {
		return ((1 + x)**2) * this.calcul_omega_k() +
		((1 + x)**3) * this.get_matter_parameter() +
		((1 + x)**4) * this.calcul_omega_r() +
		this.Y(x) * this.get_dark_energy().parameter_value;
	}

	/**
	 * 
	 * @returns array [amin, amax]
	 */
	public get_interval_a() {
		return [];
	}

	/**
	 * Right part of the differential equation of a(tau) designed to be used in runge_kutta_universe method
	 * @param tau time
	 * @param a function a(t)
	 * @param da derivative of a(t)
	 * @returns result of the right part\
	 * Note: tau and da are not used but have to be defined for this method to be accepted in the runge_kutta method of simulation class
	 */
	public equa_diff_a(tau: number = 0, a:number, da:number = 0) {
		return -(this.calcul_omega_r() / (a**2)) -
		0.5 * this.calcul_omega_r() / (a**2) +
		this.get_dark_energy().parameter_value * (a * this.Y(a) + (a**2) *  this.dY(a)/ 2);
	}

	/**
	 * compute_a_tau in point 
	 * @param step Computation step
	 */
	public compute_a_tau(step: number) {
		return this.runge_kutta_universe(step, 0, 1, 1, this.equa_diff_a, this.get_interval_a());
	}

	/**
	 * Compute the cosmologic shift z
	 */
	public cosmologic_shift() {
		
	}

	/**
	 * Compute the current universe age
	 * @returns the current age of the universe
	 */
	public universe_age() {
			let age:number;
		return age;
	}
}