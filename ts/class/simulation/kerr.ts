import { Simulation_trajectory } from "./simulation_trajectory";

/**
 * @class Kerr
 * 
 * Inherited from Simulation_trajectory class.
 * This class will implement the different equations for the Kerr metric.
 * https://www.lupm.in2p3.fr/cosmogravity/theorie/theorie_trajectoires_FR.pdf
 * Note: This code uses acronyms to differentiate between the different categories
 * covered by the theory (example: KM_PH = Kerr Metric for a Photon).
 * 
 * Methods:
 * @method KM_delta_r
 * @method KM_MP_integration_constants
 * @method KM_MP_potential_A
 * @method KM_MP_potential_DO
 * @method KM_MP_trajectory_A
 * @method KM_MP_trajectory_DO
 * @method KM_PH_integration_constants
 * @method KM_PH_potential_A
 * @method KM_PH_potential_DO
 * @method KM_PH_trajectory_A
 * @method KM_PH_trajectory_DO
 */

export class Kerr extends Simulation_trajectory {


    //-------------------- Constructors --------------------


    constructor(
		id: string,
		collidable: boolean,
		mass: number,
		radius: number,
		angular_m: number
	) {
    	super(id, collidable, mass, radius, angular_m);
	}


	//---------------------- Methods -----------------------


	/*
	 * The spacial and temporal coordinates are (r, theta, phi, t)
	 * All simulations take place on the theta=pi/2 plane
	 * U_r and U_phi are the velocity coordinates
	 * R_s Schwarzschild radius. The Kerr metric also uses R_h+ and R_h-, see theory.
	 * A new variable delta is defined for the Kerr metric relative to R_h+ and R_h-.
	 * L and E are two integration constants determined with the 
	 * initial conditions. L is a length and E is adimentional.
	 * The "trajectory" functions are to be called by the Runge-Kutta algorithm.
	 * The suffix A or DO refer to Astronaut or Distant Oberver.
	 */ 


	/**
	 * Kerr metric (KM)
	 * 
	 * Defines a new variable delta(r)
	 * @param R_hp parameter of the central body R_h+
	 * @param R_hm parameter of the central body R_h-
	 * @param r radial coordinate
	 * 
	 * @returns delta(r)
	 */
	protected KM_delta_r(R_hp: number, R_hm: number, r: number): number
	{
		return (r - R_hp) * (r - R_hm);
	}


	//	1) For a massive particle (KM_MP)


	/**
	 * Kerr metric for a massive particle (KM_MP)
	 * 
	 * Integration constants in a list of two elements.
	 * @param R_s schwarzschild radius
	 * @param a calculated central mass parameter
	 * @param delta_0 kerr metric variable delta(r) at t=0
	 * @param r_0 r(0), radial coordinate at t=0
	 * @param U_r_0 U_r(r_0), velocity's radial coordinate
	 * @param U_phi_0 U_phi(r_0), velocity's angular coordinate at t=0
	 * 
	 * @returns list where list[0]=L and list[1]=E
	 */
	protected KM_MP_integration_constants(
		R_s: number,
		a: number,
		delta_0: number,
		r_0: number,
		U_r_0: number,
		U_phi_0: number
	): number[]
	{
		let E = Math.sqrt(U_r_0**2 * (r_0 - R_s)
		* r_0**3 + c**2 * r_0 * (r_0 - R_s) * delta_0 + delta_0**2 * U_phi_0**2)
		/ (c**2 * r_0**2 * delta_0);
        let L = 1 / (c * (r_0 - R_s)) * (delta_0 * U_phi_0 - R_s * a * c * E);
        return [L, E];
    }


