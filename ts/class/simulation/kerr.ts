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
 * 
*/

export class Kerr extends Simulation_trajectory {



	//---------------- Methods -----------------

	/*
	 * The spacial and temporal coordinates are (r, theta, phi, t)
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
	 * New variable delta(r)
	 * @param R_hp parameter of the central body R_h+
	 * @param R_hm parameter of the central body R_h-
	 * @param r radial coordinate
	 */
	public KM_delta_r(R_hp: number, R_hm: number, r: number)
	{
		return (r - R_hp) * (r - R_hm);
	}


	//	1) For a massive particle (KM_PM)


	/**
	 * 
	 * @param R_s schwarzschild radius
	 * @param delta_r_0 delta(r_0), new variable at t=0
	 * @param r_0 r(0), radial coordinate at t=0
	 * @param U_phi_0 U_phi(0), velocity angular coordinate at t=0
	 * @returns list where list[0]=L and list[1]=E
	 */
	public KM_PM_integration_constants(R_s: number, delta_r_0: number, r_0: number, U_phi_0: number)
	{
        let L = 1 / (c * (r_0 - R_s)) * (delta_r_0 * U_phi_0 - R_s * )
        let E = Math.sqrt(Math.pow(U_r_0 / c, 2) + (1 - R_s / r_0) * Math.pow(U_phi_0 / c, 2));
        return [L_e, E_e];
    }



//	Second derivative d²r/dtau² for an astronaut (A)
	public KM_PM_trajectory_A(R_s: number, r: number, a: number, L: number, E: number)
	{
		return c**2 / (2 * r**4) * (R_s * r**2 + 2*r * (a**2 * (E**2 - 1) - L**2) + 3*R_s * (L - a * E)**2);
	}


//	Second derivative d²r/dtau² for a distant observer (DO)
	public KM_PM_trajectory_DO()
	{

	}




//	2) For a photon (KM_PH)


	public KM_PH_integration_constants()
	{

	}


//	Second derivative d²r/dlambda² for an astronaut (A)
	public KM_PH_trajectory_A(R_s: number, r: number, a: number, L: number, E: number)
	{
		return -(c**2 / (2 * r**4)) * (2*r * (a**2 * E**2 - L**2) + 3*R_s * (L - a * E)**2);
	}

//	Second derivative d²r/dlambda² for a distant observer (DO)
	public KM_PH_trajectory_DO()
	{

	}

}