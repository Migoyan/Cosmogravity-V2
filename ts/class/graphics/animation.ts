import { Simulation } from '../simulation/simulation';
import { Schwarzschild } from "../simulation/schwarzschild";
import { Kerr } from "../simulation/kerr";
import { Mobile } from "../simulation/simulation objects/mobile";
import { Graphic } from './graphic';

/**
 * This is one of the two inherited class from Graphic.
 * It shouldn't be used for static graphic representation.
 * 
 * @method draw
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
    
    
    public draw(): void {}


    public main_trajectory(simulation: any, reference_frame: "A" | "DO"): void
    {
        let r_f = reference_frame;

        if (simulation instanceof Schwarzschild === true)
        {
            var schwarzschild_metric = true;
        }
        else
        {
            var kerr_metric = true;
        }

        simulation.mobile_initialization();

        let trajectory_result: number[][];

        for (let i=0; i<1000; i++)
        {
            simulation.mobile_list.forEach((mobile: Mobile) =>
            {
                simulation.runge_kutta_trajectory(mobile, r_f);
            });
        }

    }

    

}
