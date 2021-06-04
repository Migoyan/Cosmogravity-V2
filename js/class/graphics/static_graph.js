"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Static_graph = void 0;
const Plotly = require("plotly.js");
const graphic_1 = require("./graphic");
/**
 * This is one of the two inherited class from Graphic.
 * It shouldn't be used for dynamic graphic representation.
 */
class Static_graph extends graphic_1.Graphic {
    //-------------------------constructor-----------------------
    constructor(id_graph, simulation) {
        super(id_graph, simulation);
        this._plotly_parameters = {
            id: "",
            data: [{}],
            layout: {}
        };
    }
    //--------------------------Accessors------------------------
    get plotly_parameters() {
        return this._plotly_parameters;
    }
    //---------------------------methods-------------------------
    //                      redefined methods
    //                         new methods
    modify_plotly_parameters(id, data, layout) {
        this._plotly_parameters.id = id;
        this._plotly_parameters.data = data;
        this._plotly_parameters.layout = layout;
    }
    /**
     * Save the graph into an image
     * @param format
     * @param width
     * @param height
     */
    save(format, width = 800, height = 600) {
        let options = {
            format: format,
            width: width,
            height: height
        };
        Plotly.toImage(this.plotly_parameters.id, options);
    }
    /**
     *
     */
    plot_graph() {
    }
}
exports.Static_graph = Static_graph;
