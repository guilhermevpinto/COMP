/**
 * nfa_to_dfa - constructor of the converter from NFA to DFA
 *
 * @param  {DFA} dfa nfa to be converted to dfa
 */
var NFA_to_DFA = function nfa_to_dfa(dfa) {
	this.dfa = new DFA(dfa.options);
	this.dfa.clone(dfa);
  this.getAllInputs();
};

/**
 * NFA_to_DFA.prototype.convert - Convert the nfa to dfa
 *
 * @return {DFA}
 */
NFA_to_DFA.prototype.convert = function() {
  var retDFA = this.createDFA(this.dfa.data, this.dfa.options);
  var initial = this.getInitialState(this.dfa.data.nodes);

  retDFA.insertNode("triangle", initial, initial, normalStateColorGlobal);

  retDFA = this.compute(retDFA, [initial]);

  return this.paint(retDFA);
};

/**
 * NFA_to_DFA.prototype.paint - Paint the final states as red
 *
 * @param  {DFA} retDFA dfa to be painted
 * @return {DFA}        nfa converted
 */
NFA_to_DFA.prototype.paint = function(retDFA) {
  var nodes = this.dfa.data.nodes;
  var nodesRet = retDFA.data.nodes;
  //dfa antigo
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].color.background != finalStateColorGlobal) {
      continue;
    }
    var state = nodes[i].label.split(", ");

    //um circulo pode representar vários estados
    for (var j = 0; j < state.length; j++) {
      //dfa novo
      for (var w = 0; w < nodesRet.length; w++) {
        var stateRet = nodesRet[w].label.split(", ");
        if (stateRet.indexOf(state[j]) != -1) {
          retDFA.data.nodes[w].color.background = finalStateColorGlobal;
          retDFA.data.nodes[w].color.border = finalStateColorGlobal;
        }
      }
    }
  }

  return retDFA;
};

/**
 * NFA_to_DFA.prototype.compute - Performs the conversion
 *
 * @param  {DFA} retDFA        nfa to be converted
 * @param  {Nodes} statesToVisit list of the next states to be visited
 * @return {DFA}               nfa converted
 */
NFA_to_DFA.prototype.compute = function(retDFA, statesToVisit) {
  if (statesToVisit.length == 0) {
    return this.clean(retDFA);
  }

  /*
    Perform closure on the current state set
    For each input symbol do the GOTO operation on the closure set.
      If the state set you get from the GOTO is not empty
        Do a closure of the state set.
          If it is a new set of states:
            add a transition between the state sets on the input
            repeat the entire operation on this new set
          Else
            add a transition between the state sets on the input
  */

  var currentState = statesToVisit[0];
  var epsilonClosure = this.closure(currentState.split(", "), 0);
  for (var i = 0; i < this.allEdges.length; i++) {

    var input = this.allEdges[i].split(", ");

    for (var j = 0; j < input.length; j++) {
      var stateTo = this.goto(input[j], epsilonClosure);
      if (stateTo == null) {
		  	var ds = "DS" + nfaDSGlobal;
        retDFA = this.to(retDFA, epsilonClosure, ds, input[j]);

      } else {
        var temp_epsilonClosure = this.closure(stateTo.split(", "), 0);
        var nodes = retDFA.data.nodes;
        var found = false;
        for (var w = 0; w < nodes.length && !found; w++) {
          if (nodes[w].label == temp_epsilonClosure) {
            found = true;
          }
        }

        retDFA = this.to(retDFA, epsilonClosure, temp_epsilonClosure, input[j]);

        if (!found) {
          retDFA.insertNode("circle", temp_epsilonClosure, temp_epsilonClosure, normalStateColorGlobal);
          statesToVisit.push(temp_epsilonClosure);
        }
      }
    }
  }

  statesToVisit.shift();
  return this.compute(retDFA, statesToVisit);
};

/**
 * NFA_to_DFA.prototype.goto - Performs the operation GOTO for a given state and input
 *
 * @param  {Edges} edgeLabel transition edge label
 * @param  {Nodes} stateSA   current state
 * @return {Nodes}           list of nodes the current state goes to
 */
NFA_to_DFA.prototype.goto = function(edgeLabel, stateSA) {

  var state = stateSA.split(", ");
  var stateToGo = [];
  var edges = this.dfa.data.edges;

  for (var i = 0; i < state.length; i++) {
    for (var j = 0; j < edges.length; j++) {
      if (edges[j].from != state[i] || (edges[j].to.substring(0, 2) == "DS" && edges[j].to.substring(2).match(/^[0-9]+$/) != null)) {
        continue;
      }

      var trans = edges[j].label.split(", ");
      if (trans.indexOf(edgeLabel) == -1) {
        continue;
      }

      stateToGo.push(edges[j].to.split(", "));
    }
  }

  if (stateToGo.length == 0) {
    return null;
  }

  stateToGo.sort();
  return stateToGo.join(", ");
};

