import { Simulation } from "./simulation";
import { Central_body } from "./simulation objects/central_body";
/**
 * @class Simulation_trajectory
 * inheritance from Simulation class
 *
 * @param central_body
 * @param mobile_list
 * @param c
 * @param G
 *
 * @method add_mobile
 */
export class Simulation_trajectory extends Simulation {
    //-------------------- Constructor --------------------
    constructor(id, collidable, mass, radius, angular_m) {
        super(id);
        // Allows the possibility to modify the constants
        this._c = c;
        this._G = G;
        this._central_body = new Central_body(collidable, mass, radius, angular_m);
        this._mobile_list = [];
    }
    //--------------------- Accessors ----------------------
    // Central body
    get central_body() { return this._central_body; }
    // Mobiles
    get mobile_list() { return this._mobile_list; }
    // Constants
    get c() { return this._c; }
    set c(c) { this._c = c; }
    get G() { return this._G; }
    set G(G) { this._G = G; }
    //---------------------- Methods -----------------------
    /**
     * Add a new mobile object to the simulation
     * @param mobile
     */
    add_mobile(mobile) {
        this.mobile_list.push(mobile);
    }
}
