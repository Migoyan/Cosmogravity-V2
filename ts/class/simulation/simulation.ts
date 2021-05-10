/*
Class Simulation : abstract class.
No inheritance
*/

export abstract class Simulation {
    // attributes
    readonly id: string;

    // Constructor

    public constructor(id: string) {
        this.id = id;
    }

    

    //Fourth order Runge-Kutta method.
    public runge_kutta(derivative: (arg0: number, arg1: number) => any, x_0: number, y_0: number, h: number)
    {
        let k_0 = derivative(x_0, y_0)
        let k_1 = derivative(x_0 + h/2, y_0 + h/2 * k_0)
        let k_2 = derivative(x_0 + h/2, y_0 + h/2 * k_1)
        let k_3 = derivative(x_0 + h, y_0 + h * k_2)

        let k = 1/6 * (k_0 + 2.0 * k_1 + 2.0 * k_2 + k_3)

        let x_1 = x_0 + h
        let y_1 = y_0 + h * k

        return [x_1, y_1]
    }
}