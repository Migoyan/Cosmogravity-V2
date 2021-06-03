import { Mobile } from "./simulation objects/mobile";
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
 * @method integration_constants
 * @method runge_kutta_trajectory
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

export class Kerr extends Simulation_trajectory
{

    //-------------------- Constructor ---------------------


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


	/**
     * Determines which mathematical expression should be used to calculated the
     * integration constant for a specific simulation and mobile type.
     * 
     * @returns Table containing the integration constants for each mobile object
     */
	public integration_constants(): number[][]
	{
		let a = this.central_body.calculate_a();
		let R_s = this.central_body.calculate_R_s();
		let R_hp = this.central_body.calculate_R_hp(R_s, a);
		let R_hm = this.central_body.calculate_R_hm(R_s, a);
		let result: number[][];

		this.mobile_list.forEach(mobile =>
		{
			let delta_0 = this.KM_delta_r(R_hp, R_hm, mobile.r);

			if (!mobile.is_photon)
			{
				result.push(
					this.KM_MP_integration_constants(
						R_s,
						a,
						delta_0,
						mobile.r,
						mobile.U_r,
						mobile.U_phi
					)
				);
			}
			else if (mobile.is_photon)
			{
				result.push(
					this.KM_PH_integration_constants(
						R_s,
						a,
						delta_0,
						mobile.r,
						mobile.U_r,
						mobile.U_phi
					)
				);
			}
		});
		return result;
	}


   /**
     * Applies the Runge-Kutta algorithm to the relevant second derivative expression
     * for the current simulation.
     * 
     * @param mobile Mobile object
     * @param reference_frame Astronaut (A), Distant Observer (DO)
     * @param L Integration constant
     * @param E Integration constant
     * 
     * @returns [x_1, y_1, yp_1], value of the next point of computation
     */
    public runge_kutta_trajectory(
        mobile: Mobile,
        reference_frame: "A" | "DO",
        L: number, 
        E: number
    ): number
    {
		let a = this.central_body.calculate_a();
        let R_s = this.central_body.calculate_R_s();
        let R_hp = this.central_body.calculate_R_hp(R_s, a);
		let R_hm = this.central_body.calculate_R_hm(R_s, a);
		let delta_r = this.KM_delta_r(R_hp, R_hm, mobile.r);

		if (!mobile.is_photon && reference_frame === "A")
		{
			return this.KM_MP_trajectory_A(R_s, mobile.r, a, L, E);
		}
		else if (!mobile.is_photon && reference_frame === "DO")
		{
			return this.KM_MP_trajectory_DO(R_s, mobile.r, a, delta_r, L, E);
		}
		else if (mobile.is_photon && reference_frame === "A")
		{
			return this.KM_PH_trajectory_A(R_s, mobile.r, a, L, E);
		}
		else if (mobile.is_photon && reference_frame === "DO")
		{
			return this.KM_PH_trajectory_DO(R_s, mobile.r, a, delta_r, L, E);
		}
    }


	/*
	 * The spacial and temporal coordinates are (r, theta, phi, t)
	 * All simulations take place on the theta=pi/2 plane
	 * U_r and U_phi are the velocity coordinates
	 * R_s Schwarzschild radius. The Kerr metric also uses R_h+ and R_h-, see theory.
	 * A new variable delta is defined for the Kerr metric relative to R_h+ and R_h-.
	 * L and E are two Integration constants determined with the 
	 * initial conditions. L is a length and E is adimentional.
	 * The "trajectory" functions are to be called by the Runge-Kutta algorithm.
	 * The suffix A or DO refer to Astronaut or Distant Oberver.
	 */ 


	/**
	 * Kerr metric (KM)
	 * 
	 * Defines a new variable delta(r)
	 * @param R_hp Parameter of the central body R_h+
	 * @param R_hm Parameter of the central body R_h-
	 * @param r Radial coordinate
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
	 * @param R_s Schwarzschild radius
	 * @param a Calculated central body parameter
	 * @param delta_0 Kerr metric variable delta(r) at t=0
	 * @param r_0 r(0), radial coordinate at t=0
	 * @param U_r_0 U_r(r_0), velocity's radial coordinate
	 * @param U_phi_0 U_phi(r_0), velocity's angular coordinate at t=0
	 * 
	 * @returns List where list[0]=L and list[1]=E
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
	 * @param R_s Schwarzschild radius
	 * @param a Calculated central body parameter
	 * @param r Radial coordinate
	 * @param L Integration constant
	 * @param E Integration constant
	 * 
	 * @result Potential
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
	 * @param R_s Schwarzschild radius
	 * @param r Radial coordinate
	 * @param a Calculated central body parameter
	 * @param delta_r Kerr metric variable delta(r)
	 * @param L Integration constant
	 * @param E Integration constant
	 * 
	 * @result Potential
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
	 * @param R_s Schwarzschild radius
	 * @param r Radial coordinate
	 * @param a Calculated central body parameter
	 * @param L Integration constant
	 * @param E Integration constant
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
	 * @param R_s Schwarzschild radius
	 * @param r Radial coordinate
	 * @param a Calculated central body parameter
	 * @param delta_r Kerr metric variable delta(r)
	 * @param L Integration constant
	 * @param E Integration constant
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
	 * @param R_s Schwarzschild radius
	 * @param a Calculated central body parameter
	 * @param delta_0 delta(r_0), Kerr metric variable at t=0
	 * @param r_0 r(0), Radial coordinate at t=0
	 * @param U_r_0 U_r(r_0), velocity's Radial coordinate
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
	 * @param R_s Schwarzschild radius
	 * @param a Calculated central body parameter
	 * @param r Radial coordinate
	 * @param L Integration constant
	 * @param E Integration constant
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
	 * @param R_s Schwarzschild radius
	 * @param r Radial coordinate
	 * @param a Calculated central body parameter
	 * @param delta_r Kerr metric variable delta(r)
	 * @param L Integration constant
	 * @param E Integration constant
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
	 * @param R_s Schwarzschild radius
	 * @param r Radial coordinate
	 * @param a Calculated central body parameter
	 * @param L Integration constant
	 * @param E Integration constant
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
	 * @param R_s Schwarzschild radius
	 * @param r Radial coordinate
	 * @param a Calculated central body parameter
	 * @param delta_r Kerr metric variable delta(r)
	 * @param L Integration constant
	 * @param E Integration constant
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