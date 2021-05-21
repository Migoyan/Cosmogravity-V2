import { Simulation } from "./simulation";
import { Central_body } from "./simulation objects/central_body";
import { Mobile } from "./simulation objects/mobile";

/**
 * @class Simulation_trajectory
 * inheritance from Simulation class
 */

export abstract class Simulation_trajectory extends Simulation {


	private central_body: Central_body;
	private mobile_list: Mobile[];
	// Allows the possibility to modify the constants
	private c: number = c;
	private G: number = G;


	//-------------------- Constructors --------------------


	constructor(id: string, collidable: boolean, mass: number, radius: number, angular_m: number)
	{
		super(id);
		this.central_body = new Central_body(collidable, mass, radius, angular_m);
		this.mobile_list = [];
	}


	//--------------------- Accessors ----------------------


	// Central body
	public get_central_body() { return this.central_body; }


	// Mobiles
	public get_mobile_list() { return this.mobile_list; }


	// Constants
	public get_c() { return this.c; }

	public set_c(c: number) { this.c = c; }


	public get_G() { return this.G; }

	public set_G(G: number) { this.G = G; }


	//---------------------- Methods -----------------------


	public add_mobile() {}


}