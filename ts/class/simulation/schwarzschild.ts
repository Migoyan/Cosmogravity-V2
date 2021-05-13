/*
Class Schwarzschild, inherited from Simulation_trajectory class.
This class will implement the different equations for the Schwarzchild metric.
https://www.lupm.in2p3.fr/cosmogravity/theorie/theorie_trajectoires_FR.pdf

Note: This code uses acronyms to defferentiate between the different categories
covered by the theory (example: EMS_PH = External Schwarzschild Metric for a Photon).
*/



import { Simulation_trajectory } from "./simulation_trajectory";

export class Schwarzchild extends Simulation_trajectory
{









//---------------- Methods -----------------


/** 
 * I/ The external Schwarzschild metric (ESM)
 * r > R
 * The spacial and temporal coordinates are (r, theta, phi, t)
 * U_r and U_phi are the velocity coordinates
 * R_s Schwarzschild radius
 * L_e and E_e are two integration constants determined with the 
 * initial conditions.
*/


//  1) For a massive particle (ESM_PM)

//  Funct[0]=L_e, Funct[1]=E_e
    public ESM_PM_integration_constants(R_s: number, r_0: number, U_r_0: number, U_phi_0: number)
    {
        let L_e = U_phi_0 * r_0 / c;
        let E_e = Math.sqrt(Math.pow(U_r_0 / c, 2) + (1 - R_s / r_0) * (1 + Math.pow(U_phi_0 / c, 2)));
        return [L_e, E_e];
    }

//  Second derivative d²r/dtau², to be integrated with Runge_Kutta
    public ESM_PM_trajectory(R_s: number, r: number, L_e: number)
    {
        return c**2 / (2 * r**4) * (-R_s * r**2 + (2*r - 3*R_s) * L_e**2);
    }


//  2) For a photon (ESM_PH)

    public ESM_PH_integration_constants(R_s: number, r_0: number, U_r_0: number, U_phi_0: number)
    {
        let L_e = U_phi_0 * r_0 / c;
        let E_e = Math.sqrt(Math.pow(U_r_0 / c, 2) + (1 - R_s / r_0) * Math.pow(U_phi_0 / c, 2));
        return [L_e, E_e];
    }


//  Second derivative d²r/dlambda², to be integrated with Runge_Kutta
    public ESM_PH_trajectory(R_s: number, r: number, L_e: number)
    {
        return c**2 / (2 * r**4) * (2*r - 3*R_s) * L_e**2;
    }


/** 
 * II/ The internal Schwarzschild metric (ISM)
 * r < R
 * The integration constants are now called L_i and E_i
 * Definition of two new variables alpha and beta.
*/

    public ISM_alpha_r(R_s: number, radius: number, r: number)
    {
        return 1 - r**2 * R_s / radius**3;
    }

    public ISM_beta_r(R_s: number, radius: number, r: number)
    {
        return 3/2 * (1 - R_s / radius)**.5 - .5 * (1 - r**2 * R_s / radius**3)**.5;
    }



//  1) For a massive particle (ISM_PM)

    

    public ISM_PM_integration_constants(r_0: number, U_r_0: number, U_phi_0: number, alpha_r_0: number, beta_r_0: number)
    {
        let L_i = U_phi_0 * r_0 / c;
        let E_i = beta_r_0 / c * Math.sqrt(U_r_0**2 / alpha_r_0 + U_phi_0**2 + c**2);
        return [L_i, E_i];
    }


//  Second derivative d²r/dtau²
    public ISM_PM_trajectory(R_s: number, radius: number, r: number, alpha_r: number, beta_r: number, L_i: number, E_i: number)
    {
        return -(c**2 * r * R_s / radius**3) * (Math.pow(E_i / beta_r, 2) - Math.pow(L_i / r, 2) - 1)
        + c**2 * alpha_r * .5 * (-(E_i**2 * r * R_s) / ((beta_r * radius)**3 * alpha_r**.5) + 2 * L_i**2 / r**3);
    }


//  2) For a photon (ISM_PH)


    public ISM_PH_integration_constants(r_0: number, U_r_0: number, U_phi_0: number, alpha_r_0: number, beta_r_0: number)
    {
        let L_i = U_phi_0 * r_0 / c;
        let E_i = beta_r_0 / c * Math.sqrt(U_r_0**2 / alpha_r_0 + U_phi_0**2);
        return [L_i, E_i];
    }


//  Second derivative 
    public ISM_PH_trajectory(R_s: number, radius: number, r: number, alpha_r: number, beta_r: number, L_i: number, E_i: number)
    {
        return -(c**2 * r * R_s / radius**3) * (Math.pow(E_i / beta_r, 2) - Math.pow(L_i / r, 2))
        + c**2 * alpha_r * .5 * (-(E_i**2 * r * R_s) / ((beta_r * radius)**3 * alpha_r**.5) + 2 * L_i**2 / r**3);
    }


}