	/**
	 * Kerr metric for a massive particle (KM_MP)
	 * 
	 * Potential for an astronaut (A) divided by c²
	 * @param R_s schwarzschild radius
	 * @param a calculated central mass parameter
	 * @param r radial coordinate
	 * @param L integration constant
	 * @param E integration constant
	 * 
	 * @result potential
	 */
	protected KM_MP_potential_A(
		R_s: number,
		a: number,
		r: number,
		L: number,
		E: number
	): number
	{
		return 1 - R_s / r - (a**2 * (E**2 - 1) - L**2) / r**2
		- R_s * Math.pow(L - a * E, 2) / r**3;
	}


	/**
	 * Kerr metric for a massive particle (KM_MP)
	 * 
	 * Potential for a distant observer (DO) divided by c²
	 * @param R_s schwarzschild radius
	 * @param r radial coordinate
	 * @param a calculated central mass parameter
	 * @param delta_r kerr metric variable delta(r)
	 * @param L integration constant
	 * @param E integration constant
	 * 
	 * @result potential
	 */
	protected KM_MP_potential_DO(
		R_s: number,
		a: number,
		r: number,
		delta_r: number,
		L: number,
		E: number
	): number
	{
		let V_a = 1 - R_s / r - (a**2 * (E**2 - 1) - L**2) / r**2
		- R_s * Math.pow(L - a * E, 2) / r**3;
		let X = (c**2 * E**2 - V_a) * delta_r**2;
		let Y = (r**2 + a**2 + R_s * a**2 / r) * E - R_s * a * L / r;
		return E**2 - X / (Y**2 * c**2);
	}


	/**
	 * Kerr metric for a massive particle (KM_MP)
	 * 
	 * Second derivative d²r/dtau² for an astronaut (A).
	 * 
	 * This method is to be used with Runge-Kutta.
	 * @param R_s schwarzschild radius
	 * @param r radial coordinate
	 * @param a calculated central mass parameter
	 * @param L integration constant
	 * @param E integration constant
	 */
	protected KM_MP_trajectory_A(
		R_s: number,
		r: number,
		a: number,
		L: number,
		E: number
	): number
	{
		return c**2 / (2 * r**4)
		* (R_s * r**2 + 2*r * (a**2 * (E**2 - 1) - L**2) + 3*R_s * (L - a * E)**2);
	}


	/**
	 * Kerr metric for a massive particle (KM_MP)
	 * 
	 * Second derivative d²r/dt² for a distant observer (DO)
	 * 
	 * This method is to be used with Runge-Kutta.
	 * @param R_s schwarzschild radius
	 * @param r radial coordinate
	 * @param a calculated central mass parameter
	 * @param delta_r kerr metric variable delta(r)
	 * @param L integration constant
	 * @param E integration constant
	 */
	protected KM_MP_trajectory_DO(
		R_s: number,
		r: number,
		a: number,
		delta_r: number,
		L: number,
		E: number
	): number
	{
		let W = (r**2 + a**2 + R_s * a**2 / r) * E - R_s * a * L / r;
		let X = E**2 * a**2 - L**2 - a**2;
		let Y = R_s * (L - a * E)**2;
		let Z = 2*(E**2 - 1 + R_s / r + X / r**2 + Y / r**3);

		return c**2 * delta_r / (2 * W**2)
		* ((-R_s / r**2 - 2*X / r**3 - 3*Y / r**4) * delta_r
		+ Z * (2*r - R_s)
		- Z * ((2*r - R_s * a**2 / r**2) * E + R_s * a * L / r**2) * delta_r / W);
	}


	//	2) For a photon (KM_PH)


	/**
	 * Kerr metric for a photon (KM_PH)
	 * 
	 * Integration constants in a list of two elements.
	 * @param R_s schwarzschild radius
	 * @param a calculated central mass parameter
	 * @param delta_0 delta(r_0), kerr metric variable at t=0
	 * @param r_0 r(0), radial coordinate at t=0
	 * @param U_r_0 U_r(r_0), velocity's radial coordinate
	 * @param U_phi_0 U_phi(r_0), velocity's angular coordinate at t=0
	 * 
	 * @returns list where list[0]=L and list[1]=E
	 */
	protected KM_PH_integration_constants(
		R_s: number,
		a: number,
		delta_0: number,
		r_0: number,
		U_r_0: number,
		U_phi_0: number
	): number[]
	{
		let E = Math.sqrt(U_r_0**2 * (r_0 - R_s) * r_0**3 + delta_0**2 * U_phi_0**2)
		/ (c**2 * r_0**2 * delta_0);
        let L = 1 / (c * (r_0 - R_s)) * (delta_0 * U_phi_0 - R_s * a * c * E);
        return [L, E];
    }


