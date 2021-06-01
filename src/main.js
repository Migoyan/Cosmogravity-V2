(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulation = void 0;
/**
 * @class Simulation : abstract class.
 * No inheritance
 */
class Simulation {
    //-------------------- Constructors --------------------
    constructor(id) {
        this.id = id;
    }
    //--------------------- Accessors ----------------------
    get_id() {
        return this.id;
    }
    //---------------------- Methods -----------------------
    /**
     * Fourth order Runge-Kutta method for first order derivatives.
     *
     * @param step The step of computation
     * @param x_0,
     * @param y_0 initial value of y
     * @param funct function or method that define the equation to resolve
     *
     * @returns [x_1, y_1], value of the next point of computation
     */
    runge_kutta_equation_order1(Simu, step, x_0, y_0, funct) {
        let k_1 = funct(Simu, x_0, y_0);
        let k_2 = funct(Simu, x_0 + step / 2, y_0 + step / 2 * k_1);
        let k_3 = funct(Simu, x_0 + step / 2, y_0 + step / 2 * k_2);
        let k_4 = funct(Simu, x_0 + step, y_0 + step * k_3);
        let x_1 = x_0 + step;
        let y_1 = y_0 + step * ((1 / 6) * k_1 + (1 / 3) * k_2 + (1 / 3) * k_3 + (1 / 6) * k_4);
        return [x_1, y_1];
    }
    /**
     * Fourth order Runge-Kutta method for second order derivatives.
     *
     * @param step The step of computation
     * @param x_0,
     * @param y_0 initial value of y
     * @param dy_0 initial value of the derivative of y
     * @param funct function or method that define the equation to resolve
     *
     * @returns [x_1, y_1, yp_1], value of the next point of computation
     */
    runge_kutta_equation_order2(Simu, step, x_0, y_0, dy_0, funct) {
        let k_1 = funct(Simu, x_0, y_0, dy_0);
        let k_2 = funct(Simu, x_0 + step / 2, y_0 + step / 2 * dy_0, dy_0 + step / 2 * k_1);
        let k_3 = funct(Simu, x_0 + step / 2, y_0 + step / 2 * dy_0 + step ** 2 / 4 * k_1, dy_0 + step / 2 * k_2);
        let k_4 = funct(Simu, x_0 + step, y_0 + step * dy_0 + step ** 2 / 2 * k_2, dy_0 + step * k_3);
        let x_1 = x_0 + step;
        let y_1 = y_0 + step * dy_0 + step ** 2 / 6 * (k_1 + k_2 + k_3);
        let dy_1 = dy_0 + step / 6 * (k_1 + 2 * k_2 + 2 * k_3 + k_4);
        return [x_1, y_1, dy_1];
    }
    /**
     * Simple Simpson's rule implementation.
     *
     * @param funct function to integrate
     * @param infimum
     * @param supremum
     * @param n is the number of computation points.
     *
     * @returns value of the integral.
     */
    simpson(Simu, funct, infimum, supremum, n) {
        let step = (supremum - infimum) / n;
        let x = [];
        let y = [];
        for (let i = 0; i < n; i++) {
            x[i] = infimum + i * step;
            y[i] = funct(Simu, x[i]);
        }
        let res = 0;
        for (let i = 0; i < n; i++) {
            if (i == 0 || i == n) {
                res += y[i];
            }
            else if (i % 2 != 0) {
                res += 4 * y[i];
            }
            else {
                res += 2 * y[i];
            }
        }
        return res * step / 3;
    }
}
exports.Simulation = Simulation;

},{}],2:[function(require,module,exports){
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
        this._hubble_cst = (hubble_cst * 1e3) / (((AU * (180 * 3600)) / Math.PI) * 1e6);
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
        this._hubble_cst = (hubble_cst * 1e3) / (((AU * (180 * 3600)) / Math.PI) * 1e6);
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
        return this._is_flat;
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
    runge_kutta_universe_2(step, x_0 = 0, y_0 = 1, yp_0 = 1, funct, interval) {
        // Init parameter
        let x = [x_0];
        let y = [y_0];
        let yp = [yp_0];
        // Computation loops
        // Computing with a positive step, i increments the array
        let i = 0;
        let result_runge_kutta;
        while (interval[0] <= y[i] && y[i] < interval[1]) {
            result_runge_kutta = this.runge_kutta_equation_order2(this, step, x[i], y[i], yp[i], funct);
            x.push(result_runge_kutta[0]);
            y.push(result_runge_kutta[1]);
            yp.push(result_runge_kutta[2]);
            i++;
        }
        /*
            Computing with a negative step,
            since we decrease the value of x we add the elements at the beginning of the arrays,
            so for each step we take the first element of the array to compute the next one.
        */
        while (interval[0] <= y[0] && y[0] < interval[1]) {
            result_runge_kutta = this.runge_kutta_equation_order2(this, -step, x[0], y[0], yp[0], funct);
            x.unshift(result_runge_kutta[0]);
            y.unshift(result_runge_kutta[1]);
            yp.unshift(result_runge_kutta[2]);
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
        let omega_r = (8 * Math.PI * this.constants.G * rho_r) / (3 * Math.pow(this.hubble_cst, 2));
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
    check_sum_omegas(modify_matter = true) {
        let is_param_modified = false;
        let omega_r = this.calcul_omega_r();
        let sum = this.matter_parameter + omega_r + this.dark_energy.parameter_value + this.calcul_omega_k();
        if (this.is_flat && sum !== 1) {
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
     * compute_a_tau in point
     * @param step Computation step
     */
    compute_a_tau(step, interval_a = [0, 5], universe_age) {
        let age;
        if (universe_age === undefined) {
            age = this.universe_age();
        }
        else {
            age = universe_age;
        }
        let result = this.runge_kutta_universe_2(step, 0, 1, 1, this.equa_diff_a, interval_a);
        for (let index = 0; index < result.x.length; index++) {
            result.x[index] = (result.x[index] / this.hubble_cst + age) / (3600 * 24 * 365.2425);
        }
        console.log(this.universe_age() / (3600 * 24 * 365.2425));
        return result;
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
            this.simpson(this, this.integral_duration_substituated, 0, 1, 100) /
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
            throw new Error("Cosmologic shift z cannot be lower than -1 included");
        }
        let duration;
        duration = this.simpson(this, this.integral_duration, z_2, z_1, 1000) / this.hubble_cst;
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
        distance = this.simpson(this, this.integral_distance, 0, z, 100);
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
    integral_duration(Simu, x) {
        return ((1 / (1 + x))) / Math.sqrt(Simu.F(x));
    }
    /**
     * Function integral_duration with the substitution x = y/(1 - y)
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
     * @param x variable
     * @returns 1/F²(x)
     */
    integral_distance(Simu, x) {
        return 1 / Math.sqrt(Simu.F(x));
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
    equa_diff_time(Simu, z, t = 0) {
        return 1 / (this.hubble_cst * (1 + z) * Math.sqrt(Simu.F(z)));
    }
}
exports.Simulation_universe = Simulation_universe;

},{"./simulation":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simulation_universe_1 = require("./class/simulation/simulation_universe");
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
let universe = new simulation_universe_1.Simulation_universe("universe", 2.7255, 67.74, 3.0890e-1, true, true, false);
let age_universe = universe.universe_age() / (3600 * 24 * 365.2425);
let result_a_tau = universe.compute_a_tau(0.001);
let trace_1 = {
    x: result_a_tau.x,
    y: result_a_tau.y,
    mode: 'lines'
};
/*
let durations: number;
try {
    durations = universe.duration(0, 1000)/(3600*24*365.2425);
    console.log(durations);
    console.log(age_universe - durations);
} catch (error) {
    console.log(error);
}
*/
let graphe = document.getElementById("tester");
Plotly.newPlot(graphe, [trace_1], { margin: { t: 0 } });

},{"./class/simulation/simulation_universe":2}]},{},[3]);
