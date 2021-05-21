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


    private is_photon: boolean;
    private collidable: boolean;    // Can the object collide
    private r: number;              // Radial coordinate
    private phi: number;            // Angular coordinate


    //-------------------- Constructor- --------------------


    constructor(is_photon: boolean, collidable: boolean, r: number, phi: number) 
    {
        this.is_photon = is_photon;
        this.collidable = collidable;
        this.r = r;
        this.phi = phi;
    }


    //--------------------- Accessors ----------------------


    public get_is_photon() { return this.is_photon; }

    public set_is_photon(is_photon: boolean) { this.is_photon = is_photon; }


    public get_collidable() { return this.collidable; }

    public set_collidable(collidable: boolean) { this.collidable = collidable; }


    public get_r() { return this.r; }

    public set_r(r: number) { this.r = r; }


    public get_phi() { return this.phi; }

    public set_phi(phi: number) { this.phi = phi; }



}