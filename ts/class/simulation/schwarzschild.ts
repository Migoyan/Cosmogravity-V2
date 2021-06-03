import { Mobile } from "./simulation objects/mobile";
import { Simulation_trajectory } from "./simulation_trajectory";

/** 
 * @class Schwarzschild 
 * 
 * Inherited from Simulation_trajectory class.
 * This class will implement the different equations for the Schwarzchild metric.
 * https://www.lupm.in2p3.fr/cosmogravity/theorie/theorie_trajectoires_FR.pdf
 * Note: This code uses acronyms to differentiate between the different categories
 * covered by the theory (example: EMS_PH = External Schwarzschild metric for a Photon).
 * 
 * @method integration_constants
 * @method runge_kutta_trajectory
 * @method ESM_MP_integration_constants
 * @method ESM_MP_potential_A
 * @method ESM_MP_potential_DO
 * @method ESM_MP_trajectory_A
 * @method ESM_MP_trajectory_DO
 * @method ESM_PH_integration_constants
 * @method ESM_PH_potential_A
 * @method ESM_PH_potential_DO
 * @method ESM_PH_trajectory_A
 * @method ESM_PH_trajectory_DO
 * @method ISM_alpha_r
 * @method ISM_beta_r
 * @method ISM_MP_integration_constants
 * @method ISM_MP_potential_A
 * @method ISM_MP_trajectory_A
 * @method ISM_PH_integration_constants
 * @method ISM_PH_potential_A
 * @method ISM_PH_trajectory_A
 */

export class Schwarzchild extends Simulation_trajectory
{
 
