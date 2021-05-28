"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulation_trajectory = void 0;
const simulation_1 = require("./simulation");
const central_body_1 = require("./simulation objects/central_body");
/**
 * @class Simulation_trajectory
 * inheritance from Simulation class
 *
 * Attributes:
 * @param central_body
 * @param mobile_list
 * @param c
 * @param G
 *
 * Methods:
 * @method add_mobile
 */
class Simulation_trajectory extends simulation_1.Simulation {
    //-------------------- Constructors --------------------
    constructor(id, collidable, mass, radius, angular_m) {
        super(id);
        // Allows the possibility to modify the constants
        this.c = c;
        this.G = G;
        this.central_body = new central_body_1.Central_body(collidable, mass, radius, angular_m);
        this.mobile_list = [];
    }
    //--------------------- Accessors ----------------------
    // Central body
    get_central_body() { return this.central_body; }
    // Mobiles
    get_mobile_list() { return this.mobile_list; }
    // Constants
    get_c() { return this.c; }
    set_c(c) { this.c = c; }
    get_G() { return this.G; }
    set_G(G) { this.G = G; }
    //---------------------- Methods -----------------------
    /**
     * Add a new mobile object to the simulation
     * @param mobile new mobile
     */
    add_mobile(mobile) { this.mobile_list.push(mobile); }
}
exports.Simulation_trajectory = Simulation_trajectory;
//# sourceMappingURL=simulation_trajectory.js.map