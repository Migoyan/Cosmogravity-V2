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
 * @method mobile_initialization
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
     * Method that loops over the mobile list and determines
     * the correct integration constants before storing them
     * in each mobile as a property. It also takes the user input
     * in terms of physical velocity and calculate the corresponding
     * U_r and U_phi.
     */
    public mobile_initialization(): void
    {
        let R_s = this.central_body.R_s;

        this.mobile_list.forEach(mobile =>
        {
            if (mobile.r >= this.central_body.radius)
            {
                if (!mobile.is_photon)
                {
                    let E = (1 - R_s / mobile.r)**.5
                    / (1 - Math.pow(mobile.v_r / c, 2))**.5;

                    mobile.U_r = Math.cos(mobile.v_alpha) * mobile.v_r * E;
                    mobile.U_phi = Math.sin(mobile.v_alpha) * mobile.v_r * E
                    / (1 - R_s / mobile.r)**.5;

                    this.ESM_MP_integration_constants(mobile);
                }
                else if (mobile.is_photon)
                {
                    mobile.U_r = Math.cos(mobile.v_alpha) * c;
                    mobile.U_phi = Math.sin(mobile.v_alpha) * c
                    / (1 - R_s / mobile.r)**.5;
                    
                    this.ESM_PH_integration_constants(mobile);
                }
            }
            else if (mobile.r < this.central_body.radius)
            {
                if (!mobile.is_photon)
                {
                    let E = this.ISM_beta_r(mobile)**.5
                    / (1 - mobile.v_r * 2 / c**2)**.5;

                    mobile.U_r = Math.cos(mobile.v_alpha) * this.ISM_alpha_r(mobile)**.5
                    * mobile.v_r * E;
                    mobile.U_phi = Math.sin(mobile.v_alpha) * mobile.v_r * E
                    / this.ISM_beta_r(mobile);

                    this.ISM_MP_integration_constants(mobile);
                }
                else if (mobile.is_photon)
                {
                    mobile.U_r = Math.cos(mobile.v_alpha) * this.ISM_alpha_r(mobile)**.5 * c
                    / this.ISM_beta_r(mobile);
                    mobile.U_phi = Math.sin(mobile.v_alpha) * c / this.ISM_beta_r(mobile);

                    this.ISM_PH_integration_constants(mobile);
                }
            }
        });
    }


    /**
     * Applies the Runge-Kutta algorithm to the relevant second derivative
     * expression for the current simulation and updates the mobile with
     * new position and velocity.
     * @param mobile
     * @param reference_frame Astronaut (A), Distant Observer (DO)
     */
    public runge_kutta_trajectory(mobile: Mobile, reference_frame: "A" | "DO"): void
    {
        let dtau: number;
        let tau: number;
        let radius = this.central_body.radius;
        let r = mobile.r;
        let U_r = mobile.U_r;
        let runge_kutta_result: number[];

        if (mobile.r >= radius && !mobile.is_photon && reference_frame === "A")
        {
            runge_kutta_result = this.runge_kutta_equation_order2(
                mobile,
                dtau,
                tau,
                r,
                U_r,
                this.ESM_MP_trajectory_A
            );
        }
        else if (mobile.r >= radius && !mobile.is_photon && reference_frame === "DO")
        {
            runge_kutta_result = this.runge_kutta_equation_order2(
                mobile,
                dtau,
                tau,
                r,
                U_r,
                this.ESM_MP_trajectory_DO
            );
        }
        else if (mobile.r >= radius && mobile.is_photon && reference_frame === "A")
        {
            runge_kutta_result = this.runge_kutta_equation_order2(
                mobile,
                dtau,
                tau,
                r,
                U_r,
                this.ESM_PH_trajectory_A
            );
        }
        else if (mobile.r >= radius && mobile.is_photon && reference_frame === "DO")
        {
            runge_kutta_result = this.runge_kutta_equation_order2(
                mobile,
                dtau,
                tau,
                r,
                U_r,
                this.ESM_PH_trajectory_DO
            );
        }
        else if (mobile.r < radius)
        {
            if (!mobile.is_photon)
            {
                runge_kutta_result = this.runge_kutta_equation_order2(
                    mobile,
                    dtau,
                    tau,
                    r,
                    U_r,
                    this.ISM_MP_trajectory_A
                );
            }
            else
            {
                runge_kutta_result = this.runge_kutta_equation_order2(
                    mobile,
                    dtau,
                    tau,
                    r,
                    U_r,
                    this.ISM_PH_trajectory_A
                );
            }
        }
        tau = runge_kutta_result[0];
        mobile.r = runge_kutta_result[1];
        mobile.U_r = runge_kutta_result[2];
    }


    //  I/ The external Schwarzschild metric (ESM)

    /*
     * r > R
     * The spacial and temporal coordinates are (r, theta, phi, t)
     * All simulations take place on the theta=pi/2 plane
     * U_r and U_phi are the velocity coordinates
     * this.central_body.R_s Schwarzschild radius
     * L and E are two Integration constants determined with the 
     * initial conditions. L is a length and E is adimentional.
     * The "trajectory" functions are to be called by the Runge-Kutta algorithm.
     * The suffix A or DO refer to Astronaut or Distant Oberver.
     */


    //  1) For a massive particle (ESM_MP)


    /**
     * External Schwarzschild metric for a Massive Particle (ESM_MP)
     * 
     * Calculate the integration constants for a mobile in the current
     * simulation and store the value as a mobile property.
     * @param mobile 
     */
    protected ESM_MP_integration_constants(mobile: Mobile): void
    {
        mobile.L = mobile.U_phi * mobile.r / c;
        mobile.E = Math.sqrt(Math.pow(mobile.U_r / c, 2)
        + (1 - this.central_body.R_s / mobile.r)
        * (1 + Math.pow(mobile.U_phi / c, 2)));
    }


    /**
     * External Schwarzschild metric for a Massive Particle (ESM_MP)
     * 
     * Potential for an astronaut (A) divided by c²
     * @param mobile
     * @returns Potential
     */
    protected ESM_MP_potential_A(mobile: Mobile): number
    {
        return (1 - this.central_body.R_s / mobile.r)
        * (1 + (mobile.L / mobile.r)**2);
    }


    /**
     * External Schwarzschild metric for a Massive Particle (ESM_MP)
     * 
     * Potential for a distant observer (DO) divided by c²
     * @param mobile
     * @returns Potential
     */
    protected ESM_MP_potential_DO(mobile: Mobile): number
    {
        let V_a = (1 - this.central_body.R_s / mobile.r)
        * (1 + (mobile.L / mobile.r)**2);

        return mobile.E**2 - (c**2 - V_a / mobile.E**2)
        * (1 - this.central_body.R_s / mobile.r)**2 / c**2;
    }


    /**
     * External Schwarzschild metric for a Massive Particle (ESM_MP)
     * 
     * Second derivative d²r/dtau² for an astronaut (A)
     * 
     * This method is to be used with Runge-Kutta.
     * @param mobile
     * @param t
     * @param r
     * @param U_r
     */
    protected ESM_MP_trajectory_A(mobile: any, t: number, r: number, U_r: number): number
    {
        return c**2 / (2 * r**4) * (-this.central_body.R_s * r**2
            + (2*r - 3*this.central_body.R_s) * mobile.L**2);
    }


    /**
     * External Schwarzschild metric for a Massive Particle (ESM_MP)
     * 
     * Second derivative d²r/dt² for a distant observer (DO)
     * 
     * This method is to be used with Runge-Kutta.
     * @param mobile
     * @param t
     * @param r
     * @param U_r
     */
    protected ESM_MP_trajectory_DO(mobile: any, t: number, r: number, U_r: number): number
    {
        return c**2 * (r - this.central_body.R_s) * (2 * mobile.E**2 * r**3 * this.central_body.R_s
            + 2*(mobile.L * r)**2 - 7 * mobile.L**2 * r * this.central_body.R_s
            + 5 * (mobile.L * this.central_body.R_s)**2 - 3 * r**3 * this.central_body.R_s
            + 3 * (r * this.central_body.R_s)**2) / (2 * mobile.E**2 * r**6);
    }


    //  2) For a photon (ESM_PH)


    /**
     * External Schwarzschild metric for a photon (ESM_PH)
     * 
     * Calculate the integration constants for a mobile in the current
     * simulation and store the value as a mobile property.
     * @param mobile 
     */
    protected ESM_PH_integration_constants(mobile: Mobile): void
    {
        mobile.L = mobile.U_phi * mobile.r / c;
        mobile.E = Math.sqrt(Math.pow(mobile.U_r / c, 2)
        + (1 - this.central_body.R_s / mobile.r) 
        * Math.pow(mobile.U_phi / c, 2));
    }


    /**
     * External Schwarzschild metric for a photon (ESM_PH)
     * 
     * Potential for an astronaut (A) divided by c²
     * @param mobile
     * @returns Potential
     */
    protected ESM_PH_potential_A(mobile: Mobile): number
    {
        return (1 - this.central_body.R_s / mobile.r)
        * (1 + (mobile.L / mobile.r)**2);
    }


    /**
     * External Schwarzschild metric for a photon (ESM_PH)
     * 
     * Potential for a distant observer (DO) divided by c²
     * @param mobile
     * @returns Potential
     */
    protected ESM_PH_potential_DO(mobile: Mobile): number
    {
        let V_a = (1 - this.central_body.R_s / mobile.r)
        * (1 + (mobile.L / mobile.r)**2);

        return mobile.E**2 - (c**2 - V_a / mobile.E**2)
        * (1 - this.central_body.R_s / mobile.r)**2 / c**2;
    }


    /**
     * External Schwarzschild metric for a photon (ESM_PH)
     * 
     * Second derivative d²r/dlambda² for an astronaut (A)
     * 
     * This method is to be used with Runge-Kutta.
     * @param mobile
     * @param t
     * @param r
     * @param U_r
     */
    protected ESM_PH_trajectory_A(mobile: any, t: number, r: number, U_r: number): number
    {
        return c**2 / (2 * r**4) * (2*r - 3*this.central_body.R_s) * mobile.L**2;
    }


    /**
     * External Schwarzschild metric for a photon (ESM_PH)
     * 
     * Second derivative d²r/dt² for a distant observer (DO)
     * 
     * This method is to be used with Runge-Kutta.
     * @param mobile
     * @param t
     * @param r
     * @param U_r
     */
    protected ESM_PH_trajectory_DO(mobile: any, t: number, r: number, U_r: number): number
    {
        return c**2 * (r - this.central_body.R_s) * (2 * mobile.E**2 * r**3
            * this.central_body.R_s + 2*(mobile.L * r)**2 - 7 * mobile.L**2 * r
            * this.central_body.R_s + 5 * (mobile.L * this.central_body.R_s)**2)
            / (2 * mobile.E**2 * r**6);
    }


    //  II/ The internal Schwarzschild metric (ISM)

    /*
     * r < R
     * The Integration constants are now called L and E
     * Definition of two new variables alpha and beta.
     */


    /**
     * Internal Schwarzschild metric (ISM)
     * 
     * Defines a new variable alpha(r)
     * @param mobile 
     * @returns alpha(r)
     */
    protected ISM_alpha_r(mobile: Mobile): number
    {
        return 1 - mobile.r**2 * this.central_body.R_s
        / this.central_body.radius**3;
    }


    /**
     * Internal Schwarzschild metric (ISM)
     * 
     * Defines a new variable beta(r)
     * @param mobile 
     * @returns beta(r)
     */
    protected ISM_beta_r(mobile: Mobile): number
    {
        return 3/2 * (1 - this.central_body.R_s
            / this.central_body.radius)**.5 - .5
            * (1 - mobile.r**2 * this.central_body.R_s
            / this.central_body.radius**3)**.5;
    }


    //  1) For a massive particle (ISM_MP)


    /**
     * Internal Schwarzschild metric for a massive particle (ISM_MP)
     * 
     * Calculate the integration constants for a mobile in the current
     * simulation and store the value as a mobile property.
     * @param mobile 
     */
    protected ISM_MP_integration_constants(mobile: Mobile): void
    {
        mobile.L = mobile.U_phi * mobile.r / c;
        mobile.E = this.ISM_beta_r(mobile) / c * Math.sqrt(mobile.U_r**2
            / this.ISM_alpha_r(mobile) + mobile.U_phi**2 + c**2);
    }


    /**
     * Internal Schwarzschild metric for a massive particle (ISM_MP)
     * 
     * Potential for an astronaut (A) divided by c²
     * @param mobile
     * @returns Potential
     */
    protected ISM_MP_potential_A(mobile: Mobile): number
    {
        return mobile.E**2 - this.ISM_alpha_r(mobile)
        * (Math.pow(mobile.E / this.ISM_beta_r(mobile), 2)
        - Math.pow(mobile.L / mobile.r, 2) - 1);
    }


    /**
     * Internal Schwarzschild metric for a massive particle (ISM_MP)
     * 
     * Second derivative d²r/dtau² for an astronaut (A)
     * 
     * This method is to be used with Runge-Kutta.
     * @param mobile
     * @param t
     * @param r
     * @param U_r
     */
    protected ISM_MP_trajectory_A(mobile: any, t: number, r: number, U_r: number): number
    {
        return -(c**2 * r * this.central_body.R_s / this.central_body.radius**3)
        * (Math.pow(mobile.E / this.ISM_beta_r(mobile), 2) - Math.pow(mobile.L / r, 2) - 1)
        + c**2 * this.ISM_alpha_r(mobile) * .5*(-(mobile.E**2 * r * this.central_body.R_s)
        / ((this.ISM_beta_r(mobile) * this.central_body.radius)**3
        * this.ISM_alpha_r(mobile)**.5) + 2 * mobile.L**2 / r**3);
    }


    //  2) For a photon (ISM_PH)


    /**
     * Internal Schwarzschild metric for a massive particle (ISM_MP)
     * 
     * Calculate the integration constants for a mobile in the current
     * simulation and store the value as a mobile property.
     * @param mobile 
     */
    protected ISM_PH_integration_constants(mobile: Mobile): void
    {
        mobile.L = mobile.U_phi * mobile.r / c;
        mobile.E = this.ISM_beta_r(mobile) / c
        * Math.sqrt(mobile.U_r**2 / this.ISM_alpha_r(mobile) + mobile.U_phi**2);
    }


    /**
     * Internal Schwarzschild metric for a photon (ISM_PH)
     * 
     * Potential for an astronaut (A) divided by c²
     * @param mobile
     * @returns Potential
     */
    protected ISM_PH_potential_A(mobile: Mobile): number
    {
        return mobile.E**2 - this.ISM_alpha_r(mobile)
        * (Math.pow(mobile.E / this.ISM_beta_r(mobile), 2)
        - Math.pow(mobile.L / mobile.r, 2));
    }


    /**
     * Internal Schwarzschild metric for a photon (ISM_PH)
     * 
     * Second derivative d²r/dlambda² for an astronaut (A)
     * 
     * This method is to be used with Runge-Kutta.
     * @param mobile
     * @param t
     * @param r
     * @param U_r
     */
    protected ISM_PH_trajectory_A(mobile: any, t: number, r: number, U_r: number): number
    {
        return -(c**2 * r * this.central_body.R_s / this.central_body.radius**3)
        * (Math.pow(mobile.E / this.ISM_beta_r(mobile), 2) - Math.pow(mobile.L / r, 2))
        + c**2 * this.ISM_alpha_r(mobile) * .5*(-(mobile.E**2 * r * this.central_body.R_s)
        / ((this.ISM_beta_r(mobile) * this.central_body.radius)**3
        * this.ISM_alpha_r(mobile)**.5) + 2 * mobile.L**2 / r**3);
    }


}