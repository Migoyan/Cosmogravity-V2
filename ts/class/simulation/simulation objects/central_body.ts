/**
 * @class Central_body
 * 
 * This class is used to describe the central mass of a system in trajectory simulations.
 * 
 * Attributes:
 * @param collidable determines if the object can collide with other objets
 * @param mass mass
 * @param radius radius
 * @param angular_m angular momentum (J)
 */

export class Central_body {


    private _collidable: boolean;    // Can the object collide
    private _mass: number;           // Mass
    private _radius: number;         // Radius
    private _angular_m: number;      // Angular momentum (J)
 

    //-------------------- Constructors --------------------


    constructor(
        collidable: boolean,
        mass: number,
        radius: number,
        angular_m?: number
    ) {
        this._collidable = collidable;
        this._mass = mass;
        this._radius = radius;
        if ( angular_m === undefined) { this._angular_m = 0; }
        else { this._angular_m = angular_m; }
    }


    //--------------------- Accessors ----------------------


    // Collidable
    public get collidable() { return this._collidable; }


    // Mass
    public get mass() { return this._mass; }


    // Radius
    public get radius() { return this._radius; }


    // Angular momentum
    public get angular_m() { return this._angular_m; }


    //---------------------- Methods -----------------------


    // Schwarzschild Radius
    public calculate_R_s(): number { return 2*G*this.mass / c**2; }


    // Calculated parameter a=J/cM
    public calculate_a(): number
    {
        if (this._angular_m == undefined) { return 0; }
        else { return this._angular_m / (c * this._mass); }
    }


    // R_h+
    public calculate_R_hp(R_s: number, a: number): number
    {
        if (this._angular_m == undefined) { return R_s; }
        else { return (R_s + Math.sqrt(R_s**2 - 4 * a**2)) / 2; }
    }


    // R_h-
    public calculate_R_hm(R_s: number, a: number): number
    {
        if (this._angular_m == undefined) { return 0; }
        else { return (R_s - Math.sqrt(R_s**2 - 4 * a**2)) / 2; }
    }


}