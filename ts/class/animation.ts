/**
* This is one of the two inherited class from Graphic.
* It shouldn't be used for static graphic representation.
*/

import { Graphic } from './graphic'

class Animation extends Graphic
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