import { Simulation } from '../simulation/simulation'
/**
* This is one of the two inherited class from Graphic.
* It shouldn't be used for static graphic representation.
*/

import { Graphic } from './graphic'

class Animation extends Graphic
{
    constructor(id_graph: string, simulation: Simulation)
    {
        super(id_graph, simulation);
    }
    
    public draw(): void {}
}