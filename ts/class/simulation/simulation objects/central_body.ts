
export class Central_body {

    id: string;
    readonly mass: number;       //Mass
    readonly radius: number;     //Radius
    readonly R_s: number;        //Schwarzschild radius
    private angular_v: number;  // Angular velocity 

    constructor(id: string, mass: number, radius: number) {
        this.id = id;
        this.mass = mass;
        this.radius = radius;
        this.R_s = 2*G*mass / (c**2);
    }

    public get_mass() { return this.mass; }

    public get_radius() { return this.radius; }

    public get_radius_s() { return this.R_s; }

    public get_angular_v() { return this.angular_v; }


}