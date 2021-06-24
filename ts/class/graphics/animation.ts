import { Simulation } from '../simulation/simulation';
import { Schwarzschild } from "../simulation/schwarzschild";
import { Kerr } from "../simulation/kerr";
import { Mobile } from "../simulation/simulation objects/mobile";
import { Graphic } from './graphic';

/**
 * This is one of the two inherited class from Graphic.
 * It shouldn't be used for static graphic representation.
 * 
 * @method main_trajectory
 */

class Animation extends Graphic
{

    //-------------------- Constructor --------------------


    constructor(id_graph: string, simulation: Simulation)
    {
        super(id_graph, simulation);
    }
    

    //---------------------- Methods -----------------------
    

    public main_trajectory(simulation: any, reference_frame: "A" | "DO"): void
    {
        let tau: number = 0;
        let dtau: number;
        let schwarzschild_metric: boolean = false;
        let kerr_metric: boolean = false;
        let rebound: boolean = false;
        
        // The following instruction bloc allows us to store the data for each mobile
        // in a Map object (dictionnary).
        let mobiles_data = new Map<string, number[]>();
        simulation.mobile_list.forEach((mobile: Mobile) => 
        {
            mobiles_data.set(mobile.id, []);
        });

        if (simulation instanceof Schwarzschild)
        {
            schwarzschild_metric = true;

            if (simulation.central_body.collidable)
            {
                rebound = true;
            }
        }
        else if (simulation instanceof Kerr)
        {
            kerr_metric = true;
        }

        simulation.mobile_initialization();

        for (let i=0; i<100; i++)
        {
            tau += dtau;

            simulation.mobile_list.forEach((mobile: Mobile) =>
            {
                simulation.mobile_new_position(mobile, dtau, reference_frame);
            });
        }

    }

    



}
