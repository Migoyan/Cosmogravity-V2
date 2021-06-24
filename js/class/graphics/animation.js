import { Graphic } from './graphic';
/**
 * This is one of the two inherited class from Graphic.
 * It shouldn't be used for static graphic representation.
 *
 * @method draw
 */
class Animation extends Graphic {
    //-------------------- Constructor --------------------
    constructor(id_graph, simulation) {
        super(id_graph, simulation);
    }
    //---------------------- Methods -----------------------
    draw() { }
}
