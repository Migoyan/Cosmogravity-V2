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
 * @method runge_kutta_trajectory_2
 */

export abstract class Simulation_trajectory extends Simulation {


	private _central_body: Central_body;
	private _mobile_list: Mobile[];
	// Allows the possibility to modify the constants
	private _c: number = c;
	private _G: number = G;


	//-------------------- Constructors --------------------


	constructor(
		id: string,
		collidable: boolean,
		mass: number,
		radius: number,
		angular_m: number
	) {
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
	public add_mobile(mobile: Mobile): void { this.mobile_list.push(mobile); }


	public main_trajectoire(
		type: "ESM" | "ISM" | "KM",
		mobile_type: "MP" | "PH",
		reference_frame: "A" | "DO",
		step: number,
		x: number,
		y: number,
		dy: number
	) {
		
	}

	
}