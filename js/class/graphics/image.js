"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class closely related to the Graphic class and subclasses.
 * An instance of this class is created via their save method.
 *
 */
class Image {
    constructor(graphe, name, format, adress) {
        this.graphic = graphe;
        this.name = name;
        this.format = format;
        this.adress = adress;
    }
}
