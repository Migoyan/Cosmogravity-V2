"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulation_universe = void 0;
const simulation_1 = require("./simulation");
// Physics constants
const c = 2.99792458e8; // Light constant
const k = 1.38064852e-23; // Boltzmann constant
const h = 6.62607004e-34; // Planck constant
const G = 6.67430e-11; // Newton constant : Système international 2018
// Distances
const AU = 1.495978707e11; // Astronomical unit in meters
const parsec = 3.0857e16; // Parsec in meters
const k_parsec = 3.0857e19; // Kiloparsec in meters
const M_parsec = 3.0857e22; // Megaparsec in meters
const ly = 9.4607e15; // Light-year in meters
/**
 * @class Simulation_universe.
 * inheritance from Simulation class
 *
 * attributes :
 * @param temperature : current temperature of the universe.
 * @param hubble_cst : current value of the Hubble-LeMaître constant.
 * @param matter_parameter : current value of the matter density parameter.
 * @param dark_energy : object containing current value of dark energy density parameter, value of w_0 and value of w_1.\
 * 	Note : When w_0 = -1 and w_0 = 0, the universe is equivalent to his counterpart with only a cosmologic constant.
 * @param constants : contains the value of the physics constants defined for the universe.
 * @param has_cmb : Has Cosmic Microwave Background (CMB).
 * @param has_neutrino : self explanatory.
 * @param is_flat : Forcing the curvature density parameter to 0.
 *
 * methods names :
 * @method modify_dark_energy
 * @method modify_constants
 * @method runge_kutta_universe_2
 * @method calcul_omega_r
 * @method calcul_omega_k
 * @method Y
 * @method dY
 * @method F
 * @method get_interval_a
 * @method compute_a_tau
 * @method time
 * @method universe_age
 * @method duration
 * @method metric_distance
 * @method luminosity
 * @method luminosity_distance
 * @method angular_diameter_distance
 * @method brightness
 * @method apparent_diameter
 * @method integral_duration
 * @method integral_duration_substituated
 * @method integral_distance
 * @method equa_diff_a
 * @method equa_diff_time
 */