    //-------------------- Constructor --------------------


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
        let result: number[][];
        this.mobile_list.forEach(mobile =>
        {
            if (mobile.r >= this.central_body.radius)
            {
                if (!mobile.is_photon)
                {
                    result.push(
                        this.ESM_MP_integration_constants(
                            this.central_body.calculate_R_s(),
                            mobile.r,
                            mobile.U_r,
                            mobile.U_phi
                        )
                    );
                }
                else if (mobile.is_photon)
                {
                    result.push(
                        this.ESM_PH_integration_constants(
                            this.central_body.calculate_R_s(),
                            mobile.r,
                            mobile.U_r,
                            mobile.U_phi
                        )
                    );
                }
            }
            else if (mobile.r < this.central_body.radius)
            {
                let alpha_0: number = this.ISM_alpha_r(
                    this.central_body.calculate_R_s(),
                    this.central_body.radius,
                    mobile.r
                );
                let beta_0: number = this.ISM_beta_r(
                    this.central_body.calculate_R_s(),
                    this.central_body.radius,
                    mobile.r
                );
                if (!mobile.is_photon)
                {
                    result.push(
                        this.ISM_MP_integration_constants(
                            mobile.r,
                            mobile.U_r,
                            mobile.U_phi,
                            alpha_0,
                            beta_0
                        )
                    );
                }
                else if (mobile.is_photon)
                {
                    result.push(
                        this.ISM_PH_integration_constants(
                            mobile.r,
                            mobile.U_r,
                            mobile.U_phi,
                            alpha_0,
                            beta_0
                        )
                    );
                }
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
        let R_s = this.central_body.calculate_R_s();
        let radius = this.central_body.radius;

        if (mobile.r >= radius && !mobile.is_photon && reference_frame === "A")
        {
            return this.ESM_MP_trajectory_A(R_s, mobile.r, L);
        }
        else if (mobile.r >= radius && !mobile.is_photon && reference_frame === "DO")
        {
            return this.ESM_MP_trajectory_DO(R_s, mobile.r, L, E);
        }
        else if (mobile.r >= radius && mobile.is_photon && reference_frame === "A")
        {
            return this.ESM_PH_trajectory_A(R_s, mobile.r, L);
        }
        else if (mobile.r >= radius && mobile.is_photon && reference_frame === "DO")
        {
            return this.ESM_PH_trajectory_DO(R_s, mobile.r, L, E);
        }
        else if (mobile.r < this.central_body.radius)
        {
            let alpha_r = this.ISM_alpha_r(R_s, radius, mobile.r);
            let beta_r = this.ISM_beta_r(R_s, radius, mobile.r);
            
            if (!mobile.is_photon)
            {
                return this.ISM_MP_trajectory_A(R_s, radius, mobile.r, alpha_r, beta_r, L, E);
            }
            else if (mobile.is_photon)
            {
                return this.ISM_PH_trajectory_A(R_s, radius, mobile.r, alpha_r, beta_r, L, E);
            }
        }  
    }


    //  I/ The external Schwarzschild metric (ESM)

    /*
     * r > R
     * The spacial and temporal coordinates are (r, theta, phi, t)
     * All simulations take place on the theta=pi/2 plane
     * U_r and U_phi are the velocity coordinates
     * R_s Schwarzschild radius
     * L_e and E_e are two Integration constants determined with the 
     * initial conditions. L is a length and E is adimentional.
     * The "trajectory" functions are to be called by the Runge-Kutta algorithm.
     * The suffix A or DO refer to Astronaut or Distant Oberver.
     */


    //  1) For a massive particle (ESM_MP)


    /**
     * External Schwarzschild metric for a Massive Particle (ESM_MP)
     * 
     * Integration constants in a list of two elements.
     * @param R_s Schwarzschild radius, attribute of @class Central_body
     * @param r_0 r(0), Radial coordinate at t=0
     * @param U_r_0 U_r(0), velocity's radial coordinate at t=0
     * @param U_phi_0 U_phi(0), velocity's angular coordinate at t=0
     * 
     * @returns List where list[0]=L and list[1]=E
     */
    protected ESM_MP_integration_constants(
        R_s: number,
        r_0: number,
        U_r_0: number,
        U_phi_0: number
    ): number[]
    {
        let L_e = U_phi_0 * r_0 / c;
        let E_e = Math.sqrt(Math.pow(U_r_0 / c, 2)
        + (1 - R_s / r_0) * (1 + Math.pow(U_phi_0 / c, 2)));
        return [L_e, E_e];
    }


    /**
     * External Schwarzschild metric for a Massive Particle (ESM_MP)
     * 
     * Potential for an astronaut (A) divided by c²
     * @param R_s Schwarzschild radius, attribute of @class Central_body
     * @param r Radial coordinate
     * @param L_e Integration constant
     * 
     * @returns Potential
     */
    protected ESM_MP_potential_A(R_s: number, r: number, L_e: number): number
    {
        return (1 - R_s / r) * (1 + (L_e / r)**2);
    }


    /**
     * External Schwarzschild metric for a Massive Particle (ESM_MP)
     * 
     * Potential for a distant observer (DO) divided by c²
     * @param R_s Schwarzschild radius, attribute of @class Central_body
     * @param r Radial coordinate
     * @param E_e Integration constant
     * @param L_e Integration constant
     * 
     * @returns Potential
     */
    protected ESM_MP_potential_DO(R_s: number, r: number, L_e: number, E_e: number): number
    {
        let V_a = (1 - R_s / r) * (1 + (L_e / r)**2);
        return E_e**2 - (c**2 - V_a / E_e**2) * (1 - R_s / r)**2 / c**2;
    }


    /**
     * External Schwarzschild metric for a Massive Particle (ESM_MP)
     * 
     * Second derivative d²r/dtau² for an astronaut (A)
     * 
     * This method is to be used with Runge-Kutta.
     * @param R_s Schwarzschild radius
     * @param r Radial coordinate
     * @param L_e Integration constant
     */
    protected ESM_MP_trajectory_A(R_s: number, r: number, L_e: number): number
    {
        return c**2 / (2 * r**4) * (-R_s * r**2 + (2*r - 3*R_s) * L_e**2);
    }


    /**
     * External Schwarzschild metric for a Massive Particle (ESM_MP)
     * 
     * Second derivative d²r/dt² for a distant observer (DO)
     * 
     * This method is to be used with Runge-Kutta.
     * @param R_s Schwarzschild radius
     * @param r Radial coordinate
     * @param L_e Integration constant
     * @param E_e Integration constant
     */
    protected ESM_MP_trajectory_DO(R_s: number, r: number, L_e: number, E_e: number): number
    {
        return c**2 * (r - R_s)
        * (2 * E_e**2 * r**3 * R_s + 2 * (L_e * r)**2
        - 7 * L_e**2 * r * R_s + 5 * (L_e * R_s)**2
        - 3 * r**3 * R_s + 3 * (r * R_s)**2)
        / (2 * E_e**2 * r**6);
    }


    //  2) For a photon (ESM_PH)


    /**
     * External Schwarzschild metric for a photon (ESM_PH)
     * 
     * Integration constants in a list of two elements.
     * @param R_s Schwarzschild radius
     * @param r_0 r(0), radial coordinate at t=0
     * @param U_r_0 U_r(0), velocity's radial coordinate at t=0
     * @param U_phi_0 U_phi(0), velocity's angular coordinate at t=0
     * 
     * @returns List where list[0]=L and list[1]=E
     */
    protected ESM_PH_integration_constants(
        R_s: number,
        r_0: number,
        U_r_0: number,
        U_phi_0: number
    ): number[]
    {
        let L_e = U_phi_0 * r_0 / c;
        let E_e = Math.sqrt(Math.pow(U_r_0 / c, 2)
        + (1 - R_s / r_0) * Math.pow(U_phi_0 / c, 2));
        return [L_e, E_e];
    }


    /**
     * External Schwarzschild metric for a photon (ESM_PH)
     * 
     * Potential for an astronaut (A) divided by c²
     * @param R_s Schwarzschild radius
     * @param r Radial coordinate
     * @param L_e Integration constant
     * 
     * @returns Potential
     */
    protected ESM_PH_potential_A(R_s: number, r: number, L_e: number): number
    {
        return (1 - R_s / r) * (1 + (L_e / r)**2);
    }


    /**
     * External Schwarzschild metric for a photon (ESM_PH)
     * 
     * Potential for a distant observer (DO) divided by c²
     * @param R_s Schwarzschild radius
     * @param r Radial coordinate
     * @param L_e Integration constant
     * @param E_e Integration constant
     * 
     * @returns Potential
     */
    protected ESM_PH_potential_DO(R_s: number, r: number, L_e: number, E_e: number): number
    {
        let V_a = (1 - R_s / r) * (1 + (L_e / r)**2);
        return E_e**2 - (c**2 - V_a / E_e**2) * (1 - R_s / r)**2 / c**2;
    }


    /**
     * External Schwarzschild metric for a photon (ESM_PH)
     * 
     * Second derivative d²r/dlambda² for an astronaut (A)
     * 
     * This method is to be used with Runge-Kutta.
     * @param R_s Schwarzschild radius
     * @param r Radial coordinate
     * @param L_e Integration constant
     */
    protected ESM_PH_trajectory_A(R_s: number, r: number, L_e: number): number
    {
        return c**2 / (2 * r**4) * (2*r - 3*R_s) * L_e**2;
    }


    /**
     * External Schwarzschild metric for a photon (ESM_PH)
     * 
     * Second derivative d²r/dt² for a distant observer (DO)
     * 
     * This method is to be used with Runge-Kutta.
     * @param R_s Schwarzschild radius
     * @param r Radial coordinate
     * @param L_e Integration constant
     * @param E_e Integration constant
     */
    protected ESM_PH_trajectory_DO(R_s: number, r: number, L_e: number, E_e: number): number
    {
        return c**2 * (r - R_s)
        * (2 * E_e**2 * r**3 * R_s + 2 * (L_e * r)**2
        - 7 * L_e**2 * r * R_s + 5 * (L_e * R_s)**2)
        / (2 * E_e**2 * r**6);
    }


    //  II/ The internal Schwarzschild metric (ISM)

    /*
     * r < R
     * The Integration constants are now called L_i and E_i
     * Definition of two new variables alpha and beta.
     */


    /**
     * Internal Schwarzschild metric (ISM)
     * 
     * Defines a new variable alpha(r)
     * @param R_s Schwarzschild radius
     * @param radius Radius of the central body
     * @param r Radial coordinate
     * 
     * @returns alpha(r)
     */
    protected ISM_alpha_r(R_s: number, radius: number, r: number): number
    {
        return 1 - r**2 * R_s / radius**3;
    }


    /**
     * Internal Schwarzschild metric (ISM)
     * 
     * Defines a new variable beta(r)
     * @param R_s Schwarzschild radius
     * @param radius Radius of the central body
     * @param r Radial coordinate
     * 
     * @returns beta(r)
     */
    protected ISM_beta_r(R_s: number, radius: number, r: number): number
    {
        return 3/2 * (1 - R_s / radius)**.5 - .5 * (1 - r**2 * R_s / radius**3)**.5;
    }


    //  1) For a massive particle (ISM_MP)


    /**
     * Internal Schwarzschild metric for a massive particle (ISM_MP)
     * 
     * Integration constants in a list of two elements.
     * @param r_0 r(0), radial coordinate at t=0
     * @param U_r_0 U_r(0), velocity's radial coordinate at t=0
     * @param U_phi_0 U_phi(0), velocity's angular coordinate at t=0
     * @param alpha_0 ISM variable alpha(r) at t=0
     * @param beta_0 ISM variable alpha(r) at t=0
     * 
     * @returns List where list[0]=L and list[1]=E
     */
    protected ISM_MP_integration_constants(
        r_0: number,
        U_r_0: number,
        U_phi_0: number,
        alpha_0: number,
        beta_0: number
    ): number[]
    {
        let L_i = U_phi_0 * r_0 / c;
        let E_i = beta_0 / c * Math.sqrt(U_r_0**2 / alpha_0 + U_phi_0**2 + c**2);
        return [L_i, E_i];
    }


    /**
     * Internal Schwarzschild metric for a massive particle (ISM_MP)
     * 
     * Potential for an astronaut (A) divided by c²
     * @param R_s Schwarzschild radius
     * @param r Radial coordinate
     * @param alpha_0 ISM variable alpha(r)
     * @param L_e Integration constant
     * @param E_i Integration constant
     * 
     * @returns Potential
     */
    protected ISM_MP_potential_A(
        r: number,
        alpha_r: number,
        beta_r: number,
        E_i: number,
        L_i: number
    ): number
    {
        return E_i**2 - alpha_r * (Math.pow(E_i / beta_r, 2) - Math.pow(L_i / r, 2) - 1);
    }


    /**
     * Internal Schwarzschild metric for a massive particle (ISM_MP)
     * 
     * Second derivative d²r/dtau² for an astronaut (A)
     * 
     * This method is to be used with Runge-Kutta.
     * @param R_s Schwarzschild radius
     * @param radius Radius of the central body
     * @param r Radial coordinate
     * @param alpha_r ISM variable alpha(r)
     * @param beta_r ISM variable beta(r)
     * @param L_i Integration constant
     * @param E_i Integration constant
     */
    protected ISM_MP_trajectory_A(
        R_s: number,
        radius: number,
        r: number,
        alpha_r: number,
        beta_r: number,
        L_i: number,
        E_i: number
    ): number
    {
        return -(c**2 * r * R_s / radius**3)
        * (Math.pow(E_i / beta_r, 2) - Math.pow(L_i / r, 2) - 1)
        + c**2 * alpha_r * .5 * (-(E_i**2 * r * R_s)
        / ((beta_r * radius)**3 * alpha_r**.5) + 2 * L_i**2 / r**3);
    }


    //  2) For a photon (ISM_PH)


    /**
     * Internal Schwarzschild metric for a photon (ISM_PH)
     * @param r_0 r(0), Radial coordinate at t=0
     * @param U_r_0 U_r(0), velocity's Radial coordinate at t=0
     * @param U_phi_0 U_phi(0), velocity's angular coordinate at t=0
     * @param alpha_0 ISM variable alpha(r) at t=0
     * @param beta_0 ISM variable beta(r) at t=0
     * 
     * @returns List where list[0]=L and list[1]=E
     */
    protected ISM_PH_integration_constants(
        r_0: number,
        U_r_0: number,
        U_phi_0: number,
        alpha_0: number,
        beta_0: number
    ): number[]
    {
        let L_i = U_phi_0 * r_0 / c;
        let E_i = beta_0 / c * Math.sqrt(U_r_0**2 / alpha_0 + U_phi_0**2);
        return [L_i, E_i];
    }


    /**
     * Internal Schwarzschild metric for a photon (ISM_PH)
     * 
     * Potential for an astronaut (A) divided by c²
     * @param R_s Schwarzschild radius
     * @param r Radial coordinate
     * @param alpha_0 ISM variable alpha(r) at t=0
     * @param L_e Integration constant
     * @param E_i Integration constant
     * 
     * @returns Potential
     */
     protected ISM_PH_potential_A(
        r: number,
        alpha_r: number,
        beta_r: number,
        E_i: number,
        L_i: number
    ): number
    {
        return E_i**2 - alpha_r * (Math.pow(E_i / beta_r, 2) - Math.pow(L_i / r, 2));
    }


    /**
     * Internal Schwarzschild metric for a photon (ISM_PH)
     * 
     * Second derivative d²r/dlambda² for an astronaut (A)
     * 
     * This method is to be used with Runge-Kutta.
     * @param R_s Schwarzschild radius
     * @param radius Radius of the central body
     * @param r Radial coordinate
     * @param alpha_r ISM variable alpha(r)
     * @param beta_r ISM variable beta(r)
     * @param L_i Integration constant
     * @param E_i Integration constant 
     */
    protected ISM_PH_trajectory_A(
        R_s: number,
        radius: number,
        r: number,
        alpha_r: number,
        beta_r: number,
        L_i: number,
        E_i: number
    ): number
    {
        return -(c**2 * r * R_s / radius**3)
        * (Math.pow(E_i / beta_r, 2) - Math.pow(L_i / r, 2))
        + c**2 * alpha_r * .5 * (-(E_i**2 * r * R_s)
        / ((beta_r * radius)**3 * alpha_r**.5) + 2 * L_i**2 / r**3);
    }


}