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
     * @param step The step of computation
	 * @param interval Array containing [xmin, xmax]
	 * @param funct function or method that define the equation to resolve, your function has to accept 3 numbers and return a number
	 * 
	 * Cauchy's conditions
	 * @param y_0 initial value of y
	 * @param yp_0 initial value of the derivative of y
     * 
     * @returns [step: number, x: number[], y:number[], yp: number[]].
    */
    public runge_kutta(step: number, interval: number[], is_interval_y: boolean = false, funct: (x: number, y: number, yp: number) => number, y_0: number, yp_0: number )
    {
		// Init parameter
		let x: number[];
		let y: number[];
		let yp: number[];
		if (is_interval_y) {
			x = [0];
			y = [y_0];
			yp = [yp_0];
		} else {
			x = [interval[0]];
			y = [y_0];
			yp = [yp_0];
		}

		// Calculation loop

		for (let i = 0; i < x.length; i++) {
			let k_1 = funct(x[i], y[i], yp[i]);
			let k_2 = funct(x[i] + step/2, y[i] + step/2 * yp[i], yp[i] + step/2 * k_1);
			let k_3 = funct(x[i] + step/2, y[i] + step/2 * yp[i] + step**2/4 * k_1, yp[i] + step/2 * k_2);
			let k_4 = funct(x[i] + step, y[i] + step * yp[i] + step**2/2 * k_2, yp[i] + step * k_3);

			y.push(y[i] + step * yp[i] + step**2/6 * (k_1 + k_2 + k_3));
			yp.push(yp[i] + step/6 * (k_1 + 2*k_2 + 2*k_3 + k_4));
		}

        return [step, x, y, yp];
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