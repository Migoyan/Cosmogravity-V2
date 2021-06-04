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
 * @param L
 * @param E
 */

export class Mobile
{

    private _is_photon: boolean;
    private _collidable: boolean;   // Can the object collide
    private _r: number;             // Radial coordinate
    private _phi: number;           // Angular coordinate
    private _U_r: number;           // Velocity's radial coordinate
    private _U_phi: number;         // Velocity's angular coordinate

    /* Integration constants, each simulation_trajectory child classes have
    a method to set the proper value for these constants. These constants depends
    on the type of the simulation and the initial conditions. */
    private _L: number;
    private _E: number;


    //-------------------- Constructor ---------------------


    constructor(
        is_photon: boolean,
        collidable: boolean,
        r: number,
        phi: number,
        U_r?: number,
        U_phi?: number
    ) {
        this._is_photon = is_photon;
        this._collidable = collidable;
        this._r = r;
        this._phi = phi;
        this._L = 0;
        this._E = 0;

        if (U_r === undefined && U_phi === undefined)
        {
            this._U_r = 0;
            this._U_phi = 0;
        }
        else
        {
            this._U_r = U_r;
            this._U_phi = U_phi;
        }
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


    // Integration constants
    public get L() { return this._L; }

    public set L(L: number) { this._L = L; }


    public get E() { return this._E; }

    public set E(E: number) { this._E = E; }


}