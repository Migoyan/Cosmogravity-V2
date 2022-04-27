import { Schwarzschild } from "../simulation/schwarzschild.js";
import { Kerr } from "../simulation/kerr.js";
import { Graphic } from './graphic.js';
/**
 * This is one of the two inherited class from Graphic.
 * It shouldn't be used for static graphic representation.
 *
 * @method main_trajectory
 */
class Animation extends Graphic {
    //-------------------- Constructor --------------------
    constructor(id_graph, simulation) {
        super(id_graph, simulation);
    }
    //---------------------- Methods -----------------------
    main_trajectory(simulation, reference_frame) {
        let tau = 0;
        let dtau;
        let schwarzschild_metric = false;
        let kerr_metric = false;
        let rebound = false;
        // The following instruction bloc allows us to store the data for each mobile
        // in a Map object (dictionnary).
        let mobiles_data = new Map();
        simulation.mobile_list.forEach((mobile) => {
            mobiles_data.set(mobile.id, []);
        });
        if (simulation instanceof Schwarzschild) {
            schwarzschild_metric = true;
            if (simulation.central_body.collidable) {
                rebound = true;
            }
        }
        else if (simulation instanceof Kerr) {
            kerr_metric = true;
        }
        simulation.mobile_initialization();
        for (let i = 0; i < 100; i++) {
            tau += dtau;
            simulation.mobile_list.forEach((mobile) => {
                simulation.mobile_new_position(mobile, dtau, reference_frame);
            });
        }
    }
}
