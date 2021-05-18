/**
 * @class Central_body
 * 
 * This class is used to describe the central mass of a system in trajectory simulations.
 * 
 * Attributes:
 * @param mass mass
 * @param r radial coordinate
 * @param phi angular coordinate
*/

export class Mobile {

    private mass: number;      // Mass
    private r: number;         // Radial coordinate
    private phi: number;       // Angular coordinate


    //-------------------------Constructor-----------------------

    constructor(mass: number, r: number, phi: number) 
    {
        this.mass = mass;
        this.r = r;
        this.phi = phi;
    }

    //--------------------------Accessors------------------------

    public get_mass() { return this.mass; }

    public get_r() { return this.r; }

    public get_phi() { return this.phi; }



}