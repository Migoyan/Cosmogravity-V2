import { c } from "./../../../constants.js";
/**
 * @class Mobile
 *
 * This class is used to describe the different objects about which
 * we are calculating the trajectory.
 *
 * @param id
 * @param is_photon
 * @param r
 * @param phi
 * @param v_r
 * @param v_phi
 * @param v_norm
 * @param v_alpha
 * @param U_r
 * @param U_phi
 * @param L
 * @param E
 * @param dtau
 * @param clock_a
 * @param clock_do
*/
export class Mobile {
    //-------------------- Constructor ---------------------
    constructor(id, is_photon, r, phi, v_r, v_alpha) {
        this._id = id;
        this._is_photon = is_photon;
        this._r = r;
        this._phi = phi * Math.PI / 180;
        this._L = 0;
        this._E = 0;
        this._v_r = v_r;
        this._v_alpha = v_alpha * Math.PI / 180;
        this._v_phi = v_r * Math.sin(this.v_alpha);
        this._v_norm = Math.pow((Math.pow(v_r, 2) + Math.pow(this.v_phi, 2)), .5);
        this._clock_a = 0;
        this._clock_do = 0;
        if (is_photon) {
            this._v_r = c;
            this._v_norm = c;
        }
    }
    //--------------------- Accessors ----------------------
    // Id
    get id() { return this._id; }
    set id(id) { this._id = id; }
    // Is photon?
    get is_photon() { return this._is_photon; }
    set is_photon(is_photon) {
        this._is_photon = is_photon;
    }
    // Coordinate r
    get r() { return this._r; }
    set r(r) { this._r = r; }
    // Coordinate phi
    get phi() { return this._phi; }
    set phi(phi) { this._phi = phi; }
    // Physical velocity radius
    get v_r() { return this._v_r; }
    set v_r(v_r) { this._v_r = v_r; }
    // Physical speed tangential
    get v_phi() { return this._v_phi; }
    set v_phi(v_phi) { this._v_phi = v_phi; }
    // Physical velocity starting angle
    get v_alpha() { return this._v_alpha; }
    set v_alpha(v_alpha) { this._v_alpha = v_alpha; }
    // Physical velocity norm
    get v_norm() { return this._v_norm; }
    set v_norm(v_norm) { this._v_norm = v_norm; }
    // dr 
    get U_r() { return this._U_r; }
    set U_r(U_r) { this._U_r = U_r; }
    // dphi
    get U_phi() { return this._U_phi; }
    set U_phi(U_phi) { this._U_phi = U_phi; }
    // Integration constants
    get L() { return this._L; }
    set L(L) { this._L = L; }
    get E() { return this._E; }
    set E(E) { this._E = E; }
    // dtau
    get dtau() { return this._dtau; }
    set dtau(dtau) { this._dtau = dtau; }
    // proper time
    get clock_a() { return this._clock_a; }
    set clock_a(clock_a) {
        this._clock_a = clock_a;
    }
    // time distant observer
    get clock_do() { return this._clock_do; }
    set clock_do(clock_do) { this._clock_do = clock_do; }
}
