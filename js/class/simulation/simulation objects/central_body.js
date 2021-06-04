"use strict";
/**
 * @class Central_body
 *
 * This class is used to describe the central mass of a system in trajectory simulations.
 *
 * Attributes:
 * @param collidable determines if the object can collide with other objets
 * @param mass mass
 * @param radius radius
 * @param angular_m angular momentum (J)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Central_body = void 0;
class Central_body {
    //-------------------- Constructors --------------------
    constructor(collidable, mass, radius, angular_m) {
        this.collidable = collidable;
        this.mass = mass;
        this.radius = radius;
        if (angular_m === undefined) {
            this.angular_m = 0;
        }
        else {
            this.angular_m = angular_m;
        }
    }
    //--------------------- Accessors ----------------------
    // Collidable
    get_collidable() { return this.collidable; }
    // Mass
    get_mass() { return this.mass; }
    // Radius
    get_radius() { return this.radius; }
    // Angular momentum
    get_angular_m() { return this.angular_m; }
    //---------------------- Methods -----------------------
    // Schwarzschild Radius
    calculate_R_s() { return 2 * G * this.mass / c ** 2; }
    // Calculated parameter a=J/cM
    calculate_a() {
        if (this.angular_m == undefined) {
            return 0;
        }
        else {
            return this.angular_m / (c * this.mass);
        }
    }
    // R_h+
    calculate_R_hp(R_s, a) {
        if (this.angular_m == undefined) {
            return R_s;
        }
        else {
            return (R_s + Math.sqrt(R_s ** 2 - 4 * a ** 2)) / 2;
        }
    }
    // R_h-
    calculate_R_hm(R_s, a) {
        if (this.angular_m == undefined) {
            return 0;
        }
        else {
            return (R_s - Math.sqrt(R_s ** 2 - 4 * a ** 2)) / 2;
        }
    }
}
exports.Central_body = Central_body;