/**
 * NFA_to_DFA.prototype.closure - Performs the closure of a given state (index should be 0)
 *
 * @param  {Node} state  current state
 * @param  {int} index1 index of the states
 * @return {Nodes}        closure of the current state
 */
NFA_to_DFA.prototype.closure = function(state, index1) {

  if (index1 >= state.length) {
    state.sort();
    return state.join(", ");
  }

  var edges = this.dfa.data.edges;

  for (var i = 0; i < edges.length; i++) {
    if (edges[i].from == state[index1] && edges[i].label == "$") {
      var toState = edges[i].to.split(", ");
      for (var j = 0; j < toState.length; j++) {
        if (state.indexOf(toState[j]) == -1) {
          state.push(toState[j]);
        }
      }
    }
  }

  index1++;
  return this.closure(state, index1);
};

/**
 * NFA_to_DFA.prototype.getAllInputs - Get all the inputs on the nfa
 */
NFA_to_DFA.prototype.getAllInputs = function() {

  var edges = this.dfa.data.edges;
  this.allEdges = [];

  for (var i = 0; i < edges.length; i++) {
    var ip = edges[i].label.split(", ");
    for (var j = 0; j < ip.length; j++) {
      if (ip[j] != "$" && (this.allEdges.indexOf(ip[j]) == -1)) {
        this.allEdges.push(ip[j]);
      }
    }
  }

  this.allEdges.sort();
};

/**
 * NFA_to_DFA.prototype.getInitialState - Get the initial state from the nfa
 *
 * @param  {Nodes} states list of states
 * @return {Node}        closure of the initial state
 */
NFA_to_DFA.prototype.getInitialState = function(states) {
  for (var i = 0; i < states.length; i++) {
    if (states[i].shape != null && states[i].shape == "triangle") {
      var state = states[i].label.split(", ");
      state.sort();
      return this.closure(state, 0);
    }
  }
};

/**
 * NFA_to_DFA.prototype.to - Create (or update) one edge from a state to another
 *
 * @param  {DFA} dfa   dfa
 * @param  {Node} state node where it starts
 * @param  {Nodes} to    node where it ends
 * @param  {String} input transition
 * @return {DFA}       dfa
 */
NFA_to_DFA.prototype.to = function(dfa, state, to, input) {

  var edges = dfa.data.edges;

  for (var i = 0; i < edges.length; i++) {
    if (edges[i].from == state && edges[i].to == to) {
      var str = edges[i].label.split(", ");
      str.push(input);
      str.sort();
      dfa.data.edges[i].label = str.join(", ");
      return dfa;
    }
  }

  dfa.insertEdge(state, to, input);
  return dfa;
};

/**
 * NFA_to_DFA.prototype.createDFA - Create an empty dfa with a dead state (DS) and an edge pointing to itself
 *
 * @param  {data} data    nodes and edges
 * @param  {options} options options of the DFA (checkout vis.js for the options explanation)
 * @return {DFA}         dfa created with the dead state
 */
NFA_to_DFA.prototype.createDFA = function(data, options) {
  var retDFA = new DFA(options);

  nfaDSGlobal++;
  var ds = "DS" + nfaDSGlobal;

  retDFA.insertNode("circle", ds, ds, normalStateColorGlobal);

  retDFA.insertEdge(ds, ds, this.allEdges.join(", "));

  return retDFA;
};

/**
 * NFA_to_DFA.prototype.clean - delete the dead state if it is not used
 *
 * @param  {DFA} retDFA dfa to be checked
 * @return {DFA}        dfa cleaned
 */
NFA_to_DFA.prototype.clean = function(retDFA) {

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

	for (var i = 0; i < retDFA.data.edges.length; i++) {
		if ((retDFA.data.edges[i].from == "DS" && retDFA.data.edges[i].to != "DS")
				|| (retDFA.data.edges[i].from != "DS" && retDFA.data.edges[i].to == "DS")) {
			return retDFA;
		}
	}

	for (var i = 0; i < retDFA.data.edges.length; i++) {
		if (retDFA.data.edges[i].from == "DS" && retDFA.data.edges[i].to == "DS") {
			retDFA.data.edges.splice(i,1);
			i--;
		}
	}

	retDFA.data.nodes.splice(0,1);
	return retDFA;
};
