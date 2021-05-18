
export class Central_body {

    id: string;
    private mass: number;       // Mass
    private radius: number;     // Radius
    private R_s: number;        // Schwarzschild radius
    private angular_m: number;  // Angular momentum (J)
    private a: number;          // a=J/cM is used in many calculations
    private R_hp: number;       // R_h+, see Kerr metric theory
    private R_hm: number;       // R_h-


//-------------------------constructor-----------------------

    constructor(id: string, mass: number, radius: number, angular_m?: number) 
    {
        this.id = id;
        this.mass = mass;
        this.radius = radius;
        this.R_s = 2*G*mass / (c**2);

        if (angular_m == undefined)
        {
            this.angular_m = 0;
            this.a = 0;
            this.R_hp = this.R_s;
            this.R_hm = 0;
        }
        else
        {
            this.angular_m = angular_m;
            this.a = this.angular_m / (c * this.mass);
            this.R_hp = (this.R_s + Math.sqrt(this.R_s**2 - 4 * this.a**2)) / 2;
            this.R_hm = (this.R_s - Math.sqrt(this.R_s**2 - 4 * this.a**2)) / 2;
        }
    }


//--------------------------Accessors------------------------

    public get_mass() { return this.mass; }

    public get_radius() { return this.radius; }

    public get_radius_s() { return this.R_s; }

    public get_angular_m() { return this.angular_m; }

    public get_a() { return this.a; }

    public get_R_hp() { return this.R_hp; }

    public get_R_hm() { return this.R_hm; }


}