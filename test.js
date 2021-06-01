let num_array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let result = {x: num_array};
for (let index = 0; index < result.x.length; index++) {
	result.x[index] = result.x[index] - 1;
}
console.log(num_array);
console.log(result);