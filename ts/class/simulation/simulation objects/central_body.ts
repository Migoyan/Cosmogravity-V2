/**
 * @class Central_body
 * 
 * This class is used to describe the central mass of a system in trajectory simulations.
 * 
 * @param collidable
 * @param mass
 * @param radius
 * @param angular_m
 * 
 * @method calculate_a
 * @method calculate_R_s
 * @method calculate_R_hp
 * @method calculate_R_hm
 */

export class Central_body
{

    private _collidable: boolean;    // Can the object collide
    private _mass: number;           // Mass
    private _radius: number;         // Radius
    private _angular_m: number;      // Angular momentum (J)
 

    //-------------------- Constructor ---------------------


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

    public set collidable(collidable: boolean) { this._collidable = collidable; }


    // Mass
    public get mass() { return this._mass; }

    public set mass(mass: number) { this._mass = mass; }


    // Radius
    public get radius() { return this._radius; }
    
    public set radius(radius: number)
    {
        /* If the radius of a body is smaller than its Schwarzschild radius,
        it becomes a Black Hole and therefore a singularity. */
        if (radius <= this.calculate_R_s())
        {
            this._radius = 0;
        }
        else
        {
            this._radius = radius;
        }
    }


    // Angular momentum
    public get angular_m() { return this._angular_m; }

    public set angular_m(angular_m: number) { this._angular_m = angular_m; }


    //---------------------- Methods -----------------------


    /**
     * 
     * @returns Calculated parameter a=J/cM
     */
    public calculate_a(): number
    {
        if (this._angular_m == undefined) { return 0; }
        else { return this._angular_m / (c * this._mass); }
    }


    /**
     * 
     * @returns Schwarzschild Radius
     */
    public calculate_R_s(): number { return 2*G*this.mass / c**2; }


    /**
     * 
     * @param R_s 
     * @param a 
     * 
     * @returns R_h+
     */
    public calculate_R_hp(R_s: number, a: number): number
    {
        if (this._angular_m == undefined) { return R_s; }
        else { return (R_s + Math.sqrt(R_s**2 - 4 * a**2)) / 2; }
    }


    /**
     * 
     * @param R_s 
     * @param a 
     * 
     * @returns R_h-
     */
    public calculate_R_hm(R_s: number, a: number): number
    {
        if (this._angular_m == undefined) { return 0; }
        else { return (R_s - Math.sqrt(R_s**2 - 4 * a**2)) / 2; }
    }


}