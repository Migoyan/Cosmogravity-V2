/**
 * This class closely related to the Graphic class and subclasses.
 * An instance of this class is created via their save method.
 * 
 */

import { Graphic } from "./graphic";

class Image
{
    private graphic: Graphic;
    public name: string;
    public format: string;
    public adress: string;

    constructor(graphe: Graphic, name: string, format: string, adress: string)
    {
        this.graphic = Graphic;
        this.name = name;
        this.format = format;
        this.adress = adress;
    }



}