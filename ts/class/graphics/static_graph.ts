import Plotly = require('../../lib/plotly.js/index.js');
import { Simulation } from '../simulation/simulation'
import { Graphic } from './graphic';
/**
 * This is one of the two inherited class from Graphic.
 * It shouldn't be used for dynamic graphic representation.
 */
export class Static_graph extends Graphic {
    
    private _plotly_parameters= {
        id: "",
        data: [],
        layout: {}
    };

    //-------------------------constructor-----------------------
    constructor(id_graph: string, simulation: Simulation)
    {
        super(id_graph, simulation);
    }
    //--------------------------Accessors------------------------
    
    /**
     * 
     */
    public get plotly_parameters() {
        return this._plotly_parameters;
    }

    //---------------------------methods-------------------------
	//                      redefined methods

	//                         new methods

    
    public modify_plotly_parameters(id: string, data: object[], layout: object): void {
        this._plotly_parameters.id = id;
        this._plotly_parameters.data = data;
        this._plotly_parameters.layout = layout;
    }

    public save(format: any, width: number = 800, height: number = 600): void {
        let options = {
            format: format,
            width: width,
            height: height
        };
        Plotly.toImage(this.plotly_parameters.id, options)
    }
}