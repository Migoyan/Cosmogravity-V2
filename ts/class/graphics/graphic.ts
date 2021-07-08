import { Simulation } from '../simulation/simulation'
/**
 * @class Graphic
 * 
 * attributes :
 * @param id_graph Identifier
 * @param simulation association between graphic and simulation
 */
export abstract class Graphic {
    readonly _id_graph: string;
    readonly _simulation: Simulation;

    //-------------------------constructor-----------------------

    constructor(id_graph: string, simulation: Simulation) {
        this._id_graph = id_graph;
        this._simulation = simulation;
    }

    //--------------------------Accessors------------------------

    // id_graph

    public get id_graph(): string {
        return this._id_graph;
    }

    // simulation

    public get simulation(): Simulation {
        return this._simulation;
    } 

    //---------------------------methods-------------------------
}