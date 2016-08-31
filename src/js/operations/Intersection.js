var Intersection = function Intersection(left, right) {
    console.log(left);
    console.log(right);
    console.log("");
    this.left = new DFA(left.options);
    this.left.clone(left);
    this.right = new DFA(right.options);
    this.right.clone(right);

  var crossOperation = new CrossProduct(this.left, this.right);
  this.crossResult = crossOperation.execute();
};

Intersection.prototype.compute = function () {
    if(this.crossResult == null)
        return null;

    var rightFinalStates = [];
    var leftFinalStates = [];

    var nodes = this.left.data.nodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].color != null && nodes[i].color.background == finalStateColorGlobal) {
            leftFinalStates.push(nodes[i]);
        }
    }

    nodes = this.right.data.nodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].color != null && nodes[i].color.background == finalStateColorGlobal) {
            rightFinalStates.push(nodes[i]);
        }
    }

    this.intersectFinalStates(leftFinalStates, rightFinalStates);
    return this.clean(this.crossResult);
};


//Intersecting the states where the id is composed by at least one final state from left dfa and one final state from right dfa
Intersection.prototype.intersectFinalStates = function (leftFinalStates, rightFinalStates) {
    var nodes = this.crossResult.data.nodes;
    for (var i = 0; i < nodes.length; i++) {

        var setToFinal = false;
        var pattern = null;

        //comparing id's with the original final states from the left dfa
        for (var l = 0; l < leftFinalStates.length; l++) {
            pattern = new RegExp(String(leftFinalStates[l].id));
            if (pattern.test(nodes[i].id)) {
                this.crossResult.data.nodes[i].color.background = finalStateColorGlobal;
                setToFinal = true;
                break;
            }
        }

        //only proceeds to compare with right dfa if the left the node matched one of the left dfa final states
        if(!setToFinal)
            continue;

        pattern = null;

        //comparing id's with the original final states from the right dfa
        for (var r = 0; r < rightFinalStates.length; r++) {
            pattern = new RegExp(String(rightFinalStates[r].id));
            if (!pattern.test(nodes[i].id)) {
                 this.crossResult.data.nodes[i].color.background = normalStateColorGlobal;
            }
            else break;
        }
    }
};

/**
 * Intersection.prototype.clean - delete the dead state if it is not used
 *
 * @param  {DFA} retDFA dfa to be checked
 * @return {DFA}        dfa cleaned
 */
Intersection.prototype.clean = function(retDFA) {

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
