import { Simulation } from "./simulation.js";
import { TypeAnnee, c, k, h, G, AU, parsec, k_parsec, M_parsec, ly } from "./../../constants.js";
/**
 * @class Simulation_universe.
 * inheritance from Simulation class
 *
 * attributes :
 * @param temperature : current temperature of the universe.
 * @param hubble_cst : current value of the Hubble-LeMaître constant.
 * @param H0parsec : Hubble-Lemaître constant in international system units
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
 * @method runge_kutta_universe_1
 * @method runge_kutta_universe_2
 * @method calcul_rho_r
 * @method calcul_rho_lambda
 * @method calcul_rho_m
 * @method calcul_omega_r
 * @method calcul_omega_k
 * @method check_sum_omegas
 * @method Y
 * @method dY
 * @method F
 * @method function_E
 * @method T(z)
 * @method H(z)
 * @method omega_m_shift
 * @method omega_k_shift
 * @method omega_DE_shift
 * @method omega_r_shift
 * @method compute_scale_factor
 * @method compute_omegas
 * @method time
 * @method universe_age
 * @method duration
 * @method metric_distance
 * @method luminosity
 * @method luminosity_distance
 * @method light_distance
 * @method angular_diameter_distance
 * @method brightness
 * @method apparent_diameter
 * @method integral_duration_substituated
 * @method integral_distance
 * @method equa_diff_a
 * @method equa_diff_time
 */
