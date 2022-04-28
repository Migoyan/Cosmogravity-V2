import { Simulation_trajectory } from "./simulation_trajectory.js";
import { c, G } from "./../../constants.js";
/**
 * @class Kerr
 *
 * Inherited from Simulation_trajectory class.
 * This class will implement the different equations for the Kerr metric.
 * https://www.lupm.in2p3.fr/cosmogravity/theorie/theorie_trajectoires_FR.pdf
 * Note: This code uses acronyms to differentiate between the different categories
 * covered by the theory (example: KM_PH = Kerr Metric for a Photon).
 *
 * @param id
 * @param central_body
 * @param mobile_list
 * @param c
 * @param G
 *
 * @method add_mobile
 * @method mobile_initialization
 * @method mobile_dtau
 * @method mobile_trajectory
 * @method mobile_new_position
 * @method mobile_velocity
 * @method mobile_clocks
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
    //-------------------- Constructor ---------------------
    constructor(id, collidable, mass, radius, angular_m) {
        super(id, collidable, mass, radius, angular_m);
    }
    //---------------------- Methods -----------------------
    /**
     * Method that loops over the mobile list and determines the
     * correct integration constants before storing them in each
     * mobile as a property. It also takes the user input in terms
     * of physical velocity and calculate the corresponding U_r and U_phi.
     */
    mobile_initialization() {
        this.mobile_list.forEach(mobile => {
            let R_s = this.central_body.R_s;
            let delta = this.KM_delta_r(mobile);
            if (!mobile.is_photon) {
                mobile.U_r = mobile.v_r * Math.cos(mobile.v_alpha) * c
                    * delta ** .5 / (mobile.r * (c ** 2 - mobile.v_r ** 2) ** .5);
                mobile.U_phi = mobile.v_r * Math.sin(mobile.v_alpha) * c * Math.sqrt(Math.abs(mobile.r * (mobile.r - R_s)) / Math.sqrt(delta * (c ** 2 - mobile.v_r ** 2)));
                this.KM_MP_integration_constants(mobile);
            }
            else {
                mobile.U_r = c * Math.cos(mobile.v_alpha) * Math.sqrt(delta / (mobile.r * (mobile.r - R_s)));
                mobile.U_phi = c * Math.sin(mobile.v_alpha) * mobile.r / Math.sqrt(delta);
                this.KM_PH_integration_constants(mobile);
            }
        });
    }
    /**
     * Determines the right dtau for each mobile and updates the parameter.
     * The dtau and free_fall_time (temps_chute_libre in the old code) formulas
     * are not included in the theory but are the result of trial and error.
     * Ask Mr. Cordoni and Mr. Reboul for more information..
     */
    mobile_dtau(reference_frame) {
        this.mobile_list.forEach(mobile => {
            let free_fall_time = Math.PI * mobile.r * Math.sqrt(mobile.r / (2 * G * this.central_body.mass)) ** .5 / 2;
            if (!mobile.is_photon) {
                mobile.dtau = mobile.r * 500
                    / (Math.sqrt(mobile.U_r ** 2 + mobile.U_phi ** 2) + 1e-20);
                if (mobile.dtau > free_fall_time / 500) {
                    mobile.dtau = free_fall_time / 500;
                }
            }
            else if (mobile.is_photon) {
                if (reference_frame === "A") {
                    mobile.dtau = 1e-3 * mobile.r
                        / (Math.abs(mobile.U_r) + Math.abs(mobile.U_phi) + 1);
                }
                else {
                    mobile.dtau = mobile.r
                        / (Math.sqrt(mobile.U_r ** 2 + mobile.U_phi ** 2) + 1) / 1000;
                    if (mobile.dtau > free_fall_time / 500) {
                        mobile.dtau = free_fall_time / 500;
                    }
                }
            }
        });
    }
    /**
      * Applies the Runge-Kutta algorithm to the relevant second derivative
      * expression for the current simulation.
      * @param mobile
      * @param step dtau
      * @param reference_frame Astronaut (A), Distant Observer (DO)
      *
      * @returns [tau, r, U_r]
      */
    mobile_trajectory(mobile, step, reference_frame) {
        let dtau = step;
        let tau;
        let r = mobile.r;
        let U_r = mobile.U_r;
        if (!mobile.is_photon && reference_frame === "A") {
            return this.runge_kutta_equation_order2(mobile, dtau, tau, r, U_r, this.KM_MP_trajectory_A);
        }
        else if (!mobile.is_photon && reference_frame === "DO") {
            return this.runge_kutta_equation_order2(mobile, dtau, tau, r, U_r, this.KM_MP_trajectory_DO);
        }
        else if (mobile.is_photon && reference_frame === "A") {
            return this.runge_kutta_equation_order2(mobile, dtau, tau, r, U_r, this.KM_PH_trajectory_A);
        }
        else if (mobile.is_photon && reference_frame === "DO") {
            return this.runge_kutta_equation_order2(mobile, dtau, tau, r, U_r, this.KM_PH_trajectory_DO);
        }
    }
    /**
     * Updates a mobile with its new position
     * @param mobile
     * @param step dtau
     * @param reference_frame Astronaut (A), Distant Observer (DO)
     */
    mobile_new_position(mobile, step, reference_frame) {
        let dtau = step;
        let R_s = this.central_body.R_s;
        let a = this.central_body.a;
        let runge_kutta_result = this.mobile_trajectory(mobile, dtau, reference_frame);
        mobile.r = runge_kutta_result[1];
        mobile.U_r = runge_kutta_result[2];
        if (reference_frame === "A") {
            mobile.phi += c * dtau / this.KM_delta_r(mobile)
                * (R_s * a * mobile.E / mobile.r + (1 - R_s / mobile.r) * mobile.L);
        }
        else {
            mobile.phi += c * dtau
                * (R_s * a * mobile.E / mobile.r + (1 - R_s / mobile.r) * mobile.L)
                / ((mobile.r ** 2 + a ** 2 + R_s * a ** 2 / mobile.r)
                    * mobile.E - R_s * a * mobile.L / mobile.r);
        }
    }
    /**
     * Update the physical velocity of a mobile
     * @param mobile
     */
    mobile_velocity(mobile) {
        let R_s = this.central_body.R_s;
        let a = this.central_body.a;
        let delta = this.KM_delta_r(mobile);
        let dphi = c * ((R_s * a * mobile.E) / mobile.r + (1 - R_s / mobile.r) * mobile.L)
            / ((mobile.r ** 2 + a ** 2 + (R_s / mobile.r) * a ** 2)
                * mobile.E - R_s * a * mobile.L / mobile.r);
        mobile.v_phi = Math.sqrt(delta * dphi ** 2
            / (1 - (R_s / mobile.r) + R_s * a * dphi / (c * mobile.r) ** 2));
        if (!mobile.is_photon) {
            let dr = c ** 2 * (mobile.E ** 2 - 1 + (R_s / mobile.r) + (a ** 2 * (mobile.E ** 2 - 1)
                - mobile.L ** 2) / mobile.r ** 2 + R_s * (((mobile.L - a * mobile.E) ** 2) / mobile.r ** 3));
            dr *= (delta ** 2) / ((mobile.r ** 2 + a ** 2 + (R_s / mobile.r) * a ** 2)
                * mobile.E - R_s * a * mobile.L / mobile.r) ** 2;
            mobile.v_r = Math.sqrt(Math.abs((1 - R_s / mobile.r) * (mobile.r ** 2 * dr / delta)
                / ((1 - (R_s / mobile.r) + R_s * a * dphi / (c * mobile.r)) ** 2)));
        }
        else {
            let dr = c ** 2 * (mobile.E ** 2 + (a ** 2 * mobile.E ** 2 - mobile.L ** 2) / mobile.r ** 2
                + R_s * (((mobile.L - a * mobile.E) ** 2) / (mobile.r ** 3)));
            dr *= delta ** 2 / (((mobile.r ** 2 + a ** 2 + R_s / mobile.r * a ** 2) * mobile.E
                - R_s * a * mobile.L / mobile.r) ** 2);
            mobile.v_r = Math.sqrt(Math.abs((1 - R_s / mobile.r) * (mobile.r ** 2 * dr / delta)
                / (1 - R_s / mobile.r + R_s * a * dphi / (c * mobile.r)) ** 2));
        }
        mobile.v_norm = (mobile.v_r ** 2 + mobile.v_phi ** 2) ** .5;
    }
    /**
     * Updates time parameters of a mobile
     * @param mobile
     * @param reference_frame Astronaut (A), Distant Observer (DO)
     */
    mobile_clocks(mobile, reference_frame) {
        let radius = this.central_body.radius;
        let a = this.central_body.a;
        let R_s = this.central_body.R_s;
        let R_hp = this.central_body.R_hp;
        if (reference_frame === "A") {
            if (!mobile.is_photon) {
                mobile.clock_a += mobile.dtau;
                if (mobile.r > R_hp) {
                    mobile.clock_do += mobile.dtau * ((mobile.r ** 2 + a ** 2 + R_s * a ** 2 / mobile.E)
                        - R_s * a * mobile.L / mobile.r) / this.KM_delta_r(mobile);
                }
                else {
                    mobile.clock_do = Infinity;
                }
            }
        }
        else {
            mobile.clock_do += mobile.dtau;
            if (!mobile.is_photon && mobile.r >= R_hp) {
                mobile.clock_a += mobile.dtau * this.KM_delta_r(mobile) / ((mobile.r ** 2 + a ** 2
                    / mobile.r) * mobile.E - R_s * a * mobile.L / mobile.r);
            }
        }
    }
    /*
     * The spacial and temporal coordinates are (r, theta, phi, t)
     * All simulations take place on the theta=pi/2 plane
     * U_r is dr and U_phi is dphi
     * R_s Schwarzschild radius.
     * The Kerr metric also uses R_h+ and R_h-, see theory.
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
    KM_delta_r(mobile) {
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
    KM_MP_integration_constants(mobile) {
        mobile.E = Math.sqrt(mobile.U_r ** 2 * (mobile.r - this.central_body.R_s)
            * mobile.r ** 3 + c ** 2 * mobile.r * (mobile.r - this.central_body.R_s)
            * this.KM_delta_r(mobile) + this.KM_delta_r(mobile) ** 2 * mobile.U_phi ** 2)
            / (c ** 2 * mobile.r ** 2 * this.KM_delta_r(mobile));
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
    KM_MP_potential_A(mobile) {
        return 1 - this.central_body.R_s / mobile.r
            - (this.central_body.a ** 2 * (mobile.E ** 2 - 1) - mobile.L ** 2) / mobile.r ** 2
            - this.central_body.R_s * Math.pow(mobile.L - this.central_body.a * mobile.E, 2)
                / mobile.r ** 3;
    }
    /**
     * Kerr metric for a massive particle (KM_MP)
     *
     * Potential for a distant observer (DO) divided by c²
     * @param mobile
     * @result Potential
     */
    KM_MP_potential_DO(mobile) {
        let R_s = this.central_body.R_s;
        let a = this.central_body.a;
        let V_a = 1 - R_s / mobile.r
            - (a ** 2 * (mobile.E ** 2 - 1) - mobile.L ** 2) / mobile.r ** 2
            - R_s * Math.pow(mobile.L - a * mobile.E, 2) / mobile.r ** 3;
        let X = (c ** 2 * mobile.E ** 2 - V_a) * this.KM_delta_r(mobile) ** 2;
        let Y = (mobile.r ** 2 + a ** 2 + R_s * a ** 2 / mobile.r)
            * mobile.E - R_s * a * mobile.L / mobile.r;
        return mobile.E ** 2 - X / (Y ** 2 * c ** 2);
    }
    /**
     * Kerr metric for a massive particle (KM_MP)
     *
     * Second derivative d²r/dtau² for an astronaut (A).
     *
     * This method is to be used with Runge-Kutta.
     * @param mobile
     * @param t
     * @param r
     * @param U_r
     */
    KM_MP_trajectory_A(mobile, t, r, U_r) {
        return c ** 2 / (2 * r ** 4) * (this.central_body.R_s * r ** 2 + 2 * r
            * (this.central_body.a ** 2 * (mobile.E ** 2 - 1) - mobile.L ** 2)
            + 3 * this.central_body.R_s * (mobile.L - this.central_body.a * mobile.E) ** 2);
    }
    /**
     * Kerr metric for a massive particle (KM_MP)
     *
     * Second derivative d²r/dt² for a distant observer (DO)
     *
     * This method is to be used with Runge-Kutta.
     * @param mobile
     * @param t
     * @param r
     * @param U_r
     */
    KM_MP_trajectory_DO(mobile, t, r, U_r) {
        let R_s = this.central_body.R_s;
        let a = this.central_body.a;
        let W = (r ** 2 + a ** 2 + R_s * a ** 2 / r)
            * mobile.E - R_s * a * mobile.L / r;
        let X = mobile.E ** 2 * a ** 2 - mobile.L ** 2 - a ** 2;
        let Y = R_s * (mobile.L - a * mobile.E) ** 2;
        let Z = 2 * (mobile.E ** 2 - 1 + R_s / r + X / r ** 2 + Y / r ** 3);
        return c ** 2 * this.KM_delta_r(mobile) / (2 * W ** 2)
            * ((-R_s / r ** 2 - 2 * X / r ** 3 - 3 * Y / r ** 4) * this.KM_delta_r(mobile)
                + Z * (2 * r - R_s)
                - Z * ((2 * r - R_s * a ** 2 / r ** 2) * mobile.E + R_s * a * mobile.L / r ** 2)
                    * this.KM_delta_r(mobile) / W);
    }
    //	2) For a photon (KM_PH)
    /**
     * Kerr metric for a photon (KM_PH)
     *
     * Integration constants in a list of two elements.
     * @param mobile
     */
    KM_PH_integration_constants(mobile) {
        mobile.E = Math.sqrt(mobile.U_r ** 2 * (mobile.r - this.central_body.R_s)
            * mobile.r ** 3 + this.KM_delta_r(mobile) ** 2 * mobile.U_phi ** 2)
            / (c ** 2 * mobile.r ** 2 * this.KM_delta_r(mobile));
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
    KM_PH_potential_A(mobile) {
        return -(this.central_body.a ** 2 * mobile.E ** 2 - mobile.L ** 2)
            / mobile.r ** 2 - this.central_body.R_s
            * Math.pow(mobile.L - this.central_body.a * mobile.E, 2) / mobile.r ** 3;
    }
    /**
     * Kerr metric for a massive particle (KM_MP)
     *
     * Potential for a distant observer (DO) divided by c²
     * @param mobile
     * @result potential
     */
    KM_PH_potential_DO(mobile) {
        let R_s = this.central_body.R_s;
        let a = this.central_body.a;
        let V_a = -(a ** 2 * mobile.E ** 2 - mobile.L ** 2) / mobile.r ** 2
            - R_s * Math.pow(mobile.L - a * mobile.E, 2) / mobile.r ** 3;
        let X = (c ** 2 * mobile.E ** 2 - V_a) * this.KM_delta_r(mobile) ** 2;
        let Y = (mobile.r ** 2 + a ** 2 + R_s * a ** 2 / mobile.r)
            * mobile.E - R_s * a * mobile.L / mobile.r;
        return mobile.E ** 2 - X / (Y ** 2 * c ** 2);
    }
    /**
     * Kerr metric for a photon (KM_PH)
     *
     * Second derivative d²r/dlambda² for an astronaut (A)
     *
     * This method is to be used with Runge-Kutta.
     * @param mobile
     * @param t
     * @param r
     * @param U_r
     */
    KM_PH_trajectory_A(mobile, t, r, U_r) {
        return -(c ** 2 / (2 * r ** 4))
            * (2 * r * (this.central_body.a ** 2 * mobile.E ** 2 - mobile.L ** 2)
                + 3 * this.central_body.R_s * (mobile.L - this.central_body.a * mobile.E) ** 2);
    }
    /**
     * Kerr metric for a photon (KM_PH)
     *
     * Second derivative d²r/dt² for a distant observer (DO)
     *
     * This method is to be used with Runge-Kutta.
     * @param mobile
     * @param t
     * @param r
     * @param U_r
     */
    KM_PH_trajectory_DO(mobile, t, r, U_r) {
        let R_s = this.central_body.R_s;
        let a = this.central_body.a;
        let W = (r ** 2 + a ** 2 + R_s * a ** 2 / r)
            * mobile.E - R_s * a * mobile.L / r;
        let X = mobile.E ** 2 * a ** 2 - mobile.L ** 2;
        let Y = R_s * (mobile.L - a * mobile.E) ** 2;
        let Z = 2 * (mobile.E ** 2 + X / r ** 2 + Y / r ** 3);
        return c ** 2 * this.KM_delta_r(mobile) / (2 * W ** 2) * ((-2 * X / r ** 3 - 3 * Y / r ** 4)
            * this.KM_delta_r(mobile) + Z * (2 * r - R_s) - Z * ((2 * r - R_s * a ** 2 / r ** 2)
            * mobile.E + R_s * a * mobile.L / r ** 2) * this.KM_delta_r(mobile) / W);
    }
}
