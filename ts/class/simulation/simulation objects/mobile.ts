
export class Mobile {

    id: string;
    private mass: number;       //Mass
    private r: number;          //Coordinate

    constructor(id: string, mass: number, r: number) {
        this.id = id;
        this.mass = mass;
        this.r = r;
    }

    public get_mass() { return this.mass; }

    public get_radius() { return this.r; }



}