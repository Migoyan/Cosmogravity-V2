"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* This is one of the two inherited class from Graphic.
* It shouldn't be used for static graphic representation.
*/
const graphic_1 = require("./graphic");
class Animation extends graphic_1.Graphic {
    constructor(id_graph, simulation) {
        super(id_graph, simulation);
    }
    draw() { }
}
//# sourceMappingURL=animation.js.map