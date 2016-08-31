/**
 * Concatenation - constructor of the concatenation operation
 *
 * @param  {DFA} left  dfa on the left of the operation
 * @param  {DFA} right dfa on the right of the operation
 */
var Concatenation = function Concatenation(left, right) {
	this.left = new DFA(left.options);
	this.left.clone(left);
	this.right = new DFA(right.options);
	this.right.clone(right);
};

/**
 * Concatenation.prototype.compute - Performs the concatenation between the two dfas
 * http://math.stackexchange.com/questions/657868/combining-two-dfas-into-an-nfa-to-recognize-concatenation
 * @return {DFA}  dfa concatenated
 */
Concatenation.prototype.compute = function() {
	var startR = this.getInitialR();

	var nodes = this.left.data.nodes;
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].color != null && nodes[i].color.background == finalStateColorGlobal) {
			this.left.data.nodes[i].color.background = normalStateColorGlobal;
			this.left.insertEdge(this.left.data.nodes[i].label, startR, "$");
		}
	}

	this.compressToL();

  var nfa = new NFA_to_DFA(this.left);
  this.left = nfa.convert();

	return this.clean(this.left);
};

/**
 * Concatenation.prototype.compressToL - copy the dfa from the right to the dfa from the left
 */
Concatenation.prototype.compressToL = function() {

	//copy nodes
	var nodes = this.right.data.nodes;

	for (var i = 0; i < nodes.length; i++) {
		var info = nodes[i];

		var color = normalStateColorGlobal;
		if (info.color != null && info.color.background != null) {
			color = info.color.background;
		}
		this.left.insertNode("circle", info.id, info.label, color);
	}


	//copy edges
	var edges = this.right.data.edges;

	for (var i = 0; i < edges.length; i++) {
		var info = edges[i];

		this.left.insertEdge(info.from, info.to, info.label);
	}

};

/**
 * Concatenation.prototype.getInitialR - get initial state from the dfa of the right
 *
 * @return {type}  description
 */
Concatenation.prototype.getInitialR = function() {
	var nodes = this.right.data.nodes;

	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].shape != null && nodes[i].shape == "triangle") {
			this.right.data.nodes[i].shape = "circle";
			return nodes[i].label;
		}
	}
};

/**
 * Concatenation.prototype.clean - delete the dead state if it is not used
 *
 * @param  {DFA} retDFA dfa to be checked
 * @return {DFA}        dfa cleaned
 */
Concatenation.prototype.clean = function(retDFA) {

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
