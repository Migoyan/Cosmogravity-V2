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

	/**
	 * get_id
	 * getter for id attribute
	*/
	public get_id() {
		return this.id;
	}
	
	//---------------------------methods-------------------------
	
    /** Fourth order Runge-Kutta method for second order derivatives.
     * 
     * @param n Number of computation points
	 * @param interval Array containing [xmin, xmax]
	 * @param funct function or method that define the equation to resolve, your function has to accept 3 numbers and return a number
	 * 
	 * Cauchy's conditions
	 * @param y_0 initial value of y
	 * @param yp_0 initial value of the derivative of y
     * 
     * @returns [step: number, x: number[], y:number[], yp: number[]].
    */
    public runge_kutta(step: number, funct: (x: number, y: number, yp: number) => number, x_0, y_0: number, yp_0: number )
    {
        let k_1 = funct(x_0, y_0, yp_0);
        let k_2 = funct(x_0 + step/2, y_0 + step/2 * yp_0, yp_0 + step/2 * k_1);
        let k_3 = funct(x_0 + step/2, y_0 + step/2 * yp_0 + (step**2)/4 * k_1, yp_0 + step/2 * k_2);
        let k_4 = funct(x_0 + step, y_0 + step * yp_0 + (step**2)/2 * k_2, yp_0 + step * k_3);

        let y_1 = y_0 + step * yp_0 + step**2/6 * (k_1 + k_2 + k_3);
        let yp_1 = yp_0 + step/6 * (k_1 + 2*k_2 + 2*k_3 + k_4);


        return [x, y, yp];
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