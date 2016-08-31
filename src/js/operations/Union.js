var Union = function Union(left, right) {
    this.left = new DFA(left.options);
    this.left.clone(left);
    this.right = new DFA(right.options);
    this.right.clone(right);
  var crossOperation = new CrossProduct(this.left, this.right);
  this.crossResult = crossOperation.execute();
};

//This method automatically determines if a state is final. a state is final if it contains a reference to an id of a node that was a final state on the previous FA
Union.prototype.compute = function () {
    if(this.crossResult == null)
        return null;

    var L = this.left.data.nodes;
    var R = this.right.data.nodes;

    for (var i = 0; i < L.length; i++) {
        if (L[i].color.background == finalStateColorGlobal) {
            console.log("pattern: " + L[i].id);
            var pattern = new RegExp(String(L[i].id));
            for (var j = 0; j < this.crossResult.data.nodes.length; j++) {
                console.log(this.crossResult.data.nodes[j].id);
                if(pattern.test(String(this.crossResult.data.nodes[j].id)))
                {
                    this.crossResult.data.nodes[j].color.background = finalStateColorGlobal;
                }
            }
        }
    }

    for (var i = 0; i < R.length; i++) {
        if (R[i].color.background == finalStateColorGlobal) {
            var pattern = new RegExp(String(R[i].id));
            for (var j = 0; j < this.crossResult.data.nodes.length; j++) {
                if(pattern.test(this.crossResult.data.nodes[j].id))
                {
                    this.crossResult.data.nodes[j].color.background = finalStateColorGlobal;
                }
            }
        }
    }


    return this.clean(this.crossResult);
};


/**
 * Union.prototype.clean - delete the dead state if it is not used
 *
 * @param  {DFA} retDFA dfa to be checked
 * @return {DFA}        dfa cleaned
 */
Union.prototype.clean = function(retDFA) {

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
