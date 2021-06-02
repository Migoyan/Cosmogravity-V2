/**
 * @class Mobile
 * 
 * This class is used to describe the different objects about which 
 * we are calculating the trajectory.
 * 
 * Attributes:
 * @param is_photon self explanatory
 * @param collidable can the object collide with others objets
 * @param mass mass
 * @param r radial coordinate
 * @param phi angular coordinate
*/

export class Mobile {


    private _is_photon: boolean;
    private _collidable: boolean;    // Can the object collide
    private _r: number;              // Radial coordinate
    private _phi: number;            // Angular coordinate


    //-------------------- Constructor- --------------------


    constructor(
        is_photon: boolean,
        collidable: boolean,
        r: number,
        phi: number
    ) {
        this._is_photon = is_photon;
        this._collidable = collidable;
        this._r = r;
        this._phi = phi;
    }


    //--------------------- Accessors ----------------------


    // Is photon?
    public get is_photon() { return this._is_photon; }

    public set is_photon(is_photon: boolean) { this._is_photon = is_photon; }


    // Collidable
    public get collidable() { return this._collidable; }

    public set collidable(collidable: boolean) { this._collidable = collidable; }


    // Coordinate r
    public get r() { return this._r; }

    public set r(r: number) { this._r = r; }


    // Coordinate phi
    public get phi() { return this._phi; }

    public set phi(phi: number) { this._phi = phi; }



}