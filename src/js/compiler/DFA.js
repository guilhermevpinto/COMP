/**
 * var - DFA constructor
 *
 * @param  {options} options ckeck vis.js for further explanations
 */
var DFA = function(options) {
  this.data = {nodes: [], edges: []};
  this.options = options;
};

/**
 * DFA.prototype.setData - Set the data of the dfa (states and edges)
 *
 * @param  {data} data1 nodes and edges
 */
DFA.prototype.setData = function(data1) {
  this.data = data1;
};

/**
 * DFA.prototype.insertEdge - insert an edge to the dfa
 *
 * @param  {String} fromObj  id of the node where it's from
 * @param  {String} toObj    id of the node where it goes
 * @param  {String} labelObj label of the edge
 */
DFA.prototype.insertEdge = function(fromObj, toObj, labelObj) {
  this.data.edges.push({
    from: fromObj,
    to: toObj,
    label: labelObj
  });
};

/**
 * DFA.prototype.insertNode - insert a state to the dfa
 *
 * @param  {String} shapeObj shape of the node
 * @param  {String} idObj    id of the node
 * @param  {String} labelObj label of the node
 * @param  {String} colorObj color of the node
 */
DFA.prototype.insertNode = function(shapeObj, idObj, labelObj, colorObj) {
  this.data.nodes.push({
    shape: shapeObj,
    id: idObj,
    label: labelObj,
    color: {
      background: colorObj,
      border: colorObj
    }
  });
};

/**
 * DFA.prototype.clone - insert a state to the dfa
 *
 * @param  {DFA} dfa dfa to be cloned (without references)
 */
DFA.prototype.clone = function(dfa) {
  for (var i = 0; i < dfa.data.nodes.length; i++) {
    var node = dfa.data.nodes[i];
    this.insertNode(node.shape, node.id, node.label, node.color.background);
  }

  for (var i = 0; i < dfa.data.edges.length; i++) {
    var edge = dfa.data.edges[i];
    this.insertEdge(edge.from, edge.to, edge.label);
  }
};
