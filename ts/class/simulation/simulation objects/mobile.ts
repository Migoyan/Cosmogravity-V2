
export class Mobile {

    id: string;
    readonly mass: number;       //Mass
    readonly r: number;          //Coordinate


    //-------------------------constructor-----------------------

    constructor(id: string, mass: number, r: number) 
    {
        this.id = id;
        this.mass = mass;
        this.r = r;
    }

    //--------------------------Accessors------------------------

    public get_mass() { return this.mass; }

    public get_radius() { return this.r; }



}