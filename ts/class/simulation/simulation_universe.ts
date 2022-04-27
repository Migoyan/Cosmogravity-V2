import {Simulation } from "./simulation.js"
import {c,k,h,G,AU,parsec,k_parsec,M_parsec,ly} from "./../../constants.js"

/**
 * @class Simulation_universe.
 * inheritance from Simulation class
 *
 * attributes :
 * @param temperature : current temperature of the universe.
 * @param hubble_cst : current value of the Hubble-LeMaître constant.
 * @param matter_parameter : current value of the matter density parameter.
 * @param dark_energy : object containing current value of dark energy density parameter, value of w_0 and value of w_1.\
 * 	Note : When w_0 = -1 and w_0 = 0, the universe is equivalent to his counterpart with only a cosmologic constant.
 * @param constants : contains the value of the physics constants defined for the universe.
 * @param has_cmb : Has Cosmic Microwave Background (CMB).
 * @param has_neutrino : self explanatory.
 * @param is_flat : Forcing the curvature density parameter to 0.
 *
 * methods names :
 * @method modify_dark_energy
 * @method modify_constants
 * @method runge_kutta_universe_1
 * @method runge_kutta_universe_2
 * @method calcul_omega_r
 * @method calcul_omega_k
 * @method check_sum_omegas
 * @method Y
 * @method dY
 * @method F
 * @method compute_scale_factor
 * @method compute_omegas
 * @method time
 * @method universe_age
 * @method duration
 * @method metric_distance
 * @method luminosity
 * @method luminosity_distance
 * @method light_distance
 * @method angular_diameter_distance
 * @method brightness
 * @method apparent_diameter
 * @method integral_duration_substituated
 * @method integral_distance
 * @method equa_diff_a
 * @method equa_diff_time
 */
export class Simulation_universe extends Simulation {
	private _temperature: number;
	private _hubble_cst: number;
	private _matter_parameter: number;
	private _dark_energy = {
		parameter_value: 6.911e-1,
		w_0: -1,
		w_1: 0,
	};
	private _constants = {
		c: c,
		k: k,
		h: h,
		G: G,
	};
	private _has_cmb: boolean;
	private _has_neutrino: boolean;
	private _is_flat: boolean;

	//-------------------------constructor-----------------------
	constructor(
		id: string,
		temperature: number = 2.7255,
		hubble_cst: number = 67.74,
		matter_parameter: number = 3.089e-1,
		has_cmb: boolean = true,
		has_neutrino: boolean = true,
		is_flat: boolean = false
	) {
		super(id);
		this._temperature = temperature;
		this._hubble_cst = (hubble_cst * 1e3) / (((AU * (180 * 3600)) / Math.PI) * 1e6);
		this._matter_parameter = matter_parameter;
		this._has_cmb = has_cmb;
		this._has_neutrino = has_neutrino;
		this._is_flat = is_flat;
	}

	//--------------------------Accessors------------------------
	// temperature
	public get temperature(): number {
		return this._temperature;
	}

	public set temperature(temperature: number) {
		this._temperature = temperature;
		this.check_sum_omegas();
	}

	// hubble_cst
	public get hubble_cst(): number {
		return this._hubble_cst;
	}

	public set hubble_cst(hubble_cst: number) {
		this._hubble_cst = (hubble_cst * 1e3) / (((AU * (180 * 3600)) / Math.PI) * 1e6);
		this.check_sum_omegas();
	}

	// matter_parameter
	public get matter_parameter(): number {
		return this._matter_parameter;
	}

	public set matter_parameter(matter_parameter: number) {
		this._matter_parameter = matter_parameter;
		this.check_sum_omegas();
	}

	// dark_energy
	public get dark_energy() {
		return this._dark_energy;
	}

	// constants
	public get constants() {
		return this._constants;
	}

	// has_cmb
	public get has_cmb(): boolean {
		return this._has_cmb;
	}

	public set has_cmb(has_cmb: boolean) {
		this._has_cmb = has_cmb;
		this.check_sum_omegas();
	}

	// has_neutrino
	public get has_neutrino(): boolean {
		return this._has_neutrino;
	}

	public set has_neutrino(has_neutrino: boolean) {
		this._has_neutrino = has_neutrino;
		this.check_sum_omegas();
	}

	// is_flat
	public get is_flat(): boolean {
		return this._is_flat;
	}