class Simulation_universe extends simulation_1.Simulation {
    //-------------------------constructor-----------------------
    constructor(id, temperature = 2.7255, hubble_cst = 67.74, matter_parameter = 3.089e-1, has_cmb = true, has_neutrino = true, is_flat = false) {
        super(id);
        this._dark_energy = {
            parameter_value: 6.911e-1,
            w_0: -1,
            w_1: 0,
        };
        this._constants = {
            c: c,
            k: k,
            h: h,
            G: G,
        };
        this._temperature = temperature;
        this._hubble_cst = hubble_cst;
        this._matter_parameter = matter_parameter;
        this._has_cmb = has_cmb;
        this._has_neutrino = has_neutrino;
        this._is_flat = is_flat;
    }
    //--------------------------Accessors------------------------
    // temperature
    get temperature() {
        return this._temperature;
    }
    set temperature(temperature) {
        this._temperature = temperature;
    }
    // hubble_cst
    get hubble_cst() {
        return this._hubble_cst;
    }
    set hubble_cst(hubble_cst) {
        this._hubble_cst = hubble_cst;
    }
    // matter_parameter
    get matter_parameter() {
        return this._matter_parameter;
    }
    set matter_parameter(matter_parameter) {
        this._matter_parameter = matter_parameter;
    }
    // dark_energy
    get dark_energy() {
        return this._dark_energy;
    }
    // constants
    get constants() {
        return this._constants;
    }
    // has_cmb
    get has_cmb() {
        return this._has_cmb;
    }
    set has_cmb(has_cmb) {
        this._has_cmb = has_cmb;
    }
    // has_neutrino
    get has_neutrino() {
        return this._has_neutrino;
    }
    set has_neutrino(has_neutrino) {
        this._has_neutrino = has_neutrino;
    }
    // is_flat
    get is_flat() {
        return this.is_flat;
    }
    set is_flat(is_flat) {
        this._is_flat = is_flat;
    }
    //---------------------------methods-------------------------
    //                      redefined methods
    //                         new methods
    /**
     * replace the setter for the dark_energy attribute
     *
     * @param DE_parameter_value value of the dark energy density parameter
     * @param DE_w_0 value of w_0
     * @param DE_w_1 value of w_1
     *
     * Note : w_0, w_1 are parameters that describe the nature of the dark energy.
     */
    modify_dark_energy(DE_parameter_value, DE_w_0, DE_w_1) {
        if (DE_parameter_value !== undefined) {
            this._dark_energy.parameter_value = DE_parameter_value;
        }
        if (DE_w_0 !== undefined) {
            this._dark_energy.w_0 = DE_w_0;
        }
        if (DE_w_1 !== undefined) {
            this._dark_energy.w_1 = DE_w_1;
        }
    }
    /**
     * replace the setter for the constants attribute
     *
     * @param c light speed constant
     * @param k Boltzmann constant
     * @param h Planck constant
     * @param G Newton constant
     */
    modify_constants(c, k, h, G) {
        if (c !== undefined) {
            this._constants.c = c;
        }
        if (k !== undefined) {
            this._constants.k = k;
        }
        if (h !== undefined) {
            this._constants.h = h;
        }
        if (G !== undefined) {
            this._constants.G = G;
        }
    }
    /**
     * Fourth order Runge-Kutta method for second order derivatives for universe computation.
     *
     * @param step The step of computation
     * @param x_0 x_point where the calcul start
     * @param y_0 initial value of y at x_0
     * @param interval Array containing [xmin, xmax]
     * @param funct function or method that define the equation to resolve, your function has to accept 2 numbers and return a number
     *
     * @returns [step: number, x: number[], y:number[]].
     */
    runge_kutta_universe_1(step, x_0 = 0, y_0 = 1, funct, interval = [0, 5]) {
        // Init parameter
        let x = [x_0];
        let y = [y_0];
        // Computation loops
        // Computing with a positive step, i increments the array
        let i = 0;
        let result_runge_kutta;
        while (interval[0] <= x[i] && x[i] < interval[1]) {
            result_runge_kutta = this.runge_kutta_equation_order1(step, x[i], y[i], funct);
            x.push(result_runge_kutta[0]);
            y.push(result_runge_kutta[1]);
            i++;
        }
        /*
            Computing with a negative step,
            since we decrease the value of x we add the elements at the beginning of the arrays,
            so for each step we take the first element of the array to compute the next one.
        */
        while (interval[0] <= x[0] && x[0] < interval[1]) {
            result_runge_kutta = this.runge_kutta_equation_order1(-step, x[0], y[0], funct);
            x.unshift(result_runge_kutta[0]);
            y.unshift(result_runge_kutta[1]);
            i++;
        }
        return { x: x, y: y };
    }
    /**
     * Fourth order Runge-Kutta method for second order derivatives for universe computation.
     *
     * @param step The step of computation
     * @param x_0 x_point where the calcul start
     * @param y_0 initial value of y at x_0
     * @param yp_0 initial value of the derivative of y at x_0
     * @param interval Array containing [ymin, ymax]
     * @param funct function or method that define the equation to resolve, your function has to accept 3 numbers and return a number
     *
     * @returns [step: number, x: number[], y:number[], yp: number[]].
     */
    runge_kutta_universe_2(Simu, step, x_0 = 0, y_0 = 1, yp_0 = 1, funct, interval = [0, 5]) {
        // Init parameter
        let x = [x_0];
        let y = [y_0];
        let yp = [yp_0];
        // Computation loops
        // Computing with a positive step, i increments the array
        let i = 0;
        let result_runge_kutta;
        while (interval[0] <= y[i] && y[i] < interval[1]) {
            result_runge_kutta = this.runge_kutta_equation_order2(Simu, step, x[i], y[i], yp[i], funct);
            x.push(result_runge_kutta[0]);
            y.push(result_runge_kutta[1]);
            yp.push(result_runge_kutta[1]);
            i++;
        }
        /*
            Computing with a negative step,
            since we decrease the value of x we add the elements at the beginning of the arrays,
            so for each step we take the first element of the array to compute the next one.
        */
        while (interval[0] <= y[0] && y[0] < interval[1]) {
            result_runge_kutta = this.runge_kutta_equation_order2(Simu, -step, x[0], y[0], yp[0], funct);
            x.unshift(result_runge_kutta[0]);
            y.unshift(result_runge_kutta[1]);
            yp.unshift(result_runge_kutta[1]);
            i++;
        }
        return { x: x, y: y, dy: yp };
    }
    /**
     * @returns the radiation density parameter
     */
    calcul_omega_r() {
        let sigma = (2 * Math.pow(Math.PI, 5) * Math.pow(this.constants.k, 4)) /
            (15 *
                Math.pow(this.constants.h, 3) *
                Math.pow(this.constants.c, 2));
        let rho_r = (4 * sigma * Math.pow(this.temperature, 4)) /
            Math.pow(this.constants.c, 3);
        // Hubble-Lemaître constant in international system units (Système International)
        let H0_si = (this.hubble_cst * 1e3) / (((AU * (180 * 3600)) / Math.PI) * 1e6);
        let omega_r = (8 * Math.PI * this.constants.G * rho_r) / (3 * Math.pow(H0_si, 2));
        if (this.has_neutrino) {
            omega_r *= 1.68;
        }
        if (!(this.has_neutrino && this.has_cmb)) {
            omega_r = 0;
        }
        return omega_r;
    }
    /**
     * @returns the curvature density parameter
     */
    calcul_omega_k() {
        return (1 -
            this.calcul_omega_r() -
            this.matter_parameter -
            this.dark_energy.parameter_value);
    }
    /**
     * Y function \
     * see Theory about cosmology and dark_energy
     * @param x variable
     * @returns value of Y at position x
     */
    Y(x) {
        return Math.exp(-3 *
            (this.dark_energy.w_0 + this.dark_energy.w_1 + 1) *
            Math.log(x) -
            3 * this.dark_energy.w_1 * (1 - x));
    }
    /**
     * Y' function \
     * see Theory about cosmology and dark_energy
     * @param x variable
     * @returns value of the derivative of Y at position x
     */
    dY(x) {
        return (this.Y(x) *
            (3 * this.dark_energy.w_1 -
                3 * (1 + this.dark_energy.w_0 + this.dark_energy.w_1)));
    }
    /**
     * F function \
     * see Theory about cosmology and dark_energy
     * @param x variable
     * @returns value of F(x)
     */
    F(x) {
        return ((1 + x) ** 2 * this.calcul_omega_k() +
            (1 + x) ** 3 * this.matter_parameter +
            (1 + x) ** 4 * this.calcul_omega_r() +
            this.Y(1 / (1 + x)) * this.dark_energy.parameter_value);
    }
    /**
     *
     * @returns array [amin, amax]
     */
    get_interval_a() {
        return [];
    }
    /**
     * compute_a_tau in point
     * @param step Computation step
     */
    compute_a_tau(step) {
        return this.runge_kutta_universe_2(this, step, 0, 1, 1, this.equa_diff_a);
    }
    /**
     * Compute the time as a function of the cosmologic shift
     * @param n number of computation points
     * @param zmin
     * @param zmax
     * @returns
     */
    time(n, zmin, zmax) {
        let step = (zmax - zmin) / n;
        let time_zmin;
        try {
            time_zmin = this.duration(0, zmin);
        }
        catch (e) {
            return e;
        }
        return this.runge_kutta_universe_1(step, zmin, time_zmin, this.equa_diff_time, [zmin, zmax]);
    }
    /**
     * Compute the current universe's age
     * @returns the current age of the universe
     */
    universe_age() {
        /*
        To compute the age of the universe we need to integrate from x = 0 to x -> infinity. To resolve this problem we do a substitution with
        x = y / (1 - y) which implies dx = dy / (1 - y)². This result with an integral from y = 0 to y = 1 that can be digitally resolved.
        */
        let age;
        let H0_si = (this.hubble_cst * 1e3) / (((AU * (180 * 3600)) / Math.PI) * 1e6);
        age =
            this.simpson(this.integral_duration_substituated, 0, 1, 100) /
                H0_si;
        return age;
    }
    /**
     * Compute the cosmologic duration between two cosmologics shift z
     * @param z_1 the closest cosmologic shift from ours (z = 0)
     * @param z_2 the farest cosmologic shift from ours (z = 0)
     * @returns error if z_1 or z_2 < -1, duration if both value are accepted.
     */
    duration(z_1, z_2) {
        if (z_1 < -1 || z_2 < -1) {
            throw new Error("Cosmologic shift z cannot be lower than -1");
        }
        let duration;
        duration = this.simpson(this.integral_duration, z_2, z_1, 100);
        return duration;
    }
    /**
     * Compute the distance between us and an object at a cosmologic redshit z
     * @param z cosmologic shift
     * @returns the distance
     */
    metric_distance(z) {
        let distance;
        let courbure = this.calcul_omega_k();
        let H0_si = (this.hubble_cst * 1e3) / (((AU * (180 * 3600)) / Math.PI) * 1e6);
        distance = this.simpson(this.integral_distance, 0, z, 100);
        if (courbure < 0) {
            distance =
                Math.sinh(Math.sqrt(Math.abs(courbure)) * distance) /
                    Math.sqrt(Math.abs(courbure));
        }
        else if (courbure > 0) {
            distance =
                Math.sin(Math.sqrt(Math.abs(courbure)) * distance) /
                    Math.sqrt(Math.abs(courbure));
        }
        distance *= this.constants.c / H0_si;
        return distance;
    }
    /**
     * Compute the luminosity distance
     * @param z Cosmologic shift
     * @param distance_metric optionnal parameters for optimisation (permit you to pass an already calculated distances for optimisation)
     * @returns luminosity distance
     */
    luminosity_distance(z, distance_metric) {
        let distance;
        if (distance_metric === undefined) {
            distance = this.metric_distance(z);
        }
        else {
            distance = distance_metric;
        }
        return distance * (1 + z);
    }
    /**
     * @param z Cosmologic shift
     * @param distance_metric
     */
    angular_diameter_distance(z, distance_metric) {
        let distance;
        if (distance_metric === undefined) {
            distance = this.metric_distance(z);
        }
        else {
            distance = distance_metric;
        }
        return distance / (1 + z);
    }
    /**
     * Compute the luminosity of an astronomical object of an unifrom intensity I
     * @param I intensity
     * @returns luminosity
     */
    luminosity(I) {
        return 4 * Math.PI * I;
    }
    /**
     * Compute the brightness of an object situated at a cosmologic redshit z
     * @param z Cosmologic shift
     * @param luminosity self explanatory
     * @param distance_metric optionnal parameters for optimisation (permit you to pass an already calculated distances for optimisation)
     */
    brightness(z, luminosity, distance_metric) {
        let distance;
        if (distance_metric === undefined) {
            distance = this.metric_distance(z);
        }
        else {
            distance = distance_metric;
        }
        return luminosity / (4 * Math.PI * Math.pow(distance * (1 + z), 2));
    }
    /**
     * Compute the apparent diameter (Or the angle between 2 object of same shift z)
     * @param D_e Euclydien linear diameter
     * @param z Cosmologic shift
     * @param distance_metric optionnal parameters for optimisation (permit you to pass an already calculated distances for optimisation)
     * @returns The apparent diameter
     */
    apparent_diameter(D_e, z, distance_metric) {
        let distance;
        if (distance_metric === undefined) {
            distance = this.metric_distance(z);
        }
        else {
            distance = distance_metric;
        }
        return (D_e * (1 + z)) / distance;
    }
    /**
     * @param x variable
     * @returns 1/(1 + x) * 1/sqrt(F(x))
     */
    integral_duration(x) {
        return ((1 / (1 + x)) * 1) / Math.sqrt(this.F(x));
    }
    /**
     * Function integral_duration with the substitution x = y/(1 - y)
     * @param y variable
     * @returns (1 - y) * 1/sqrt(F(x)) * 1/(1 - y)²\
     *
     * Note : 1/(1 - y)² is the term come from dx = dy/(1 - y)²
     */
    integral_duration_substituated(y) {
        return (((((1 - y) * 1) / Math.pow(1 - y, 2)) * 1) /
            Math.sqrt(this.F(y / (1 - y))));
    }
    /**
     * Integral used to compute the distances
     * @param x variable
     * @returns 1/F²(x)
     */
    integral_distance(x) {
        return 1 / Math.sqrt(this.F(x));
    }
    /**
     * Right part of the differential equation of a(tau) designed to be used in runge_kutta_universe_2 method
     * @param tau time
     * @param a function a(t)
     * @param da derivative of a(t)
     * @returns result of the right part\
     * Note: tau and da are not used but have to be defined for this method to be accepted in the runge_kutta_equation_order2 method of simulation class
     */
    equa_diff_a(Simu, tau, a, da = 0) {
        let omega_r = Simu.calcul_omega_r();
        let omega_m = Simu.matter_parameter;
        let omega_de = Simu.dark_energy.parameter_value;
        return (-(omega_r / a ** 2) -
            (0.5 * omega_m) / a ** 2 +
            omega_de *
                (a * Simu.Y(a) + (a ** 2 * Simu.dY(a)) / 2));
    }
    /**
     * Right part of the differential equation of t(z) designed to be used in runge_kutta_universe_1 method
     * @param z Cosmologic shift
     * @param t function time t(z)
     * @returns result of the right part\
     * Note: t is not used but has to be defined for this method to be accepted in the runge_kutta_equation_order1 method of simulation class
     */
    equa_diff_time(z, t = 0) {
        let H0_si = (this.hubble_cst * 1e3) / (((AU * (180 * 3600)) / Math.PI) * 1e6);
        return 1 / (H0_si * (1 + z) * Math.sqrt(this.F(z)));
    }
}
exports.Simulation_universe = Simulation_universe;
//# sourceMappingURL=simulation_universe.js.map