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


    private collidable: boolean;    // Can the object collide
    private mass: number;           // Mass
    private radius: number;         // Radius
    private angular_m: number;      // Angular momentum (J)
 

    //-------------------- Constructors --------------------


    constructor(collidable: boolean, mass: number, radius: number, angular_m?: number) 
    {
        this.collidable = collidable;
        this.mass = mass;
        this.radius = radius;
        if ( angular_m === undefined) { this.angular_m = 0; }
        else { this.angular_m = angular_m; }
    }


    //--------------------- Accessors ----------------------


    // Collidable
    public get_collidable() { return this.collidable; }


    // Mass
    public get_mass() { return this.mass; }


    // Radius
    public get_radius() { return this.radius; }


    // Angular momentum
    public get_angular_m() { return this.angular_m; }


    //---------------------- Methods -----------------------


    // Schwarzschild Radius
    public calculate_R_s() { return 2*G*this.mass / c**2; }


    // Calculated parameter a=J/cM
    public calculate_a()
    {
        if (this.angular_m == undefined) { return 0; }
        else { return this.angular_m / (c * this.mass); }
    }


    // R_h+
    public calculate_R_hp(R_s: number, a: number)
    {
        if (this.angular_m == undefined) { return R_s; }
        else { return (R_s + Math.sqrt(R_s**2 - 4 * a**2)) / 2; }
    }


    // R_h-
    public calculate_R_hm(R_s: number, a: number)
    {
        if (this.angular_m == undefined) { return 0; }
        else { return (R_s - Math.sqrt(R_s**2 - 4 * a**2)) / 2; }
    }


}