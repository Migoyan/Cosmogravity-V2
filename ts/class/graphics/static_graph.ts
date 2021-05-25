import Plotly = require('../../lib/plotly.js/index.js');
import { Simulation } from '../simulation/simulation'
import { Graphic } from './graphic';
/**
 * This is one of the two inherited class from Graphic.
 * It shouldn't be used for dynamic graphic representation.
 */
export class Static_graph extends Graphic {

    //-------------------------constructor-----------------------
    constructor(simulation: Simulation, layout: string)
    {
        super(simulation);
    }
    //--------------------------Accessors------------------------

    //---------------------------methods-------------------------
	//                      redefined methods

	//                         new methods

    public save(format: string): void
    {
    }




}