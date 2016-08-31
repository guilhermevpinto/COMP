var CrossProduct = function(left, right) {
	this.left = new DFA(left.options);
	this.left.clone(left);
	this.right = new DFA(right.options);
	this.right.clone(right);
	this.newDFA = new DFA();
};

CrossProduct.prototype.execute = function() {
	this.crossStates();
	var alphabet = this.getAlphabet();
	this.processEdges(alphabet);
	if(this.newDFA == null)
		return null;
	else
		return this.clean(this.newDFA);
};

/**
 * [crossStates Creates de resultant states by processing the data of both received dfa's]
 */
 CrossProduct.prototype.crossStates = function() {
 	var L = this.left.data.nodes;
 	var R = this.right.data.nodes;

 	for (var i = 0; i < L.length; i++) {
 		for (var j = 0; j < R.length; j++) {
			var stateId = [L[i].id, R[j].id];
			stateId.sort();
			var newStateId = stateId.join(', ');

			var stateLabel = [L[i].label, R[j].label];
			stateLabel.sort();
			var newStateLabel = stateLabel.join(', ');

 			if (L[i].shape == 'triangle' && R[j].shape == 'triangle')
 				this.newDFA.insertNode('triangle', newStateId, newStateLabel, normalStateColorGlobal);
 			else
 				this.newDFA.insertNode('circle', newStateId, newStateLabel, normalStateColorGlobal);
 		}
 	}
 };

/**
 * [getAlphabet determines the alphabet to be used by processing the data of both received dfa's]
 * @return {[type]} [the array with the resultant alphabet]
 */
 CrossProduct.prototype.getAlphabet = function() {
 	var result = [];
 	var L = this.left.data.edges;
 	var R = this.right.data.edges;

 	for (var i = 0; i < L.length; i++) {
 		if (L[i].label.length > 1)
 		{
 			var subResult = null;

 			var pattern = new RegExp(', ');
 			if(pattern.test(L[i].label))
 				subResult = L[i].label.split(', ');
 			else
 				subResult = L[i].label.split(',');

 			for(var j = 0; j < subResult.length; j++)
 				result[subResult[j]] = subResult[j];
 		}
 		else result[L[i].label] = L[i].label;
 	}
 	for (var i = 0; i < R.length; i++) {
 		if (R[i].label.length > 1)
 		{
 			var subResult = null;
 			var pattern = new RegExp(', ');
 			if (pattern.test(R[i].label))
 				subResutl = R[i].label.split(', ');
 			else
 				subResult = R[i].label.split(',');

 			if(subResult != null) {
 				for (var j = 0; j < subResult.length; j++)
 					result[subResult[j]] = subResult[j];
 			}
 		}
 		else result[R[i].label] = R[i].label;
 	}
 	return result;
 };

/**
 * [processEdges ~Creation of the edges based on the algorithm for transition between crossed states]
 * @param  {[array]} alphabet [values od the possible transitions]
 */
CrossProduct.prototype.processEdges = function(alphabet) {
 	var L = this.left.data.nodes;
 	var R = this.right.data.nodes;

 	for(var i = 0; i < L.length; i++) {
 		for(var j = 0; j < R.length; j++) {
			var originArray = [L[i].id, R[j].id];
			originArray.sort();
 			var fromObj = originArray.join(', ');

 			for (param in alphabet) {
 				var destinationL = this.searchEdge(this.left, L[i].id, param);
 				var destinationR = this.searchEdge(this.right, R[j].id, param);
 				if(destinationR != null && destinationL != null){
					var destinationArray = [destinationL, destinationR];
					destinationArray.sort();
					var toObj = destinationArray.join(', ');
 					this.newDFA.insertEdge(fromObj, toObj, param);
				 }
 				else {
 					errorMsg("The Finite Automatas aren't complete and Cross Product can't be processed");
 					this.newDFA = null;
 				}
 			}
 		}
 	}
 };

/**
 * [searchEdge Verifies if a original dfa contains a certain transition initiated on a given node]
 * @return {[type]}       [description]
 */
CrossProduct.prototype.searchEdge = function(dfa, id, param) {
	var edges = dfa.data.edges;
	var pattern = new RegExp(param);

	for(var i = 0; i < edges.length; i++) {
		if (id == edges[i].from && pattern.test(edges[i].label))
			return edges[i].to;
	}

	return null;
};

/**
 * CrossProduct.prototype.clean - delete the dead state if it is not used
 *
 * @param  {DFA} retDFA dfa to be checked
 * @return {DFA}        dfa cleaned
 */
CrossProduct.prototype.clean = function(retDFA) {

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
