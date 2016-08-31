/**
 * Multiplication - constructor of the multiplication operation
 *
 * @param  {DFA} dfa dfa to be multiplicated
 */
var Multiplication = function Multiplication(left, right) {
	this.left = new DFA(left.options);
	this.left.clone(left);
	this.right = new DFA(right.options);
	this.right.clone(right);
};

/**
 * Multiplication.prototype.compute - performs the multiplication operation
 */
Multiplication.prototype.compute = function(){
  var crossOperation = new CrossProduct(this.left, this.right);
  return this.clean(crossOperation.execute());
};

/**
 * Multiplication.prototype.clean - delete the dead state if it is not used
 *
 * @param  {DFA} retDFA dfa to be checked
 * @return {DFA}        dfa cleaned
 */
Multiplication.prototype.clean = function(retDFA) {
	if(retDFA == null) return null;

	for (var i = 0; i < retDFA.data.nodes.length; i++) {
		if (retDFA.data.nodes[i].shape == "triangle") {
			continue;
		}
		var found = false;
		for (var j = 0; j < retDFA.data.edges.length && !found; j++) {
			if (retDFA.data.edges[j].from != retDFA.data.nodes[i].label && retDFA.data.edges[j].to == retDFA.data.nodes[i].label) {
					found = true;
			}
		}

		if (found) {
			continue;
		}

		for (var j = 0; j < retDFA.data.edges.length; j++) {
			if (retDFA.data.edges[j].from == retDFA.data.nodes[i].label) {
					retDFA.data.edges.splice(j, 1);
					j--;
			}
		}

		retDFA.data.nodes.splice(i, 1);
		i--;
	}

	return retDFA;
};
