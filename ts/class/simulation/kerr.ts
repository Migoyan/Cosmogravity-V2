/*
	Class Kerr, 
	inheritance from Simulation_trajectory class
	This class will implement the different equations for the Kerr metric (KM)
	The Kerr metric is about studying the motion of a particle or photon
	around a rotating black hole.
	https://www.lupm.in2p3.fr/cosmogravity/theorie/theorie_trajectoires_FR.pdf
*/

import { Simulation_trajectory } from "./simulation_trajectory";

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


	public KM_delta_r(R_hp: number, R_hm: number, r: number)
	{
		return (r - R_hp) * (r - R_hm);
	}


//	1) For a massive particle (KM_PM)


//	Funct[0]=L, Funct[1]=E
	public KM_PM_integration_constants()
	{
        let L = U_phi_0 * r_0 / c;
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