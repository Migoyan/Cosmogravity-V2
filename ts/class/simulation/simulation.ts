/*
	Class Simulation : abstract class.
	No inheritance
*/

export abstract class Simulation {
	// attributes
	readonly id: string;

	//-------------------------constructor-----------------------

	public constructor(id: string) {
		this.id = id;
	}

	//----------------------getters & setters--------------------
	
	//---------------------------methods-------------------------
	
    /** Fourth order Runge-Kutta method for second order derivatives.
     * 
     * Argument @funct takes one of the second derivative defined in a special lib
     * depending on the type of the simulation.
     * 
     * Argument @h is the step
     * 
     * The notations are @x_0 for x(0), @yp_0 for y'(0), etc.
     * 
     * Returns a list of 2 values.
    */
    public runge_kutta(funct: (arg0: number, arg1: any, arg2: any) => any, x_0: number, y_0: number, yp_0: number, h: number)
    {
        let k_1 = funct(x_0, y_0, yp_0)
        let k_2 = funct(x_0 + h/2, y_0 + h/2 * yp_0, yp_0 + h/2 * k_1)
        let k_3 = funct(x_0 + h/2, y_0 + h/2 * yp_0 + h**2/4 * k_1, yp_0 + h/2 * k_2)
        let k_4 = funct(x_0 + h, y_0 + h * yp_0 + h**2/2 * k_2, yp_0 + h * k_3)

        let y_1 = y_0 + h * yp_0 + h**2/6 * (k_1 + k_2 + k_3)
        let yp_1 = yp_0 + h/6 * (k_1 + 2*k_2 + 2*k_3 + k_4)

        return [y_1, yp_1]
    }

    /** Simple Simpson's rule implementation.
     * 
     * Argument @funct takes one of the second derivative defined in a special lib 
     * depending on the type of the simulation.
     * 
     * Arguments @infimum and @supremum define a segment where @n is the number of points.
     * 
     * Returns a single value.
    */
    public simpson(funct: (arg0: any) => any, infimum: number, supremum: number, n: number)
    {
        let h = (supremum - infimum) / n;
        let x = [];
        let y = [];

        for (let i=0; i<=n; i++)
        {  
            x[i] = infimum + i * h;
            y[i] = funct(x[i]);
        }
        let res = 0;
        for (let i=0; i<=n; i++)
        {
            if (i==0 || i==n)   { res += y[i]; }
            else if (i%2 != 0)  { res += 4 * y[i]; }
            else                { res += 2 * y[i]; }
        }
        return res * h/3;
    }
}