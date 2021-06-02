import { Simulation_trajectory } from "./simulation_trajectory";
/**
 * @class Schwarzschild
 *
 * Inherited from Simulation_trajectory class.
 * This class will implement the different equations for the Schwarzchild metric.
 * https://www.lupm.in2p3.fr/cosmogravity/theorie/theorie_trajectoires_FR.pdf
 * Note: This code uses acronyms to differentiate between the different categories
 * covered by the theory (example: EMS_PH = External Schwarzschild Metric for a Photon).
 *
 * Methods:
 * @method ESM_MP_integration_constants
 * @method ESM_MP_trajectory_A
 * @method ESM_MP_trajectory_DO
 * @method ESM_PH_integration_constants
 * @method ESM_PH_trajectory_A
 * @method ESM_PH_trajectory_DO
 * @method ISM_alpha_r
 * @method ISM_beta_r
 * @method ISM_MP_integration_constants
 * @method ISM_MP_trajectory_A
 * @method ISM_PH_integration_constants
 * @method ISM_PH_trajectory_A
 */
export class Schwarzchild extends Simulation_trajectory {
    //-------------------- Constructor- --------------------
    constructor(id, collidable, mass, radius, angular_m) {
        super(id, collidable, mass, radius, angular_m);
    }
    //---------------------- Methods -----------------------
    /*
     * I/ The external Schwarzschild metric (ESM)
     * r > R
     * The spacial and temporal coordinates are (r, theta, phi, t)
     * All simulations take place on the theta=pi/2 plane
     * U_r and U_phi are the velocity coordinates
     * R_s Schwarzschild radius
     * L_e and E_e are two integration constants determined with the
     * initial conditions. L is a length and E is adimentional.
     * The "trajectory" functions are to be called by the Runge-Kutta algorithm.
     * The suffix A or DO refer to Astronaut or Distant Oberver.
     */
    //  1) For a massive particle (ESM_MP)
    /**
     * External Schwarzschild Metric for a Massive Particle (ESM_MP)
     *
     * Integration constants in a list of two elements.
     * @param R_s schwarzschild radius, attribute of @class Central_body
     * @param r_0 r(0), radial coordinate at t=0
     * @param U_r_0 U_r(0), velocity's radial coordinate at t=0
     * @param U_phi_0 U_phi(0), velocity's angular coordinate at t=0
     * @returns list where list[0]=L and list[1]=E
     */
    ESM_MP_integration_constants(R_s, r_0, U_r_0, U_phi_0) {
        let L_e = U_phi_0 * r_0 / c;
        let E_e = Math.sqrt(Math.pow(U_r_0 / c, 2) + (1 - R_s / r_0) * (1 + Math.pow(U_phi_0 / c, 2)));
        return [L_e, E_e];
    }
    /**
     * External Schwarzschild Metric for a Massive Particle (ESM_MP)
     *
     * Second derivative d²r/dtau² for an astronaut (A).
     *
     * This method is to be used with Runge-Kutta.
     * @param R_s schwarzschild radius
     * @param r radial coordinate
     * @param L_e integration constant
     */
    ESM_MP_trajectory_A(R_s, r, L_e) {
        return c ** 2 / (2 * r ** 4) * (-R_s * r ** 2 + (2 * r - 3 * R_s) * L_e ** 2);
    }
    /**
     * External Schwarzschild Metric for a Massive Particle (ESM_MP)
     *
     * Second derivative d²r/dt² for a distant observer (DO)
     *
     * This method is to be used with Runge-Kutta.
     * @param R_s schwarzschild radius
     * @param r radial coordinate
     * @param L_e integration constant
     * @param E_e integration constant
     */
    ESM_MP_trajectory_DO(R_s, r, L_e, E_e) {
        return c ** 2 * (r - R_s) * (2 * E_e ** 2 * r ** 3 * R_s + 2 * (L_e * r) ** 2 - 7 * L_e ** 2 * r * R_s
            + 5 * (L_e * R_s) ** 2 - 3 * r ** 3 * R_s + 3 * (r * R_s) ** 2) / (2 * E_e ** 2 * r ** 6);
    }
    //  2) For a photon (ESM_PH)
    /**
     * External Schwarzschild Metric for a photon (ESM_PH)
     *
     * Integration constants in a list of two elements.
     * @param R_s schwarzschild radius
     * @param r_0 r(0), radial coordinate at t=0
     * @param U_r_0 U_r(0), velocity's radial coordinate at t=0
     * @param U_phi_0 U_phi(0), velocity's angular coordinate at t=0
     * @returns list where list[0]=L and list[1]=E
     */
    ESM_PH_integration_constants(R_s, r_0, U_r_0, U_phi_0) {
        let L_e = U_phi_0 * r_0 / c;
        let E_e = Math.sqrt(Math.pow(U_r_0 / c, 2) + (1 - R_s / r_0) * Math.pow(U_phi_0 / c, 2));
        return [L_e, E_e];
    }
    /**
     * External Schwarzschild Metric for a photon (ESM_PH)
     *
     * Second derivative d²r/dlambda² for an astronaut (A)
     *
     * This method is to be used with Runge-Kutta.
     * @param R_s schwarzschild radius
     * @param r radial coordinate
     * @param L_e integration constant
     */
    ESM_PH_trajectory_A(R_s, r, L_e) {
        return c ** 2 / (2 * r ** 4) * (2 * r - 3 * R_s) * L_e ** 2;
    }
    /**
     * External Schwarzschild Metric for a photon (ESM_PH)
     *
     * Second derivative d²r/dt² for a distant observer (DO)
     *
     * This method is to be used with Runge-Kutta.
     * @param R_s schwarzschild radius
     * @param r radial coordinate
     * @param L_e integration constant
     * @param E_e integration constant
     */
    ESM_PH_trajectory_DO(R_s, r, L_e, E_e) {
        return c ** 2 * (r - R_s) * (2 * E_e ** 2 * r ** 3 * R_s + 2 * (L_e * r) ** 2 - 7 * L_e ** 2 * r * R_s
            + 5 * (L_e * R_s) ** 2) / (2 * E_e ** 2 * r ** 6);
    }
    /*
     * II/ The internal Schwarzschild metric (ISM)
     * r < R
     * The integration constants are now called L_i and E_i
     * Definition of two new variables alpha and beta.
     */
    /**
     * Internal Schwarzschild Metric (ISM)
     *
     * Defines a new variable alpha(r)
     * @param R_s schwarzschild radius
     * @param radius radius of the central body
     * @param r radial coordinate
     * @returns alpha(r)
     */
    ISM_alpha_r(R_s, radius, r) {
        return 1 - r ** 2 * R_s / radius ** 3;
    }
    /**
     * Internal Schwarzschild Metric (ISM)
     *
     * Defines a new variable beta(r)
     * @param R_s schwarzschild radius
     * @param radius radius of the central body
     * @param r radial coordinate
     * @returns beta(r)
     */
    ISM_beta_r(R_s, radius, r) {
        return 3 / 2 * (1 - R_s / radius) ** .5 - .5 * (1 - r ** 2 * R_s / radius ** 3) ** .5;
    }
    //  1) For a massive particle (ISM_MP)
    /**
     * Internal Schwarzschild Metric for a massive particle (ISM_MP)
     *
     * Integration constants in a list of two elements.
     * @param r_0 r(0), radial coordinate at t=0
     * @param U_r_0 U_r(0), velocity's radial coordinate at t=0
     * @param U_phi_0 U_phi(0), velocity's angular coordinate at t=0
     * @param alpha_r_0 ISM variable alpha(r)
     * @param beta_r_0 ISM variable beta(r)
     * @returns list where list[0]=L and list[1]=E
     */
    ISM_MP_integration_constants(r_0, U_r_0, U_phi_0, alpha_r_0, beta_r_0) {
        let L_i = U_phi_0 * r_0 / c;
        let E_i = beta_r_0 / c * Math.sqrt(U_r_0 ** 2 / alpha_r_0 + U_phi_0 ** 2 + c ** 2);
        return [L_i, E_i];
    }
    /**
     * Internal Schwarzschild Metric for a massive particle (ISM_MP)
     *
     * Second derivative d²r/dtau² for an astronaut (A)
     *
     * This method is to be used with Runge-Kutta.
     * @param R_s schwarzschild radius
     * @param radius radius of the central body
     * @param r radial coordinate
     * @param alpha_r ISM variable alpha(r)
     * @param beta_r ISM variable beta(r)
     * @param L_i integration constant
     * @param E_i integration constant
     */
    ISM_MP_trajectory_A(R_s, radius, r, alpha_r, beta_r, L_i, E_i) {
        return -(c ** 2 * r * R_s / radius ** 3) * (Math.pow(E_i / beta_r, 2) - Math.pow(L_i / r, 2) - 1)
            + c ** 2 * alpha_r * .5 * (-(E_i ** 2 * r * R_s) / ((beta_r * radius) ** 3 * alpha_r ** .5) + 2 * L_i ** 2 / r ** 3);
    }
    //  2) For a photon (ISM_PH)
    /**
     * Internal Schwarzschild Metric for a photon (ISM_PH)
     * @param r_0 r(0), radial coordinate at t=0
     * @param U_r_0 U_r(0), velocity's radial coordinate at t=0
     * @param U_phi_0 U_phi(0), velocity's angular coordinate at t=0
     * @param alpha_r_0 ISM variable alpha(r) at t=0
     * @param beta_r_0 ISM variable beta(r) at t=0
     * @returns list where list[0]=L and list[1]=E
     */
    ISM_PH_integration_constants(r_0, U_r_0, U_phi_0, alpha_r_0, beta_r_0) {
        let L_i = U_phi_0 * r_0 / c;
        let E_i = beta_r_0 / c * Math.sqrt(U_r_0 ** 2 / alpha_r_0 + U_phi_0 ** 2);
        return [L_i, E_i];
    }
    /**
     * Internal Schwarzschild Metric for a photon (ISM_PH)
     *
     * Second derivative d²r/dlambda² for an astronaut (A)
     *
     * This method is to be used with Runge-Kutta.
     * @param R_s schwarzschild radius
     * @param radius radius of the central body
     * @param r radial coordinate
     * @param alpha_r ISM variable alpha(r)
     * @param beta_r ISM variable beta(r)
     * @param L_i integration constant
     * @param E_i integration constant
     */
    ISM_PH_trajectory_A(R_s, radius, r, alpha_r, beta_r, L_i, E_i) {
        return -(c ** 2 * r * R_s / radius ** 3) * (Math.pow(E_i / beta_r, 2) - Math.pow(L_i / r, 2))
            + c ** 2 * alpha_r * .5 * (-(E_i ** 2 * r * R_s) / ((beta_r * radius) ** 3 * alpha_r ** .5) + 2 * L_i ** 2 / r ** 3);
    }
}
/*
var central_mass = new Map<'mass' | 'radius' | 'angular_m', number>();

central_mass.set('mass', 1000);
central_mass.set('radius', 100);
central_mass.set('angular_m', 10);

var mobile_1 = new Map<'mass' | 'r' | 'phi', number>();
var mobile_list = [mobile_1];

mobile_1.set('mass', 0);
mobile_1.set('r', 0);
mobile_1.set('phi', 0);


var simu = new Schwarzchild('1', central_mass, mobile_list);
*/ 
