/**
 * @class Simulation : abstract class.
 * No inheritance
 */
export class Simulation {
    //-------------------- Constructors --------------------
    constructor(id) {
        this.id = id;
    }
    //--------------------- Accessors ----------------------
    get_id() {
        return this.id;
    }
    //---------------------- Methods -----------------------
    /**
     * Fourth order Runge-Kutta method for first order derivatives.
     *
     * @param step The step of computation
     * @param x_0,
     * @param y_0 initial value of y
     * @param funct function or method that define the equation to resolve
     *
     * @returns [x_1, y_1], value of the next point of computation
     */
    runge_kutta_equation_order1(Simu, step, x_0, y_0, funct) {
        let k_1 = funct(Simu, x_0, y_0);
        let k_2 = funct(Simu, x_0 + step / 2, y_0 + step / 2 * k_1);
        let k_3 = funct(Simu, x_0 + step / 2, y_0 + step / 2 * k_2);
        let k_4 = funct(Simu, x_0 + step, y_0 + step * k_3);
        let x_1 = x_0 + step;
        let y_1 = y_0 + step * ((1 / 6) * k_1 + (1 / 3) * k_2 + (1 / 3) * k_3 + (1 / 6) * k_4);
        return [x_1, y_1];
    }
    /**
     * Fourth order Runge-Kutta method for second order derivatives.
     *
     * @param step The step of computation
     * @param x_0,
     * @param y_0 initial value of y
     * @param dy_0 initial value of the derivative of y
     * @param funct function or method that define the equation to resolve
     *
     * @returns [x_1, y_1, yp_1], value of the next point of computation
     */
    runge_kutta_equation_order2(Simu, step, x_0, y_0, dy_0, funct) {
        let k_1 = funct(Simu, x_0, y_0, dy_0);
        let k_2 = funct(Simu, x_0 + step / 2, y_0 + step / 2 * dy_0, dy_0 + step / 2 * k_1);
        let k_3 = funct(Simu, x_0 + step / 2, y_0 + step / 2 * dy_0 + step ** 2 / 4 * k_1, dy_0 + step / 2 * k_2);
        let k_4 = funct(Simu, x_0 + step, y_0 + step * dy_0 + step ** 2 / 2 * k_2, dy_0 + step * k_3);
        let x_1 = x_0 + step;
        let y_1 = y_0 + step * dy_0 + step ** 2 / 6 * (k_1 + k_2 + k_3);
        let dy_1 = dy_0 + step / 6 * (k_1 + 2 * k_2 + 2 * k_3 + k_4);
        return [x_1, y_1, dy_1];
    }
    /**
     * Simple Simpson's rule implementation.
     *
     * @param funct function to integrate
     * @param infimum
     * @param supremum
     * @param n is the number of computation points.
     *
     * @returns value of the integral.
     */
    simpson(Simu, funct, infimum, supremum, n) {
        let step = (supremum - infimum) / n;
        let x = [];
        let y = [];
        for (let i = 0; i < n; i++) {
            x[i] = infimum + i * step;
            y[i] = funct(Simu, x[i]);
        }
        let res = 0;
        for (let i = 0; i < n; i++) {
            if (i == 0 || i == n) {
                res += y[i];
            }
            else if (i % 2 != 0) {
                res += 4 * y[i];
            }
            else {
                res += 2 * y[i];
            }
        }
        return res * step / 3;
    }
}
