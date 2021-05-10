/*
Class simulation : abstract class.
No inheritance
*/

abstract class Simulation {
    // attributes
    readonly id: string;

    // Constructor

    public constructor(id: string) {
        this.id = id;
    }

    

    // methods
    runge_kutta(fonction, order, domain, x_init, y_init, h){
        /* fonction  */

    }
}

export { Simulation }