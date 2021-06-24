/**
 * @class Mobile
 *
 * This class is used to describe the different objects about which
 * we are calculating the trajectory.
 *
 * @param is_photon
 * @param collidable
 * @param mass
 * @param r
 * @param phi
 * @param U_r
 * @param U_phi
 * @param L
 * @param E
*/
export class Mobile {
    //-------------------- Constructor ---------------------
    constructor(is_photon, collidable, r, phi, U_r, U_phi) {
        this._is_photon = is_photon;
        this._collidable = collidable;
        this._r = r;
        this._phi = phi;
        this._L = 0;
        this._E = 0;
        if (U_r === undefined && U_phi === undefined) {
            this._U_r = 0;
            this._U_phi = 0;
        }
        else {
            this._U_r = U_r;
            this._U_phi = U_phi;
        }
    }
    //--------------------- Accessors ----------------------
    // Is photon?
    get is_photon() { return this._is_photon; }
    set is_photon(is_photon) {
        this._is_photon = is_photon;
    }
    // Collidable
    get collidable() { return this._collidable; }
    set collidable(collidable) {
        this._collidable = collidable;
    }
    // Coordinate r
    get r() { return this._r; }
    set r(r) { this._r = r; }
    // Coordinate phi
    get phi() { return this._phi; }
    set phi(phi) { this._phi = phi; }
    // Velocity U_r
    get U_r() { return this._U_r; }
    set U_r(U_r) { this._U_r = U_r; }
    // Velocity U_phi
    get U_phi() { return this._U_phi; }
    set U_phi(U_phi) { this._U_phi = U_phi; }
    // Integration constants
    get L() { return this._L; }
    set L(L) { this._L = L; }
    get E() { return this._E; }
    set E(E) { this._E = E; }
}
