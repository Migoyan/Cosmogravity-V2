/**
 * This is an abstract class, it should never be instantiated.
 * The derived subclasses are StaticGraph and Animation.
 * The purpose of these classes is to regroup all the drawing functions into a single object
 * instead of having them be methods for each type of simulation.
 * A graphic object is related to one and only one instance of simulation. This instance of simulation
 * is locked as an attribute as a way to tie a Graphic object to the source of its data.
 * The layout attribute point to the template which will be used to draw the current Graphic object.
 */

import { Simulation } from './simulation'

export abstract class Graphic
{
    // attribut dataset? serait plutôt le résultat d'une methode de simulation
    protected simulation: Simulation;
    protected layout: string;

    constructor(simulation: Simulation, layout: string)
    {
        this.simulation = simulation
        this.layout = layout
    }

    // An abstract method is implemented in derived classes.
    abstract draw(): void;

    save(): void {}




}