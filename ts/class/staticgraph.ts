/**
* This is one of the two inherited class from Graphic.
* It shouldn't be used for dynamic graphic representation.
*/

import { Graphic } from './graphic'

class StaticGraph extends Graphic
{
    constructor(simulation: Simulation, layout: string)
    {
        super(simulation, layout);
    }


    draw(): void {}

    save(): void
    {
        super.save();
    }




}