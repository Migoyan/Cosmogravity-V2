"use strict";
/**
 * @class Mobile
 *
 * This class is used to describe the different objects about which
 * we are calculating the trajectory.
 *
 * Attributes:
 * @param mass mass
 * @param r radial coordinate
 * @param phi angular coordinate
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mobile = void 0;
class Mobile {
    //-------------------- Constructor- --------------------
    constructor(is_photon, collidable, r, phi) {
        this.is_photon = is_photon;
        this.collidable = collidable;
        this.r = r;
        this.phi = phi;
    }
    //--------------------- Accessors ----------------------
    get_is_photon() { return this.is_photon; }
    set_is_photon(is_photon) { this.is_photon = is_photon; }
    get_collidable() { return this.collidable; }
    set_collidable(collidable) { this.collidable = collidable; }
    get_r() { return this.r; }
    set_r(r) { this.r = r; }
    get_phi() { return this.phi; }
    set_phi(phi) { this.phi = phi; }
}
exports.Mobile = Mobile;
