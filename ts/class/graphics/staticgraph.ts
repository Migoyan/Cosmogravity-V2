import Plotly = require('../../lib/plotly.js');
import { Simulation } from '../simulation/simulation'
import { Graphic } from './graphic';
/**
 * This is one of the two inherited class from Graphic.
 * It shouldn't be used for dynamic graphic representation.
 */
export class StaticGraph extends Graphic {
    
    //-------------------------constructor-----------------------
    constructor(simulation: Simulation, layout: string)
    {
        super(simulation);
    }
    //--------------------------Accessors------------------------

    //---------------------------methods-------------------------
	//                      redefined methods

	//                         new methods

    draw(): void {}

    public save(format: string): void
    {
        super.save(format);
    }




}