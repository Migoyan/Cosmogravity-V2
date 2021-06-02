import { Simulation } from "./simulation";
import { Central_body } from "./simulation objects/central_body";
import { Mobile } from "./simulation objects/mobile";

/**
 * @class Simulation_trajectory
 * inheritance from Simulation class
 * 
 * Attributes:
 * @param central_body
 * @param mobile_list
 * @param c
 * @param G
 * 
 * Methods:
 * @method add_mobile 
 */

export abstract class Simulation_trajectory extends Simulation {


	private _central_body: Central_body;
	private _mobile_list: Mobile[];
	// Allows the possibility to modify the constants
	private _c: number = c;
	private _G: number = G;


	//-------------------- Constructors --------------------


	constructor(id: string, collidable: boolean, mass: number, radius: number, angular_m: number)
	{
		super(id);
		this._central_body = new Central_body(collidable, mass, radius, angular_m);
		this._mobile_list = [];
	}


	//--------------------- Accessors ----------------------


	// Central body
	public get central_body() { return this._central_body; }


	// Mobiles
	public get mobile_list() { return this._mobile_list; }


	// Constants
	public get c() { return this._c; }

	public set c(c: number) { this._c = c; }


	public get G() { return this._G; }

	public set G(G: number) { this._G = G; }


	//---------------------- Methods -----------------------


	/**
	 * Add a new mobile object to the simulation
	 * @param mobile new mobile
	 */
	public add_mobile(mobile: Mobile) { this.mobile_list.push(mobile); }


	/**
     * Fourth order Runge-Kutta method for second order derivatives for trajectory computation.
     *
     * @param step step of computation
     * @param x_0 x_point where the calcul start
     * @param y_0 initial value of y at x_0
     * @param dy_0 initial value of the derivative of y at x_0
     * @param interval array containing [ymin, ymax]
     * @param funct function or method that define the equation to resolve, your function has to accept 3 numbers and return a number
     *
     * @returns [step: number, x: number[], y:number[], yp: number[]].
     */
	private runge_kutta_trajectory_2(
    	step: number,
    	x_0: number = 0,
    	y_0: number = 1,
    	dy_0: number = 1,
    	funct: (Simu: Simulation_trajectory, x: number, y: number, dy: number) => number,
    	interval: number[]
	) {
		// Init parameter
    	let x: number[] = [x_0];
    	let y: number[] = [y_0];
    	let dy: number[] = [dy_0];

		// Computation loops
		// Computing with a positive step, i increments the array
    	let i = 0;
    	let result_runge_kutta: number[];
		while (interval[0] <= y[i] && y[i] < interval[1])
		{
			result_runge_kutta = this.runge_kutta_equation_order2(
            	this,
            	step,
            	x[i],
            	y[i],
            	dy[i],
            	funct
			);
			x.push(result_runge_kutta[0]);
			y.push(result_runge_kutta[1]);
			dy.push(result_runge_kutta[2]);
		}
	}

}