export class Simulation_universe extends Simulation {
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
            AU: AU,
            parsec: parsec,
            k_parsec: k_parsec,
            M_parsec: M_parsec,
            ly: ly,
            nbrJours: TypeAnnee.Gregorienne,
        };
        this._temperature = temperature;
        this._hubble_cst = hubble_cst;
        this._H0parsec = (hubble_cst * 1e3) / (((AU * (180 * 3600)) / Math.PI) * 1e6);
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
        this.check_sum_omegas();
    }
    // hubble_cst
    get hubble_cst() {
        return this._hubble_cst;
    }
    set hubble_cst(hubble_cst) {
        this._hubble_cst = hubble_cst;
        this.check_sum_omegas();
    }
    //H0parsec
    get H0parsec() {
        return this.H0parsec;
    }
    set H0parsec(H0) {
        this._H0parsec = H0;
        this.check_sum_omegas();
    }
    // matter_parameter
    get matter_parameter() {
        return this._matter_parameter;
    }
    set matter_parameter(matter_parameter) {
        this._matter_parameter = matter_parameter;
        this.check_sum_omegas();
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
        this.check_sum_omegas();
    }
    // has_neutrino
    get has_neutrino() {
        return this._has_neutrino;
    }
    set has_neutrino(has_neutrino) {
        this._has_neutrino = has_neutrino;
        this.check_sum_omegas();
    }
    // is_flat
    get is_flat() {
        return this._is_flat;
    }
    set is_flat(is_flat) {
        this._is_flat = is_flat;
        this.check_sum_omegas();
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
            this.check_sum_omegas(true);
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
     * @param TypeAnnee Number of days in chosen Type of Year
     */
    modify_constants(c, k, h, G, typeAnnee) {
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
        if (typeAnnee = "Sidérale") {
            var nbrjours = TypeAnnee.Siderale;
        }
        else if (typeAnnee = "Julienne") {
            var nbrjours = TypeAnnee.Julienne;
        }
        else if (typeAnnee = "Tropique (2000)") {
            var nbrjours = TypeAnnee.Tropique2000;
        }
        else {
            var nbrjours = TypeAnnee.Gregorienne;
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
            result_runge_kutta = this.runge_kutta_equation_order1(this, step, x[i], y[i], funct);
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
            result_runge_kutta = this.runge_kutta_equation_order1(this, -step, x[0], y[0], funct);
            x.unshift(result_runge_kutta[0]);
            y.unshift(result_runge_kutta[1]);
            i++;
        }
        return {
            x: x,
            y: y
        };
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
    runge_kutta_universe_2(step, x_0 = 0, y_0 = 1, dy_0 = 1, funct, interval) {
        // Init parameter
        let x = [x_0];
        let y = [y_0];
        let dy = [dy_0];
        // Computation loops
        // Computing with a positive step, i increments the array
        let i = 0;
        let result_runge_kutta;
        while (interval[0] <= y[i] && y[i] < interval[1]) {
            result_runge_kutta = this.runge_kutta_equation_order2(this, step, x[i], y[i], dy[i], funct);
            x.push(result_runge_kutta[0]);
            y.push(result_runge_kutta[1]);
            dy.push(result_runge_kutta[2]);
            i++;
        }
        /*
            Computing with a negative step,
            since we decrease the value of x we add the elements at the beginning of the arrays,
            so for each step we take the first element of the array to compute the next one.
        */
        while (interval[0] <= y[0] && y[0] < interval[1]) {
            result_runge_kutta = this.runge_kutta_equation_order2(this, -step, x[0], y[0], dy[0], funct);
            x.unshift(result_runge_kutta[0]);
            y.unshift(result_runge_kutta[1]);
            dy.unshift(result_runge_kutta[2]);
            i++;
        }
        return {
            x: x,
            y: y,
            dy: dy
        };
    }
    calcul_rho_r() {
        let sigma = (2 * Math.pow(Math.PI, 5) * Math.pow(this.constants.k, 4)) /
            (15 * Math.pow(this.constants.h, 3) * Math.pow(this.constants.c, 2));
        return (4 * sigma * Math.pow(this.temperature, 4)) / Math.pow(this.constants.c, 3);
    }
    calcul_rho_lambda() {
        let omega = this.dark_energy.parameter_value;
        let const_cosmo = 3 * Math.pow(this._H0parsec, 2) * omega / Math.pow(this.constants.c, 2);
        return const_cosmo * Math.pow(c, 2) / (8 * Math.PI * G);
    }
    calcul_rho_m() {
        return 3 * Math.pow(this.hubble_cst * 3.086 * Math.pow(10, -16), 2) / (8 * Math.PI * G);
    }
    /**
     * compute radiation density parameter at current time
     * @returns the radiation density parameter
     */
    calcul_omega_r() {
        // Hubble-Lemaître constant in international system units (Système International)
        let omega_r = (8 * Math.PI * this.constants.G * this.calcul_rho_r()) / (3 * Math.pow(this._H0parsec, 2));
        if (this.has_neutrino) {
            omega_r *= 1.68;
        }
        if (!this.has_cmb) {
            omega_r = 0;
        }
        return omega_r;
    }
    /**
     * Compute curvature density parameter at current time
     * @returns the curvature density parameter
     */
    calcul_omega_k() {
        if (this.is_flat) {
            return 0;
        }
        else {
            return (1 -
                this.calcul_omega_r() -
                this.matter_parameter -
                this.dark_energy.parameter_value);
        }
    }
    /**
     * Check if the sum of the density parameters is equal to 1. Otherwise modify one parameter to correct the sum.
     * @param modify_matter true : modify the matter parameter, false : dark energy parameter instead
     * @returns false if one parm has been modified, true otherwise
     */
    check_sum_omegas(modify_matter = true) {
        let is_param_modified = false;
        let omega_r = this.calcul_omega_r();
        let sum = this.matter_parameter + omega_r + this.dark_energy.parameter_value + this.calcul_omega_k();
        if (this.is_flat && sum !== 1) {
            is_param_modified = true;
            if (modify_matter) {
                this.matter_parameter = 1 - this.dark_energy.parameter_value - omega_r;
            }
            else {
                this.modify_dark_energy(1 - this.matter_parameter - omega_r);
            }
        }
        return is_param_modified;
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
                3 * (1 + this.dark_energy.w_0 + this.dark_energy.w_1) / x));
    }
    /**
     * F function \
     * see Theory about cosmology and dark_energy
     * @param x variable
     * @returns value of F(x)
     */
    F(x) {
        return (Math.pow((1 + x), 2) * this.calcul_omega_k() +
            Math.pow((1 + x), 3) * this.matter_parameter +
            Math.pow((1 + x), 4) * this.calcul_omega_r() +
            this.Y(1 / (1 + x)) * this.dark_energy.parameter_value);
    }
    /**
     * E function \
     * will be used tu calculate the Omegas in function of the shift z
     * @param x
     * @param omegam0 matter density parameter
     * @param omegalambda0 dark energy parameter
     * @param Or radiation density parameter
     * @returns
     */
    function_E(x, omegam0, omegalambda0, Or) {
        return (Number(Or) * Math.pow((1 + x), 4) + Number(omegam0) * Math.pow((1 + x), 3)
            + (1 - Number(omegam0) - Number(Or) - Number(omegalambda0)) * Math.pow((1 + x), 2)
            + Number(omegalambda0));
    }
    /**
     * calculates the temperature as a function of the shift z
     * @param z shift
     *
     */
    T(z) {
        return this.temperature * (1 + Number(z));
    }
    /**
     * calculates the Hubble constant as a function of the shift z
     * @param z
     */
    H(z) {
        let omega_m0 = this.matter_parameter;
        let omega_DE0 = this.dark_energy.parameter_value;
        let omega_r0 = this.calcul_omega_r();
        return this.hubble_cst * Math.pow(this.function_E(Number(z), omega_m0, Number(omega_DE0), omega_r0), 0.5);
    }
    /**
     * calculates the matter density parameter as a function of the shif z
     * @param z Redshift
     * */
    omega_m_shift(z) {
        //		return this.matter_parameter * (1 + z)**3 / this.F(z);
        let omega_m0 = this.matter_parameter;
        let omega_DE0 = this.dark_energy.parameter_value;
        let omega_r0 = this.calcul_omega_r();
        return omega_m0 * Math.pow(1 + Number(z), 3) / this.function_E(Number(z), omega_m0, Number(omega_DE0), omega_r0);
    }
    /**
 * calculates the curvature density parameter as a function of the shif z
 * @param z Redshift
 * */
    omega_k_shift(z) {
        let omega_k0 = this.calcul_omega_k();
        let omega_m0 = this.matter_parameter;
        let omega_DE0 = this.dark_energy.parameter_value;
        let omega_r0 = this.calcul_omega_r();
        return omega_k0 * Math.pow(1 + Number(z), 2) /
            this.function_E(Number(z), omega_m0, Number(omega_DE0), omega_r0);
    }
    /**
    * calculates the dark energy parameter as a function of the shif z
    * @param z Redshift
    * */
    omega_DE_shift(z) {
        let omegaDE0 = this.dark_energy.parameter_value;
        let omega_m0 = this.matter_parameter;
        let omega_r0 = this.calcul_omega_r();
        return omegaDE0 / this.function_E(Number(z), omega_m0, omegaDE0, omega_r0);
    }
    /**
    * calculates the radiation density parameter as a function of the shif z
    * @param z Redshift
    * */
    omega_r_shift(z) {
        let omega_r0 = this.calcul_omega_r();
        let omega_m0 = this.matter_parameter;
        let omega_DE0 = this.dark_energy.parameter_value;
        return omega_r0 * Math.pow(1 + Number(z), 4) / this.function_E(Number(z), omega_m0, omega_DE0, omega_r0);
        //return this.calcul_omega_r() * (1 + z)**3 / this.F(z);
    }
    /**
     * compute the scale factor of the universe as function of time
     * @param step Computation step
     * @param interval_a Array containing a_min et a_max value
     * @param universe_age Permit to pass an already computed value for the universe age. If not given, the method recompute the value.
     * @returns t value, a value, derivative of a
     */
    compute_scale_factor(step, interval_a = [0, 5], universe_age) {
        let age;
        if (universe_age === undefined) {
            age = this.universe_age();
        }
        else {
            age = universe_age;
        }
        if (isNaN(age)) {
            age = 0;
        }
        let result = this.runge_kutta_universe_2(step, 0, 1, 1, this.equa_diff_a, interval_a);
        for (let index = 0; index < result.x.length; index++) {
            result.x[index] = (result.x[index] / this.hubble_cst + age) / (3600 * 24 * 365.2425);
        }
        return result;
    }
    /**
     * Computing the 4 density parameters given an array of cosmologic shift value
     * @param z_array array containing z points where to compute the omegas
     */
    compute_omegas(z_array) {
        let omega_matter = [];
        let omega_rad = [];
        let omega_de = [];
        let omega_courbure = [];
        let radiation = this.calcul_omega_r();
        let curvature = this.calcul_omega_k();
        z_array.forEach(z => {
            omega_matter.push(this.matter_parameter * Math.pow((1 + z), 3) / this.F(z));
            omega_rad.push(radiation * Math.pow((1 + z), 3) / this.F(z));
            omega_de.push(this.dark_energy.parameter_value * Math.pow((1 + z), 3) / this.F(z));
            omega_courbure.push(curvature * Math.pow((1 + z), 3) / this.F(z));
        });
        return {
            omega_matter: omega_matter,
            omega_rad: omega_rad,
            omega_de: omega_de,
            omega_courbure: omega_courbure
        };
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
     * @returns the current age of the universe in seconds
     */
    universe_age() {
        /*
        To compute the age of the universe we need to integrate from x = 0 to x -> infinity. To resolve this problem we do a substitution with
        x = y / (1 - y) which implies dx = dy / (1 - y)². This result with an integral from y = 0 to y = 1 that can be digitally resolved.
        */
        let age;
        age =
            this.simpson(this, this.integral_duration_substituated, 0, 1, 10000) /
                this.hubble_cst;
        return age;
    }
    /**
     * name
     */
    emission_age(z) {
        let infimum = z / (1 + z);
        let age;
        age =
            this.simpson(this, this.integral_duration_substituated, infimum, 1, 1000) /
                this.hubble_cst;
        return age;
    }
    /**
     * Compute the cosmologic duration between two cosmologics shift z
     * @param z_1 the closest cosmologic shift from ours (z = 0)
     * @param z_2 the farest cosmologic shift from ours (z = 0)
     * @returns error if z_1 or z_2 < -1, duration if both value are accepted.
     */
    duration(z_1, z_2) {
        if (z_1 <= -1 || z_2 <= -1) {
            throw new Error("Cosmologic shift z cannot be equal or lower than -1 included");
        }
        let infimum = z_1 / (1 + z_1);
        let supremum = z_2 / (1 + z_2);
        let duration;
        duration = this.simpson(this, this.integral_duration_substituated, infimum, supremum, 1000) / this.hubble_cst;
        return duration;
    }
    /**
     * Compute the distance between us and an object at a cosmologic redshit z
     * @param z cosmologic shift
     * @returns the distance
     */
    metric_distance(z) {
        let distance;
        let curvature = this.calcul_omega_k();
        distance = this.simpson(this, this.integral_distance, 0, z, 100);
        if (curvature < 0) {
            distance =
                Math.sinh(Math.sqrt(Math.abs(curvature)) * distance) /
                    Math.sqrt(Math.abs(curvature));
        }
        else if (curvature > 0) {
            distance =
                Math.sin(Math.sqrt(Math.abs(curvature)) * distance) /
                    Math.sqrt(Math.abs(curvature));
        }
        distance *= this.constants.c / this.hubble_cst;
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
     * This fonction compute the distance with the simple formula c*t.
     * @param z Cosmologic shift
     * @returns c*t
     */
    light_distance(z) {
        let duration = this.duration(0, z);
        let c = this.constants.c;
        return duration * c;
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
     * formula 1/(1 + x) * sqrt(1 / F)
     * @param Simu object in witch method is applied, permit to use this function with simulation method
     * @param x variable
     * @returns 1/(1 + x) * sqrt(1 / F)
     */
    integral_duration(Simu, x) {
        return ((1 / (1 + x)) * Math.sqrt(1 / Simu.F(x)));
    }
    /**
     * formula 1/(1 + x) * 1/sqrt(F) with the substitution x = y/(1 - y), to be used with simpson method to compute duration.
     * @param Simu object in witch method is applied, permit to use this function with simulation method
     * @param y variable
     * @returns (1 - y) * 1/sqrt(F(x)) * 1/(1 - y)²\
     *
     * Note : 1/(1 - y)² is the term come from dx = dy/(1 - y)²
     */
    integral_duration_substituated(Simu, y) {
        return ((((1 - y) / Math.pow(1 - y, 2))) /
            Math.sqrt(Simu.F(y / (1 - y))));
    }
    /**
     * Integral used to compute the distances
     * @param Simu object in witch method is applied, permit to use this function with simulation method
     * @param x variable
     * @returns 1/F²(x)
     */
    integral_distance(Simu, x) {
        return 1 / Math.sqrt(Simu.F(x));
    }
    /**
     * Right part of the differential equation of a(tau) designed to be used in runge_kutta_universe_2 method
     * @param Simu object in witch method is applied, permit to use this function with simulation method
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
        return (-(omega_r / Math.pow(a, 3)) -
            (0.5 * omega_m) / Math.pow(a, 2) +
            omega_de *
                (a * Simu.Y(a) + (Math.pow(a, 2) * Simu.dY(a)) / 2));
    }
    /**
     * Right part of the differential equation of t(z) designed to be used in runge_kutta_universe_1 method
     * @param Simu object in witch method is applied, permit to use this function with simulation method
     * @param z Cosmologic shift
     * @param t function time t(z)
     * @returns result of the right part\
     * Note: t is not used but has to be defined for this method to be accepted in the runge_kutta_equation_order1 method of simulation class
     */
    equa_diff_time(Simu, z, t = 0) {
        return 1 / (this.hubble_cst * (1 + z) * Math.sqrt(Simu.F(z)));
    }
}