	public set is_flat(is_flat: boolean) {
		this._is_flat = is_flat;
		this.check_sum_omegas();
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
	public modify_dark_energy(
		DE_parameter_value ? : number,
		DE_w_0 ? : number,
		DE_w_1 ? : number
	): void {
		if (DE_parameter_value !== undefined) {
			this._dark_energy.parameter_value = DE_parameter_value;
			this.check_sum_omegas(true);
		}
		if (DE_w_0 !== undefined) {
			this._dark_energy.w_0 = DE_w_0;
		}
		if (DE_w_1 !== undefined) {
			this._dark_energy.w_1 = DE_w_1;
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
	public modify_constants(
		c ? : number,
		k ? : number,
		h ? : number,
		G ? : number
	): void {
		if (c !== undefined) {
			this._constants.c = c;
		}
		if (k !== undefined) {
			this._constants.k = k;
		}
		if (h !== undefined) {
			this._constants.h = h;
		}
		if (G !== undefined) {
			this._constants.G = G;
		}
	}

	/**
	 * Fourth order Runge-Kutta method for second order derivatives for universe computation.
	 *
	 * @param step The step of computation
	 * @param x_0 x_point where the calcul start
	 * @param y_0 initial value of y at x_0
	 * @param interval Array containing [xmin, xmax]
	 * @param funct function or method that define the equation to resolve, your function has to accept 2 numbers and return a number
	 *
	 * @returns [step: number, x: number[], y:number[]].
	 */
	protected runge_kutta_universe_1(
		step: number,
		x_0: number = 0,
		y_0: number = 1,
		funct: (Simu: Simulation_universe, x: number, y: number) => number,
		interval: number[] = [0, 5]
	) {
		// Init parameter
		let x: number[] = [x_0];
		let y: number[] = [y_0];

		// Computation loops
		// Computing with a positive step, i increments the array
		let i = 0;
		let result_runge_kutta: number[];
		while (interval[0] <= x[i] && x[i] < interval[1]) {
			result_runge_kutta = this.runge_kutta_equation_order1(
				this,
				step,
				x[i],
				y[i],
				funct
			);
			x.push(result_runge_kutta[0]);
			y.push(result_runge_kutta[1]);
			i++;
		}

		/*
			Computing with a negative step,
			since we decrease the value of x we add the elements at the beginning of the arrays,
			so for each step we take the first element of the array to compute the next one.
		*/
		while (interval[0] <= x[0] && x[0] < interval[1]) {
			result_runge_kutta = this.runge_kutta_equation_order1(
				this,
				-step,
				x[0],
				y[0],
				funct
			);
			x.unshift(result_runge_kutta[0]);
			y.unshift(result_runge_kutta[1]);
			i++;
		}

		return {
			x: x,
			y: y
		};
	}

	/**
	 * Fourth order Runge-Kutta method for second order derivatives for universe computation.
	 *
	 * @param step The step of computation
	 * @param x_0 x_point where the calcul start
	 * @param y_0 initial value of y at x_0
	 * @param yp_0 initial value of the derivative of y at x_0
	 * @param interval Array containing [ymin, ymax]
	 * @param funct function or method that define the equation to resolve, your function has to accept 3 numbers and return a number
	 *
	 * @returns [step: number, x: number[], y:number[], yp: number[]].
	 */
	protected runge_kutta_universe_2(
		step: number,
		x_0: number = 0,
		y_0: number = 1,
		dy_0: number = 1,
		funct: (Simu: Simulation_universe, x: number, y: number, dy: number) => number,
		interval: number[]
	) {
		// Init parameter
		let x: number[] = [x_0];
		let y: number[] = [y_0];
		let dy: number[] = [dy_0];

		// Computation loops
		// Computing with a positive step, i increments the array
		let i = 0;
		let result_runge_kutta: number[];
		while (interval[0] <= y[i] && y[i] < interval[1]) {
			result_runge_kutta = this.runge_kutta_equation_order2(
				this,
				step,
				x[i],
				y[i],
				dy[i],
				funct
			);
			x.push(result_runge_kutta[0]);
			y.push(result_runge_kutta[1]);
			dy.push(result_runge_kutta[2]);
			i++;
		}

		/*
			Computing with a negative step,
			since we decrease the value of x we add the elements at the beginning of the arrays,
			so for each step we take the first element of the array to compute the next one.
		*/
		while (interval[0] <= y[0] && y[0] < interval[1]) {
			result_runge_kutta = this.runge_kutta_equation_order2(
				this,
				-step,
				x[0],
				y[0],
				dy[0],
				funct
			);
			x.unshift(result_runge_kutta[0]);
			y.unshift(result_runge_kutta[1]);
			dy.unshift(result_runge_kutta[2]);
			i++;
		}

		return {
			x: x,
			y: y,
			dy: dy
		};
	}

	/**
	 * compute radiation density parameter at current time
	 * @returns the radiation density parameter
	 */
	public calcul_omega_r(): number {
		let sigma: number =
			(2 * Math.pow(Math.PI, 5) * Math.pow(this.constants.k, 4)) /
			(15 *
				Math.pow(this.constants.h, 3) *
				Math.pow(this.constants.c, 2));
		let rho_r: number =
			(4 * sigma * Math.pow(this.temperature, 4)) /
			Math.pow(this.constants.c, 3);

		// Hubble-Lemaître constant in international system units (Système International)
		let omega_r: number =
			(8 * Math.PI * this.constants.G * rho_r) / (3 * Math.pow(this.hubble_cst, 2));

		if (this.has_neutrino) {
			omega_r *= 1.68;
		}
		if (!this.has_cmb) {
			omega_r = 0;
		}

		return omega_r;
	}

	/**
	 * Compute curvature density parameter at current time
	 * @returns the curvature density parameter
	 */
	public calcul_omega_k(): number {
		if (this.is_flat) {
			return 0;
		} else {
			return (
				1 -
				this.calcul_omega_r() -
				this.matter_parameter -
				this.dark_energy.parameter_value
			);
		}
	}

	/**
	 * Check if the sum of the density parameters is equal to 1. Otherwise modify one parameter to correct the sum.
	 * @param modify_matter true : modify the matter parameter, false : dark energy parameter instead
	 * @returns false if one parm has been modified, true otherwise
	 */
	protected check_sum_omegas(modify_matter: Boolean = true): Boolean {
		let is_param_modified = false;
		let omega_r = this.calcul_omega_r();
		let sum = this.matter_parameter + omega_r + this.dark_energy.parameter_value + this.calcul_omega_k();
		if (this.is_flat && sum !== 1) {
			is_param_modified = true;
			if (modify_matter) {
				this.matter_parameter = 1 - this.dark_energy.parameter_value - omega_r;
			} else {
				this.modify_dark_energy(1 - this.matter_parameter - omega_r);
			}
		}

		return is_param_modified;
	}

	/**
	 * Y function \
	 * see Theory about cosmology and dark_energy
	 * @param x variable
	 * @returns value of Y at position x
	 */
	protected Y(x: number): number {
		return Math.exp(
			-3 *
			(this.dark_energy.w_0 + this.dark_energy.w_1 + 1) *
			Math.log(x) -
			3 * this.dark_energy.w_1 * (1 - x)
		);
	}

	/**
	 * Y' function \
	 * see Theory about cosmology and dark_energy
	 * @param x variable
	 * @returns value of the derivative of Y at position x
	 */
	protected dY(x: number): number {
		return (
			this.Y(x) *
			(3 * this.dark_energy.w_1 -
				3 * (1 + this.dark_energy.w_0 + this.dark_energy.w_1) / x)
		);
	}

	/**
	 * F function \
	 * see Theory about cosmology and dark_energy
	 * @param x variable
	 * @returns value of F(x)
	 */
	protected F(x: number): number {
		return (
			(1 + x) ** 2 * this.calcul_omega_k() +
			(1 + x) ** 3 * this.matter_parameter +
			(1 + x) ** 4 * this.calcul_omega_r() +
			this.Y(1 / (1 + x)) * this.dark_energy.parameter_value
		);
	}

	/**
	 * compute the scale factor of the universe as function of time
	 * @param step Computation step
	 * @param interval_a Array containing a_min et a_max value
	 * @param universe_age Permit to pass an already computed value for the universe age. If not given, the method recompute the value.
	 * @returns t value, a value, derivative of a
	 */
	public compute_scale_factor(step: number, interval_a: number[] = [0, 5], universe_age ? : number) {
		let age: number;
		if (universe_age === undefined) {
			age = this.universe_age();
		} else {
			age = universe_age;
		}
		if (isNaN(age)) {
			age = 0;
		} 
		let result = this.runge_kutta_universe_2(
			step,
			0,
			1,
			1,
			this.equa_diff_a,
			interval_a
		);
		for (let index = 0; index < result.x.length; index++) {
			result.x[index] = (result.x[index] / this.hubble_cst + age) / (3600 * 24 * 365.2425);
		}
		return result;
	}

	/**
	 * Computing the 4 density parameters given an array of cosmologic shift value
	 * @param z_array array containing z points where to compute the omegas
	 */
	public compute_omegas(z_array: number[]) {
		let omega_matter: number[] = [];
		let omega_rad: number[] = [];
		let omega_de: number[] = [];
		let omega_courbure: number[] = [];
		let radiation = this.calcul_omega_r();
		let curvature = this.calcul_omega_k();

		z_array.forEach(z => {
			omega_matter.push(this.matter_parameter * (1 + z)**3 / this.F(z));
			omega_rad.push(radiation * (1 + z)**3 / this.F(z));
			omega_de.push(this.dark_energy.parameter_value * (1 + z)**3 / this.F(z));
			omega_courbure.push(curvature * (1 + z)**3 / this.F(z));
		});

		return {
			omega_matter: omega_matter,
			omega_rad: omega_rad,
			omega_de: omega_de,
			omega_courbure: omega_courbure
		};
	}

	/**
	 * Compute the time as a function of the cosmologic shift
	 * @param n number of computation points
	 * @param zmin
	 * @param zmax
	 * @returns
	 */
	public time(n: number, zmin: number, zmax: number) {
		let step: number = (zmax - zmin) / n;
		let time_zmin: number;
		try {
			time_zmin = this.duration(0, zmin);
		} catch (e) {
			return e;
		}

		return this.runge_kutta_universe_1(
			step,
			zmin,
			time_zmin,
			this.equa_diff_time,
			[zmin, zmax]
		);
	}

	/**
	 * Compute the current universe's age
	 * @returns the current age of the universe in seconds
	 */
	public universe_age(): number {
		/*
		To compute the age of the universe we need to integrate from x = 0 to x -> infinity. To resolve this problem we do a substitution with
		x = y / (1 - y) which implies dx = dy / (1 - y)². This result with an integral from y = 0 to y = 1 that can be digitally resolved.
		*/
		let age: number;
		age =
			this.simpson(this, this.integral_duration_substituated, 0, 1, 10000) /
			this.hubble_cst;
		return age;
	}

	/**
	 * name
	 */
	public emission_age(z: number) {
		let infimum = z / (1 + z);
		let age: number;
		age =
			this.simpson(this, this.integral_duration_substituated, infimum, 1, 1000) /
			this.hubble_cst;
		return age;
	}

	/**
	 * Compute the cosmologic duration between two cosmologics shift z
	 * @param z_1 the closest cosmologic shift from ours (z = 0)
	 * @param z_2 the farest cosmologic shift from ours (z = 0)
	 * @returns error if z_1 or z_2 < -1, duration if both value are accepted.
	 */
	public duration(z_1: number, z_2: number) {
		if (z_1 <= -1 || z_2 <= -1) {
			throw new Error("Cosmologic shift z cannot be equal or lower than -1 included");
		}

		let infimum = z_1 / (1 + z_1);
		let supremum = z_2 / (1 + z_2);

		let duration: number;
		duration = this.simpson(this, this.integral_duration_substituated, infimum, supremum, 1000) / this.hubble_cst;
		return duration;
	}

	/**
	 * Compute the distance between us and an object at a cosmologic redshit z
	 * @param z cosmologic shift
	 * @returns the distance
	 */
	public metric_distance(z: number): number {
		let distance: number;
		let curvature: number = this.calcul_omega_k();
		distance = this.simpson(this, this.integral_distance, 0, z, 100);
		if (curvature < 0) {
			distance =
				Math.sinh(Math.sqrt(Math.abs(curvature)) * distance) /
				Math.sqrt(Math.abs(curvature));
		} else if (curvature > 0) {
			distance =
				Math.sin(Math.sqrt(Math.abs(curvature)) * distance) /
				Math.sqrt(Math.abs(curvature));
		}
		distance *= this.constants.c / this.hubble_cst;
		return distance;
	}

	/**
	 * Compute the luminosity distance
	 * @param z Cosmologic shift
	 * @param distance_metric optionnal parameters for optimisation (permit you to pass an already calculated distances for optimisation)
	 * @returns luminosity distance
	 */
	public luminosity_distance(z: number, distance_metric?: number) {
		let distance: number;
		if (distance_metric === undefined) {
			distance = this.metric_distance(z);
		} else {
			distance = distance_metric;
		}

		return distance * (1 + z);
	}

	/**
	 * @param z Cosmologic shift
	 * @param distance_metric
	 */
	public angular_diameter_distance(z: number, distance_metric?: number) {
		let distance: number;
		if (distance_metric === undefined) {
			distance = this.metric_distance(z);
		} else {
			distance = distance_metric;
		}

		return distance / (1 + z);
	}

	/**
	 * This fonction compute the distance with the simple formula c*t.
	 * @param z Cosmologic shift
	 * @returns c*t
	 */
	public light_distance(z: number) {
		let duration = this.duration(0, z);
		let c = this.constants.c;
		return duration * c;
	}

	/**
	 * Compute the luminosity of an astronomical object of an unifrom intensity I
	 * @param I intensity
	 * @returns luminosity
	 */
	public luminosity(I: number): number {
		return 4 * Math.PI * I;
	}

	/**
	 * Compute the brightness of an object situated at a cosmologic redshit z
	 * @param z Cosmologic shift
	 * @param luminosity self explanatory
	 * @param distance_metric optionnal parameters for optimisation (permit you to pass an already calculated distances for optimisation)
	 */
	public brightness(
		z: number,
		luminosity: number,
		distance_metric ? : number
	): number {
		let distance: number;
		if (distance_metric === undefined) {
			distance = this.metric_distance(z);
		} else {
			distance = distance_metric;
		}

		return luminosity / (4 * Math.PI * Math.pow(distance * (1 + z), 2));
	}

	/**
	 * Compute the apparent diameter (Or the angle between 2 object of same shift z)
	 * @param D_e Euclydien linear diameter
	 * @param z Cosmologic shift
	 * @param distance_metric optionnal parameters for optimisation (permit you to pass an already calculated distances for optimisation)
	 * @returns The apparent diameter
	 */
	public apparent_diameter(D_e: number, z: number, distance_metric?: number) {
		let distance: number;
		if (distance_metric === undefined) {
			distance = this.metric_distance(z);
		} else {
			distance = distance_metric;
		}

		return (D_e * (1 + z)) / distance;
	}

	/**
	 * formula 1/(1 + x) * sqrt(1 / F)
	 * @param Simu object in witch method is applied, permit to use this function with simulation method
	 * @param x variable
	 * @returns 1/(1 + x) * sqrt(1 / F)
	 */
	protected integral_duration(Simu: Simulation_universe, x: number): number {
		return (
			(1 / (1 + x)) * Math.sqrt(1 / Simu.F(x))
		)
	}

	/**
	 * formula 1/(1 + x) * 1/sqrt(F) with the substitution x = y/(1 - y), to be used with simpson method to compute duration.
	 * @param Simu object in witch method is applied, permit to use this function with simulation method
	 * @param y variable
	 * @returns (1 - y) * 1/sqrt(F(x)) * 1/(1 - y)²\
	 *
	 * Note : 1/(1 - y)² is the term come from dx = dy/(1 - y)²
	 */
	protected integral_duration_substituated(Simu: Simulation_universe, y: number): number {
		return (
			(((1 - y) / Math.pow(1 - y, 2))) /
			Math.sqrt(Simu.F(y / (1 - y)))
		);
	}

	/**
	 * Integral used to compute the distances
	 * @param Simu object in witch method is applied, permit to use this function with simulation method
	 * @param x variable
	 * @returns 1/F²(x)
	 */
	protected integral_distance(Simu: Simulation_universe, x: number): number {
		return 1 / Math.sqrt(Simu.F(x));
	}

	/**
	 * Right part of the differential equation of a(tau) designed to be used in runge_kutta_universe_2 method
	 * @param Simu object in witch method is applied, permit to use this function with simulation method
	 * @param tau time
	 * @param a function a(t)
	 * @param da derivative of a(t)
	 * @returns result of the right part\
	 * Note: tau and da are not used but have to be defined for this method to be accepted in the runge_kutta_equation_order2 method of simulation class
	 */
	protected equa_diff_a(Simu: Simulation_universe, tau: number, a: number, da: number = 0): number {
		let omega_r = Simu.calcul_omega_r();
		let omega_m = Simu.matter_parameter;
		let omega_de = Simu.dark_energy.parameter_value;
		return (
			-(omega_r / a ** 3) -
			(0.5 * omega_m) / a ** 2 +
			omega_de *
			(a * Simu.Y(a) + (a ** 2 * Simu.dY(a)) / 2)
		);
	}

	/**
	 * Right part of the differential equation of t(z) designed to be used in runge_kutta_universe_1 method
	 * @param Simu object in witch method is applied, permit to use this function with simulation method
	 * @param z Cosmologic shift
	 * @param t function time t(z)
	 * @returns result of the right part\
	 * Note: t is not used but has to be defined for this method to be accepted in the runge_kutta_equation_order1 method of simulation class
	 */
	protected equa_diff_time(Simu: Simulation_universe, z: number, t: number = 0): number {
		return 1 / (this.hubble_cst * (1 + z) * Math.sqrt(Simu.F(z)));
	}
}