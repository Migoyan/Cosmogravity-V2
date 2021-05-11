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

    

    /** Fourth order Runge-Kutta method.
     * 
     * Argument @derivative takes one of the second derivative defined in a special lib
     * depending on the type of the simulation.
     * 
     * Argument @h is the step
     * 
     * Returns a list of 2 values.
    */
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

    /** Simple Simpson's rule implementation.
     * 
     * Argument @derivative takes one of the second derivative defined in a special lib 
     * depending on the type of the simulation.
     * 
     * Arguments @infimum and @supremum define a segment where @n is the number of points.
     * 
     * Returns a single value.
     */
    public simpson(derivative, infimum: number, supremum: number, n: number)
    {
        let h = (supremum - infimum) / n;
        let x = [];
        let y = [];

        for (let i=0; i<=n; i++)
        {  
            x[i] = infimum + i * h;
            y[i] = derivative(x[i]);
        }
        let res = 0;
        for (let i=0; i<=n; i++)
        {
            if (i==0 || i==n)   { res += y[i]; }
            else if (i%2 != 0)  { res += 4 * y[i]; }
            else                { res += 2 * y[i]; }
        }
        res = res * (h / 3);
        return res;
    }
}