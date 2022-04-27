import {c,G} from "./../../../constants.js";

/**
 * @class Central_body
 * 
 * This class is used to describe the central mass of a system
 * in trajectory simulations.
 * 
 * @param collidable
 * @param mass
 * @param radius
 * @param angular_m
 * @param R_s
 * @param a
 * @param R_hp
 * @param R_hm
 * 
 * @method update_parameters
 */

export class Central_body
{

    private _collidable: boolean;   // Can the object collide
    private _mass: number;          // Mass
    private _radius: number;        // Radius
    private _angular_m: number;     // Angular momentum (J)
    private _R_s: number;           // Schwarzschild radius
    private _a: number;             // Calculated parameter a=J/cM
    private _R_hp: number;          // See Kerr metric theory
    private _R_hm: number;          // See Kerr metric theory
 

    //-------------------- Constructor ---------------------


    constructor(
        collidable: boolean,
        mass: number,
        radius: number,
        angular_m?: number
    ) {
        this._collidable = collidable;
        this._mass = mass;
        this._R_s = 2*G*this._mass / c**2;
        
        /* If the radius of a body is smaller than its Schwarzschild radius,
        it becomes a black hole and therefore a singularity in the framework
        of general relativity. */
        
        if (radius <= this._R_s) { this._radius = 0; }
        else { this._radius = radius; }
        
        /* If the angular momentum is not null, the Kerr metric is used and it
        needs new calculated parameters. */

        if (angular_m === undefined || angular_m === 0)
        {
            this._angular_m = 0;
            this._a = 0;
            this._R_hp = this._R_s;
            this._R_hm = 0;
        }
        else
        {
            this._angular_m = angular_m;
            this._a = this._angular_m / (c * this._mass);
            this._R_hp = (this._R_s
                + Math.sqrt(this._R_s**2 - 4 * this._a**2)) / 2;
            this._R_hm = (this._R_s
                - Math.sqrt(this._R_s**2 - 4 * this._a**2)) / 2;
        }
    }


    //--------------------- Accessors ----------------------


    // Collidable
    public get collidable() { return this._collidable; }

    public set collidable(collidable: boolean)
    {
        this._collidable = collidable;
    }


    // Mass
    public get mass() { return this._mass; }

    public set mass(mass: number) { this._mass = mass; }


    // Radius
    public get radius() { return this._radius; }
    
    public set radius(radius: number)
    {
        if (radius <= this._R_s) { this._radius = 0; }
        else { this._radius = radius; }
    }


    // Angular momentum
    public get angular_m() { return this._angular_m; }

    public set angular_m(angular_m: number)
    {
        this._angular_m = angular_m;
    }


    // Schwarzschild radius
    public get R_s() { return this._R_s; }

    public set R_s(R_s: number) { this._R_s = R_s; }


    // Parameter a
    public get a() { return this._a; }

    public set a(a: number) { this._a = a; }


    // R_hp
    public get R_hp() { return this._R_hp; }

    public set R_hp(R_hp: number) { this._R_hp = R_hp; }


    // R_hm
    public get R_hm() { return this._R_hm; }

    public set R_hm(R_hm: number) { this._R_hm = R_hm; }


    //---------------------- Methods -----------------------


    /**
     * Allows updating all the calculated parameters of a central body
     * if one of the primordial parameters is modified.
     */
    public update_parameters(): void
    {
        this._R_s = 2*G*this._mass / c**2;

        if (this._angular_m === 0)
        {
            this._a = 0;
            this._R_hp = this._R_s;
            this._R_hm = 0;
        }
        else
        {
            this._a = this._angular_m / (c * this._mass);
            this._R_hp = (this._R_s
                + Math.sqrt(this._R_s**2 - 4 * this._a**2)) / 2;
            this._R_hm = (this._R_s
                - Math.sqrt(this._R_s**2 - 4 * this._a**2)) / 2;
        }
    }


}