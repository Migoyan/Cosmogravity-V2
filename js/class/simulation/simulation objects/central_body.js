import { c, G } from "./../../../constants.js";
/**
 * @class Central_body
 *
 * This class is used to describe the central mass of a system
 * in trajectory simulations.
 *
 * @param collidable
 * @param mass
 * @param radius
 * @param angular_m
 * @param R_s
 * @param a
 * @param R_hp
 * @param R_hm
 *
 * @method update_parameters
 */
export class Central_body {
    //-------------------- Constructor ---------------------
    constructor(collidable, mass, radius, angular_m) {
        this._collidable = collidable;
        this._mass = mass;
        this._R_s = 2 * G * this._mass / c ** 2;
        /* If the radius of a body is smaller than its Schwarzschild radius,
        it becomes a black hole and therefore a singularity in the framework
        of general relativity. */
        if (radius <= this._R_s) {
            this._radius = 0;
        }
        else {
            this._radius = radius;
        }
        /* If the angular momentum is not null, the Kerr metric is used and it
        needs new calculated parameters. */
        if (angular_m === undefined || angular_m === 0) {
            this._angular_m = 0;
            this._a = 0;
            this._R_hp = this._R_s;
            this._R_hm = 0;
        }
        else {
            this._angular_m = angular_m;
            this._a = this._angular_m / (c * this._mass);
            this._R_hp = (this._R_s
                + Math.sqrt(this._R_s ** 2 - 4 * this._a ** 2)) / 2;
            this._R_hm = (this._R_s
                - Math.sqrt(this._R_s ** 2 - 4 * this._a ** 2)) / 2;
        }
    }
    //--------------------- Accessors ----------------------
    // Collidable
    get collidable() { return this._collidable; }
    set collidable(collidable) {
        this._collidable = collidable;
    }
    // Mass
    get mass() { return this._mass; }
    set mass(mass) { this._mass = mass; }
    // Radius
    get radius() { return this._radius; }
    set radius(radius) {
        if (radius <= this._R_s) {
            this._radius = 0;
        }
        else {
            this._radius = radius;
        }
    }
    // Angular momentum
    get angular_m() { return this._angular_m; }
    set angular_m(angular_m) {
        this._angular_m = angular_m;
    }
    // Schwarzschild radius
    get R_s() { return this._R_s; }
    set R_s(R_s) { this._R_s = R_s; }
    // Parameter a
    get a() { return this._a; }
    set a(a) { this._a = a; }
    // R_hp
    get R_hp() { return this._R_hp; }
    set R_hp(R_hp) { this._R_hp = R_hp; }
    // R_hm
    get R_hm() { return this._R_hm; }
    set R_hm(R_hm) { this._R_hm = R_hm; }
    //---------------------- Methods -----------------------
    /**
     * Allows updating all the calculated parameters of a central body
     * if one of the primordial parameters is modified.
     */
    update_parameters() {
        this._R_s = 2 * G * this._mass / c ** 2;
        if (this._angular_m === 0) {
            this._a = 0;
            this._R_hp = this._R_s;
            this._R_hm = 0;
        }
        else {
            this._a = this._angular_m / (c * this._mass);
            this._R_hp = (this._R_s
                + Math.sqrt(this._R_s ** 2 - 4 * this._a ** 2)) / 2;
            this._R_hm = (this._R_s
                - Math.sqrt(this._R_s ** 2 - 4 * this._a ** 2)) / 2;
        }
    }
}