	/**
	 * Kerr metric for a massive particle (KM_PH)
	 * 
	 * Potential for an astronaut (A) divided by c²
	 * @param R_s schwarzschild radius
	 * @param a calculated central mass parameter
	 * @param r radial coordinate
	 * @param L integration constant
	 * @param E integration constant
	 * 
	 * @result potential
	 */
	protected KM_PH_potential_A(
		R_s: number,
		a: number,
		r: number,
		L: number,
		E: number
	): number
	{
		return -(a**2 * E**2 - L**2) / r**2 - R_s * Math.pow(L - a * E, 2) / r**3;
	}


	/**
	 * Kerr metric for a massive particle (KM_MP)
	 * 
	 * Potential for a distant observer (DO) divided by c²
	 * @param R_s schwarzschild radius
	 * @param r radial coordinate
	 * @param a calculated central mass parameter
	 * @param delta_r kerr metric variable delta(r)
	 * @param L integration constant
	 * @param E integration constant
	 * 
	 * @result potential
	 */
	protected KM_PH_potential_DO(
		R_s: number,
		a: number,
		r: number,
		delta_r: number,
		L: number,
		E: number
	): number
	{
		let V_a = -(a**2 * E**2 - L**2) / r**2 - R_s * Math.pow(L - a * E, 2) / r**3;
		let X = (c**2 * E**2 - V_a) * delta_r**2;
		let Y = (r**2 + a**2 + R_s * a**2 / r) * E - R_s * a * L / r;
		return E**2 - X / (Y**2 * c**2);
	}

	
	/**
	 * Kerr metric for a photon (KM_PH)
	 * 
	 * Second derivative d²r/dlambda² for an astronaut (A)
	 * 
	 * This method is to be used with Runge-Kutta.
	 * @param R_s schwarzschild radius
	 * @param r radial coordinate
	 * @param a calculated central mass parameter
	 * @param L integration constant
	 * @param E integration constant
	 */
	protected KM_PH_trajectory_A(
		R_s: number,
		r: number,
		a: number,
		L: number,
		E: number
	): number
	{
		return -(c**2 / (2 * r**4))
		* (2*r * (a**2 * E**2 - L**2) + 3*R_s * (L - a * E)**2);
	}


	/**
	 * Kerr metric for a photon (KM_PH)
	 * 
	 * Second derivative d²r/dt² for a distant observer (DO)
	 * 
	 * This method is to be used with Runge-Kutta.
	 * @param R_s schwarzschild radius
	 * @param r radial coordinate
	 * @param a calculated central mass parameter
	 * @param delta_r kerr metric variable delta(r)
	 * @param L integration constant
	 * @param E integration constant
	 */
	protected KM_PH_trajectory_DO(
		R_s: number,
		r: number,
		a: number,
		delta_r: number,
		L: number,
		E: number
	): number
	{
		let W = (r**2 + a**2 + R_s * a**2 / r) * E - R_s * a * L / r;
		let X = E**2 * a**2 - L**2;
		let Y = R_s * (L - a * E)**2;
		let Z = 2*(E**2 + X / r**2 + Y / r**3);

		return c**2 * delta_r / (2 * W**2)
		* ((-2*X / r**3 - 3*Y / r**4) * delta_r
		+ Z * (2*r - R_s)
		- Z * ((2*r - R_s * a**2 / r**2) * E + R_s * a * L / r**2) * delta_r / W);
	}


}