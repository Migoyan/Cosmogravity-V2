import { Simulation } from "./simulation";
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
 * @method runge_kutta_universe_2
 * @method calcul_omega_r
 * @method calcul_omega_k
 * @method Y
 * @method dY
 * @method F
 * @method get_interval_a
 * @method compute_a_tau
 * @method time
 * @method universe_age
 * @method duration
 * @method metric_distance
 * @method luminosity
 * @method luminosity_distance
 * @method angular_diameter_distance
 * @method brightness
 * @method apparent_diameter
 * @method integral_duration
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
		parameter_value: 6.9110e-1,
		w_0: -1,
		w_1: 0
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
		matter_parameter: number = 3.0890e-1,
		has_cmb: boolean = true,
		has_neutrino: boolean = true,
		is_flat: boolean = false
	) {
		super(id);
		this._temperature = temperature;
		this._hubble_cst = hubble_cst;
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
	}

	// hubble_cst
	public get hubble_cst(): number {
		return this._hubble_cst;
	}

	public set hubble_cst(hubble_cst: number) {
		this._hubble_cst = hubble_cst;
	}

	// matter_parameter
	public get matter_parameter(): number {
		return this._matter_parameter;
	}

	public set matter_parameter(matter_parameter: number) {
		this._matter_parameter = matter_parameter;
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
	}

	// has_neutrino
	public get has_neutrino(): boolean {
		return this._has_neutrino;
	}

	public set has_neutrino(has_neutrino: boolean) {
		this._has_neutrino = has_neutrino;
	}

	// is_flat
	public get is_flat(): boolean {
		return this.is_flat;
	}

	public set is_flat(is_flat: boolean) {
		this._is_flat = is_flat;
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
	public modify_dark_energy(DE_parameter_value?: number, DE_w_0?: number, DE_w_1?: number): void {
		if (DE_parameter_value !== undefined) {
			this._dark_energy.parameter_value = DE_parameter_value;
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
	public modify_constants(c?: number, k?: number, h?: number, G?: number): void {
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
	 public runge_kutta_universe_1(
		step: number,
		x_0: number = 0,
		y_0: number = 1,
		funct: (x: number, y: number) => number,
		interval: number[] = [0, 5],
	)
    {
		// Init parameter
		let x: number[] = [x_0];
		let y: number[] = [y_0];
		
		// Computation loops
		// Computing with a positive step, i increments the array
		let i = 0;
		let result_runge_kutta: number[];
		while (interval[0] <= x[i] && x[i] < interval[1]) {
			result_runge_kutta = this.runge_kutta_equation_order1(step, x[i], y[i], funct);
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
			result_runge_kutta = this.runge_kutta_equation_order1(-step, x[0], y[0], funct);
			x.unshift(result_runge_kutta[0]);
			y.unshift(result_runge_kutta[1]);
			i++;
		}

		return {x: x, y: y};
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
	public runge_kutta_universe_2(
		step: number,
		x_0: number = 0,
		y_0: number = 1,
		yp_0: number = 1,
		funct: (x: number, y: number, yp: number) => number,
		interval: number[] = [0, 5],
	)
    {
		// Init parameter
		let x: number[] = [x_0];
		let y: number[] = [y_0];
		let yp: number[] = [yp_0];
		
		// Computation loops
		// Computing with a positive step, i increments the array
		let i = 0;
		let result_runge_kutta: number[];
		while (interval[0] <= y[i] && y[i] < interval[1]) {
			result_runge_kutta = this.runge_kutta_equation_order2(step, x[i], y[i], yp[i], funct);
			x.push(result_runge_kutta[0]);
			y.push(result_runge_kutta[1]);
			yp.push(result_runge_kutta[1]);
			i++;
		}
		

		/*
			Computing with a negative step,
			since we decrease the value of x we add the elements at the beginning of the arrays,
			so for each step we take the first element of the array to compute the next one.
		*/
		while (interval[0] <= y[0] && y[0] < interval[1]) {
			result_runge_kutta = this.runge_kutta_equation_order2(-step, x[0], y[0], yp[0], funct);
			x.unshift(result_runge_kutta[0]);
			y.unshift(result_runge_kutta[1]);
			yp.unshift(result_runge_kutta[1]);
			i++;
		}

		return {x: x, y: y, dy: yp};
	}

	/**
	 * @returns the radiation density parameter
	 */
	public calcul_omega_r(): number {
		let sigma: number = (2 * Math.pow(Math.PI, 5) * Math.pow(this.constants.k, 4)) / (15 * Math.pow(this.constants.h, 3) * Math.pow(this.constants.c, 2))
		let rho_r: number = (4 * sigma * Math.pow(this.temperature, 4)) / (Math.pow(this.constants.c, 3));

		// Hubble-Lemaître constant in international system units (Système International)
		let H0_si: number = this.hubble_cst * 1e3 / ((AU * (180 * 3600)) / Math.PI * 1e6);
		let omega_r: number = (8 * Math.PI * this.constants.G * rho_r) / (3 * Math.pow(H0_si, 2));

		if (this.has_neutrino) {
			omega_r *= 1.68;
		}
		if (this.has_cmb) {
			omega_r **= 3;
		}
		if(!(this.has_neutrino && this.has_cmb)) {
			omega_r = 0;
		}

		return omega_r;
	}

	/**
	 * @returns the curvature density parameter
	 */
	 public calcul_omega_k(): number {
		return 1 - this.calcul_omega_r() - this.matter_parameter - this.dark_energy.parameter_value;
	}

	/**
	 * Y function \
	 * see Theory about cosmology and dark_energy
	 * @param x variable
	 * @returns value of Y at position x
	 */
	public Y(x: number): number {
		return Math.exp(
			-3 * (this.dark_energy.w_0 + this.dark_energy.w_1 + 1) * Math.log(x) -
			3 * this.dark_energy.w_1 * (1 - x)
		);
	}

	/**
	 * Y' function \
	 * see Theory about cosmology and dark_energy
	 * @param x variable
	 * @returns value of the derivative of Y at position x
	 */
	public dY(x: number): number {
		return this.Y(x) * (
			3 * this.dark_energy.w_1 - 3 * (1 + this.dark_energy.w_0 + this.dark_energy.w_1)
		);
	}

	/**
	 * F function \
	 * see Theory about cosmology and dark_energy
	 * @param x variable
	 * @returns value of F(x)
	 */
	public F(x: number): number {
		return ((1 + x)**2) * this.calcul_omega_k() +
		((1 + x)**3) * this.matter_parameter +
		((1 + x)**4) * this.calcul_omega_r() +
		this.Y(1/(1 + x)) * this.dark_energy.parameter_value;
	}

	/**
	 * 
	 * @returns array [amin, amax]
	 */
	public get_interval_a() {
		return [];
	}

	/**
	 * compute_a_tau in point 
	 * @param step Computation step
	 */
	public compute_a_tau(step: number) {
		return this.runge_kutta_universe_2(step, 0, 1, 1, this.equa_diff_a, this.get_interval_a());
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
		
		return this.runge_kutta_universe_1(step, zmin, time_zmin, this.equa_diff_time, [zmin, zmax]);
	}

	/**
	 * Compute the current universe's age
	 * @returns the current age of the universe
	 */
	public universe_age(): number {
		/*
		To compute the age of the universe we need to integrate from x = 0 to x -> infinity. To resolve this problem we do a substitution with
		x = y / (1 - y) which implies dx = dy / (1 - y)². This result with an integral from y = 0 to y = 1 that can be digitally resolved.
		*/
		let age: number;
		let H0_si: number = this.hubble_cst * 1e3 / ((AU * (180 * 3600)) / Math.PI * 1e6);
		age = this.simpson(this.integral_duration_substituated, 0, 1, 100) / H0_si
		return age;
	}

	/**
	 * Compute the cosmologic duration between two cosmologics shift z
	 * @param z_1 the closest cosmologic shift from ours (z = 0)
	 * @param z_2 the farest cosmologic shift from ours (z = 0)
	 * @returns error if z_1 or z_2 < -1, duration if both value are accepted.
	 */
	public duration(z_1: number, z_2: number) {
		if ( z_1 < -1 || z_2 < -1 ) {
			throw new Error("Cosmologic shift z cannot be lower than -1");
		}

		let duration: number;
		duration = this.simpson(this.integral_duration, z_2, z_1, 100);
		return duration;
	}

	/**
	 * Compute the distance between us and an object at a cosmologic redshit z
	 * @param z cosmologic shift
	 * @returns the distance
	 */
	public metric_distance(z: number): number {
		let distance: number;
		let courbure: number = this.calcul_omega_k();
		let H0_si: number = this.hubble_cst * 1e3 / ((AU * (180 * 3600)) / Math.PI * 1e6);
		distance = this.simpson(this.integral_distance, 0, z, 100)
		if (courbure < 0) {
			distance = Math.sinh(Math.sqrt(Math.abs(courbure)) * distance) / Math.sqrt(Math.abs(courbure));
		} else if (courbure > 0) {
			distance = Math.sin(Math.sqrt(Math.abs(courbure)) * distance) / Math.sqrt(Math.abs(courbure));
		}
		distance *= (this.constants.c / H0_si)
		return distance;
	}

	/**
	 * Compute the luminosity distance
	 * @param z Cosmologic shift
	 * @param distance_metric optionnal parameters for optimisation (permit you to pass an already calculated distances for optimisation)
	 * @returns luminosity distance
	 */
	public luminosity_distance (z: number, distance_metric?: number) {
		let distance: number;
		if (distance_metric === undefined) {
			distance = this.metric_distance(z);
		} else {
			distance = distance_metric;
		}

		return distance * (1 + z)
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
	public brightness(z: number, luminosity: number, distance_metric?: number): number {
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

		return D_e * (1 + z) / distance;
	}

	/**
	 * @param x variable
	 * @returns 1/(1 + x) * 1/sqrt(F(x))
	 */
	public integral_duration(x: number): number {
		return 1/(1 + x) * 1/Math.sqrt(this.F(x));
	}

	/**
	 * Function integral_duration with the substitution x = y/(1 - y)
	 * @param y variable
	 * @returns (1 - y) * 1/sqrt(F(x)) * 1/(1 - y)²\
	 * 
	 * Note : 1/(1 - y)² is the term come from dx = dy/(1 - y)²
	 */
	public integral_duration_substituated(y: number): number {
		return (1 - y) * 1/Math.pow(1 - y, 2) * 1/Math.sqrt(this.F(y/(1 - y)));
	}

	/**
	 * Integral used to compute the distances
	 * @param x variable
	 * @returns 1/F²(x)
	 */
	public integral_distance(x : number): number {
		return 1 / Math.sqrt(this.F(x));
	}

	/**
	 * Right part of the differential equation of a(tau) designed to be used in runge_kutta_universe_2 method
	 * @param tau time
	 * @param a function a(t)
	 * @param da derivative of a(t)
	 * @returns result of the right part\
	 * Note: tau and da are not used but have to be defined for this method to be accepted in the runge_kutta_equation_order2 method of simulation class
	 */
	 public equa_diff_a(tau: number = 0, a: number, da: number = 0): number {
		return -(this.calcul_omega_r() / a**2) -
		0.5 * this.calcul_omega_r() / a**2 +
		this.dark_energy.parameter_value * (a * this.Y(a) + a**2 *  this.dY(a)/ 2);
	}

	/**
	 * Right part of the differential equation of t(z) designed to be used in runge_kutta_universe_1 method
	 * @param z Cosmologic shift
	 * @param t function time t(z)
	 * @returns result of the right part\
	 * Note: t is not used but has to be defined for this method to be accepted in the runge_kutta_equation_order1 method of simulation class
	 */
	public equa_diff_time(z: number, t: number = 0) {
		let H0_si: number = this.hubble_cst * 1e3 / ((AU * (180 * 3600)) / Math.PI * 1e6);
		return 1 / (H0_si * (1 + z) * Math.sqrt(this.F(z)));
	}
}