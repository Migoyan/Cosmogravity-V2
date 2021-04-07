/**
* This is one of the two inherited class from Graphic.
*/

import { Graphic } from './graphic'

class StaticGraph extends Graphic
{
    constructor(simulation: simulation, layout: string)
    {
        super(simulation, layout);
    }
    
    draw()
    {
    
    }

    save(): void
    {
        super.save();
    }




}