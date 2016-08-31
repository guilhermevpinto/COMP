/**
 * Complement - constructor of the complement operation
 *
 * @param  {DFA} dfa dfa to be complemented
 */
var Complement = function Complement(dfa) {
	this.dfa = new DFA(dfa.options);
	this.dfa.clone(dfa);
};

/**
 * Complement.prototype.compute - performs the complement operation
 *
 * @return {DFA}  return of the DFA
 */
Complement.prototype.compute = function() {
  var nodes = this.dfa.data.nodes;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].color.background == finalStateColorGlobal) {
      nodes[i].color = {
        background: normalStateColorGlobal,
        border: normalStateColorGlobal
      }
    }
    else if (nodes[i].color.background == normalStateColorGlobal) {
      nodes[i].color = {
        background: finalStateColorGlobal,
        border: finalStateColorGlobal
      }
    }
  }
  return this.clean(this.dfa);
};

/**
 * Complement.prototype.clean - delete the dead state if it is not used
 *
 * @param  {DFA} retDFA dfa to be checked
 * @return {DFA}        dfa cleaned
 */
Complement.prototype.clean = function(retDFA) {

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
