import {c,G} from "./../../../constants.js";
/**
 * @class Mobile
 * 
 * This class is used to describe the different objects about which 
 * we are calculating the trajectory.
 * 
 * @param id
 * @param is_photon
 * @param r
 * @param phi
 * @param v_r
 * @param v_phi
 * @param v_norm
 * @param v_alpha
 * @param U_r
 * @param U_phi
 * @param L
 * @param E
 * @param dtau
 * @param clock_a
 * @param clock_do
*/

export class Mobile
{

    private _id: string;
    private _is_photon: boolean;
    private _r: number;             // Radial coordinate
    private _phi: number;           // Angular coordinate
    private _v_r: number;           // Physical speed radial component
    private _v_phi: number;         // Physical speed tangential component
    private _v_norm: number         // Physical speed norm
    private _v_alpha: number;       // Physical speed starting angle
    private _U_r: number;           // dr
    private _U_phi: number;         // dphi
    private _dtau: number;          // dtau

    // time in the reference frame where the mobile is motionless
    private _clock_a: number;
    // time in the reference frame of a distant observer
    private _clock_do: number;

    /* Integration constants, each simulation_trajectory child classes
    have a method to set the proper value for these constants.
    These constants depends on the type of the simulation and
    the initial conditions. */
    private _L: number;
    private _E: number;


    //-------------------- Constructor ---------------------


    constructor(
        id: string,
        is_photon: boolean,
        r: number,
        phi: number,
        v_r: number,
        v_alpha: number
    ) {
        this._id = id;
        this._is_photon = is_photon;
        this._r = r;
        this._phi = phi * Math.PI/180;
        this._L = 0;
        this._E = 0;
        this._v_r = v_r;
        this._v_alpha = v_alpha * Math.PI/180;
        this._v_phi = v_r * Math.sin(this.v_alpha);
        this._v_norm = (v_r**2 + this.v_phi**2)**.5
        this._clock_a = 0;
        this._clock_do = 0;

        if (is_photon) { this._v_r = c; this._v_norm = c; }
    }


    //--------------------- Accessors ----------------------


    // Id
    public get id() { return this._id; }

    public set id(id: string) { this._id = id; }


    // Is photon?
    public get is_photon() { return this._is_photon; }

    public set is_photon(is_photon: boolean)
    {
        this._is_photon = is_photon;
    }
    

    // Coordinate r
    public get r() { return this._r; }

    public set r(r: number) { this._r = r; }


    // Coordinate phi
    public get phi() { return this._phi; }

    public set phi(phi: number) { this._phi = phi; }


    // Physical velocity radius
    public get v_r() { return this._v_r; }

    public set v_r(v_r: number) { this._v_r = v_r; }


    // Physical speed tangential
    public get v_phi() { return this._v_phi; }

    public set v_phi(v_phi: number) { this._v_phi = v_phi; }

    
    // Physical velocity starting angle
    public get v_alpha() { return this._v_alpha; }

    public set v_alpha(v_alpha: number) { this._v_alpha = v_alpha; }


    // Physical velocity norm
    public get v_norm() { return this._v_norm; }

    public set v_norm(v_norm: number) { this._v_norm = v_norm; }


    // dr 
    public get U_r() { return this._U_r; }

    public set U_r(U_r: number) { this._U_r = U_r; }


    // dphi
    public get U_phi() { return this._U_phi; }

    public set U_phi(U_phi: number) { this._U_phi = U_phi; }


    // Integration constants
    public get L() { return this._L; }
 
    public set L(L: number) { this._L = L; }


    public get E() { return this._E; }

    public set E(E: number) { this._E = E; }


    // dtau
    public get dtau() { return this._dtau; }

    public set dtau(dtau: number) { this._dtau = dtau; }


    // proper time
    public get clock_a() { return this._clock_a; }

    public set clock_a(clock_a: number)
    { 
        this._clock_a = clock_a;
    }


    // time distant observer
    public get clock_do() { return this._clock_do; }

    public set clock_do(clock_do: number) { this._clock_do = clock_do; }

}