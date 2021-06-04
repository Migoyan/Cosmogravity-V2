/**
 * @class Mobile
 * 
 * This class is used to describe the different objects about which 
 * we are calculating the trajectory.
 * 
 * @param is_photon
 * @param collidable
 * @param mass
 * @param r
 * @param phi
 * @param U_r
 * @param U_phi
*/

export class Mobile
{

    private _is_photon: boolean;
    private _collidable: boolean;   // Can the object collide
    private _r: number;             // Radial coordinate
    private _phi: number;           // Angular coordinate
    private _U_r: number;           // Velocity's radial coordinate
    private _U_phi: number;         // Velocity's angular coordinate


    //-------------------- Constructor ---------------------


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


    // Velocity U_r
    public get U_r() { return this._U_r; }

    public set U_r(U_r: number) { this._U_r = U_r; }


    // Velocity U_phi
    public get U_phi() { return this._U_phi; }

    public set U_phi(U_phi: number) { this._U_phi = U_phi; }





}