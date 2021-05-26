import { Simulation } from '../simulation/simulation'
/**
 * @class Graphic
 */
export abstract class Graphic {
    readonly id_graph: string;
    readonly simulation: Simulation;

	//-------------------------constructor-----------------------

    constructor(id_graph: string, simulation: Simulation)
    {
        this.simulation = simulation;
    }

    //--------------------------Accessors------------------------

    //---------------------------methods-------------------------
}