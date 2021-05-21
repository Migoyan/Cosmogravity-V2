/**
 * @class Mobile
 * 
 * This class is used to describe the different objects about which 
 * we are calculating the trajectory.
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


    //-------------------- Constructor- --------------------


    constructor(mass: number, r: number, phi: number) 
    {
        this.mass = mass;
        this.r = r;
        this.phi = phi;
    }


    //--------------------- Accessors ----------------------


    public get_mass() { return this.mass; }

    public set_mass(mass: number) { this.mass = mass; }

    public get_r() { return this.r; }

    public set_r(r: number) { this.r = r; }

    public get_phi() { return this.phi; }

    public set_phi(phi: number) { this.phi = phi; }



}