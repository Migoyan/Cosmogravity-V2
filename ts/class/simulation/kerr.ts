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
     * Method that loops over the mobile list and determines
     * the correct integration constants before storing them
     * in each mobile as a property.
     */
	public integration_constants(): void
	{
		this.mobile_list.forEach(mobile =>
		{
			if (!mobile.is_photon)
			{
				this.KM_MP_integration_constants(mobile);
			}
			else
			{
				this.KM_PH_integration_constants(mobile);
			}
		});
	}


   /**
     * * Applies the Runge-Kutta algorithm to the relevant second derivative expression
     * for the current simulation.
     * @param mobile Mobile object
     * @param reference_frame Astronaut (A), Distant Observer (DO)
     * @returns [x_1, y_1, yp_1], value of the next point of computation
     */
    public runge_kutta_trajectory( mobile: Mobile, reference_frame: "A" | "DO"): number
    {
		if (!mobile.is_photon && reference_frame === "A")
		{
			return this.KM_MP_trajectory_A(mobile);
		}
		else if (!mobile.is_photon && reference_frame === "DO")
		{
			return this.KM_MP_trajectory_DO(mobile);
		}
		else if (mobile.is_photon && reference_frame === "A")
		{
			return this.KM_PH_trajectory_A(mobile);
		}
		else if (mobile.is_photon && reference_frame === "DO")
		{
			return this.KM_PH_trajectory_DO(mobile);
		}
    }


	/*
	 * The spacial and temporal coordinates are (r, theta, phi, t)
	 * All simulations take place on the theta=pi/2 plane
	 * U_r and U_phi are the velocity coordinates
	 * this.central_body.R_s Schwarzschild radius. The Kerr metric also uses R_h+ and R_h-, see theory.
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
	 * @param mobile
	 * @returns delta(r)
	 */
	protected KM_delta_r(mobile: Mobile): number
	{
		return (mobile.r - this.central_body.R_hp)
		* (mobile.r - this.central_body.R_hm);
	}


	//	1) For a massive particle (KM_MP)


	/**
	 * Kerr metric for a massive particle (KM_MP)
	 * 
	 * Integration constants in a list of two elements.
	 * @param mobile
	 */
	protected KM_MP_integration_constants(mobile: Mobile): void
	{
		mobile.E = Math.sqrt(mobile.U_r**2 * (mobile.r - this.central_body.R_s)
		* mobile.r**3 + c**2 * mobile.r * (mobile.r - this.central_body.R_s)
		* this.KM_delta_r(mobile) + this.KM_delta_r(mobile)**2 * mobile.U_phi**2)
		/ (c**2 * mobile.r**2 * this.KM_delta_r(mobile));

		mobile.L = 1 / (c * (mobile.r - this.central_body.R_s))
		* (this.KM_delta_r(mobile) * mobile.U_phi - this.central_body.R_s
		* this.central_body.a * c * mobile.E);
    }


	/**
	 * Kerr metric for a massive particle (KM_MP)
	 * 
	 * Potential for an astronaut (A) divided by c²
	 * @param mobile
	 * @result Potential
	 */
	protected KM_MP_potential_A(mobile: Mobile): number
	{
		return 1 - this.central_body.R_s / mobile.r
		- (this.central_body.a**2 * (mobile.E**2 - 1) - mobile.L**2) / mobile.r**2
		- this.central_body.R_s * Math.pow(mobile.L - this.central_body.a * mobile.E, 2)
		/ mobile.r**3;
	}


	/**
	 * Kerr metric for a massive particle (KM_MP)
	 * 
	 * Potential for a distant observer (DO) divided by c²
	 * @param mobile
	 * @result Potential
	 */
	protected KM_MP_potential_DO(mobile: Mobile): number
	{
		let R_s = this.central_body.R_s;
		let a = this.central_body.a;

		let V_a = 1 - R_s / mobile.r
		- (a**2 * (mobile.E**2 - 1) - mobile.L**2) / mobile.r**2
		- R_s * Math.pow(mobile.L - a * mobile.E, 2) / mobile.r**3;

		let X = (c**2 * mobile.E**2 - V_a) * this.KM_delta_r(mobile)**2;

		let Y = (mobile.r**2 + a**2 + R_s * a**2 / mobile.r)
		* mobile.E - R_s * a * mobile.L / mobile.r;

		return mobile.E**2 - X / (Y**2 * c**2);
	}


	/**
	 * Kerr metric for a massive particle (KM_MP)
	 * 
	 * Second derivative d²r/dtau² for an astronaut (A).
	 * 
	 * This method is to be used with Runge-Kutta.
	 * @param mobile
	 */
	protected KM_MP_trajectory_A(mobile: Mobile): number
	{
		return c**2 / (2 * mobile.r**4)
		* (this.central_body.R_s * mobile.r**2 + 2*mobile.r
			* (this.central_body.a**2 * (mobile.E**2 - 1) - mobile.L**2)
			+ 3*this.central_body.R_s * (mobile.L - this.central_body.a * mobile.E)**2);
	}


	/**
	 * Kerr metric for a massive particle (KM_MP)
	 * 
	 * Second derivative d²r/dt² for a distant observer (DO)
	 * 
	 * This method is to be used with Runge-Kutta.
	 * @param mobile
	 */
	protected KM_MP_trajectory_DO(mobile: Mobile): number
	{
		let R_s = this.central_body.R_s;
		let a = this.central_body.a;

		let W = (mobile.r**2 + a**2 + R_s * a**2 / mobile.r)
		* mobile.E - R_s * a * mobile.L / mobile.r;

		let X = mobile.E**2 * a**2 - mobile.L**2 - a**2;

		let Y = R_s * (mobile.L - a * mobile.E)**2;

		let Z = 2*(mobile.E**2 - 1 + R_s / mobile.r + X / mobile.r**2 + Y / mobile.r**3);

		return c**2 * this.KM_delta_r(mobile) / (2 * W**2)
		* ((-R_s / mobile.r**2 - 2*X / mobile.r**3 - 3*Y / mobile.r**4)
		* this.KM_delta_r(mobile) + Z * (2*mobile.r - R_s)
		- Z * ((2*mobile.r - R_s * a**2 / mobile.r**2) 
		* mobile.E + R_s * a * mobile.L / mobile.r**2) * this.KM_delta_r(mobile) / W);
	}


	//	2) For a photon (KM_PH)


	/**
	 * Kerr metric for a photon (KM_PH)
	 * 
	 * Integration constants in a list of two elements.
	 * @param mobile
	 */
	protected KM_PH_integration_constants(mobile: Mobile): void
	{
		mobile.E = Math.sqrt(mobile.U_r**2 * (mobile.r - this.central_body.R_s)
		* mobile.r**3 + this.KM_delta_r(mobile)**2 * mobile.U_phi**2)
		/ (c**2 * mobile.r**2 * this.KM_delta_r(mobile));

        mobile.L = 1 / (c * (mobile.r - this.central_body.R_s)) * (this.KM_delta_r(mobile)
		* mobile.U_phi - this.central_body.R_s * this.central_body.a * c * mobile.E);

    }


	/**
	 * Kerr metric for a massive particle (KM_PH)
	 * 
	 * Potential for an astronaut (A) divided by c²
	 * @param mobile
	 * @result potential
	 */
	protected KM_PH_potential_A(mobile: Mobile): number
	{
		return -(this.central_body.a**2 * mobile.E**2 - mobile.L**2)
		/ mobile.r**2 - this.central_body.R_s
		* Math.pow(mobile.L - this.central_body.a * mobile.E, 2) / mobile.r**3;
	}


	/**
	 * Kerr metric for a massive particle (KM_MP)
	 * 
	 * Potential for a distant observer (DO) divided by c²
	 * @param mobile
	 * @result potential
	 */
	protected KM_PH_potential_DO(mobile: Mobile): number
	{
		let R_s = this.central_body.R_s;
		let a = this.central_body.a;

		let V_a = -(a**2 * mobile.E**2 - mobile.L**2) / mobile.r**2
		- R_s * Math.pow(mobile.L - a * mobile.E, 2) / mobile.r**3;

		let X = (c**2 * mobile.E**2 - V_a) * this.KM_delta_r(mobile)**2;

		let Y = (mobile.r**2 + a**2 + R_s * a**2 / mobile.r)
		* mobile.E - R_s * a * mobile.L / mobile.r;

		return mobile.E**2 - X / (Y**2 * c**2);
	}

	
	/**
	 * Kerr metric for a photon (KM_PH)
	 * 
	 * Second derivative d²r/dlambda² for an astronaut (A)
	 * 
	 * This method is to be used with Runge-Kutta.
	 * @param mobile
	 */
	protected KM_PH_trajectory_A(mobile: Mobile): number
	{
		return -(c**2 / (2 * mobile.r**4))
		* (2*mobile.r * (this.central_body.a**2 * mobile.E**2 - mobile.L**2)
		+ 3*this.central_body.R_s * (mobile.L - this.central_body.a * mobile.E)**2);
	}


	/**
	 * Kerr metric for a photon (KM_PH)
	 * 
	 * Second derivative d²r/dt² for a distant observer (DO)
	 * 
	 * This method is to be used with Runge-Kutta.
	 * @param mobile
	 */
	protected KM_PH_trajectory_DO(mobile: Mobile): number
	{
		let R_s = this.central_body.R_s;
		let a = this.central_body.a;

		let W = (mobile.r**2 + a**2 + R_s * a**2 / mobile.r)
		* mobile.E - R_s * a * mobile.L / mobile.r;

		let X = mobile.E**2 * a**2 - mobile.L**2;

		let Y = R_s * (mobile.L - a * mobile.E)**2;

		let Z = 2*(mobile.E**2 + X / mobile.r**2 + Y / mobile.r**3);

		return c**2 * this.KM_delta_r(mobile) / (2 * W**2)
		* ((-2*X / mobile.r**3 - 3*Y / mobile.r**4) * this.KM_delta_r(mobile)
		+ Z * (2*mobile.r - R_s) - Z * ((2*mobile.r - R_s * a**2 / mobile.r**2)
		* mobile.E + R_s * a * mobile.L / mobile.r**2) * this.KM_delta_r(mobile) / W);
	}


}