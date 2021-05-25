import { Simulation } from '../simulation/simulation'
/**
 * @class Graphic
 */
export abstract class Graphic {
    readonly simulation: Simulation;

	//-------------------------constructor-----------------------

    constructor(simulation: Simulation)
    {
        this.simulation = simulation;
    }

    //--------------------------Accessors------------------------

    //---------------------------methods-------------------------
}