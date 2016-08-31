/**
 * var - constructor of the TreeProcess
 *
 * @param  {tree} tree syntax tree
 */
var TreeProcess = function(tree) {
  TreeProcess.tree = tree;
  TreeProcess.hashmapVar = new Map();
};

TreeProcess.tree = [];

//they are maps of DFAs
//map of the variables used
TreeProcess.hashmapVar = new Map();

//map of the files uploaded
TreeProcess.hashmapFiles = new Map();

/**
 * TreeProcess.prototype.compute - Process the tree
 */
TreeProcess.prototype.compute = function() {
  for (var i = 0; i < TreeProcess.tree._root.children.length; i++) {
    this.traverseDF(TreeProcess.tree._root.children[i].children[0]);
  }
};

/**
 * TreeProcess.prototype.decideLeaf - return the leaf dfa or its name
 *
 * @param  {leaf} node node of the tree
 */
TreeProcess.prototype.decideLeaf = function(node) {
  if (node.token.id == TOKENS.FILENAME) {
    return TreeProcess.hashmapFiles[node.token.img];
  } else {
    if (TreeProcess.hashmapVar[node.token.img] != null) {
      return TreeProcess.hashmapVar[node.token.img];
    }
    return node.token.img;
  }
};

/**
 * TreeProcess.prototype.decide1Arg - Choose the operation of the tree when it's called with one argument
 *
 * @param  {Token} op   operation
 * @param  {Node} node dfa
 * @return {DFA}      dfa or node after its operation
 */
TreeProcess.prototype.decide1Arg = function(op, node) {

  if (op.token == null) {
    return node;
  }

  switch (op.token.id) {
    case TOKENS.COMPLEMENT:
      var dfa = new Complement(node);
      return dfa.compute();
    case TOKENS.REVERSE:
      var dfa = new Reverse(node);
      return dfa.compute();
    default:
      return node;
  }
};

/**
 * TreeProcess.prototype.decide2Arg - Choose the operation of the tree when it's called with two arguments
 *
 * @param  {type} op    operation
 * @param  {type} left  dfa of the left
 * @param  {type} right dfa of the right
 * @return {type}       dfa after its operation
 */
TreeProcess.prototype.decide2Arg = function(op, left, right) {
  var dfa = null;
  switch (op.token.id) {
    case TOKENS.MULTIPLY:
      dfa = new Multiplication(left, right);
      return dfa.compute();
    case TOKENS.CONCATENATE:
      dfa = new Concatenation(left, right);
      return dfa.compute();
    case TOKENS.INTERSECTION:
      dfa = new Intersection(left, right);
      return dfa.compute();
    case TOKENS.UNION:
      dfa = new Union(left, right);
      return dfa.compute();
    case TOKENS.EQUAL:
      if (right == null) {
        errorMsg("File is probably missing...");
        return null;
      }
      TreeProcess.hashmapVar[left] = right;
      return null;
    case TOKENS.DUMP:
      dfa = new Dump(left, right);
      return dfa.compute();
    default:
      return null;
  }
};

/**
 * TreeProcess.prototype.traverseDF - Traverse the tree depth first and calls the responsables for the operations
 *
 * @param  {syntax tree} tree tree
 * @return {dfa}      dfa after its operations
 */
TreeProcess.prototype.traverseDF = function(tree) {
  (function recurse(currentNode) {

    switch (currentNode.children.length) {
      case 0:
      return TreeProcess.prototype.decideLeaf(currentNode);
      case 1:
      var result = recurse(currentNode.children[0]);
      if(result != null)
         return TreeProcess.prototype.decide1Arg(currentNode, result);
      else return;
      case 2:
      var result1 = recurse(currentNode.children[0]);
      var result2 = recurse(currentNode.children[1]);
      if(result1 != null && result2 != null)
        return TreeProcess.prototype.decide2Arg(currentNode, result1, result2);
      else return;
      default:
      errorMsg("Too many childrens of the node: "+currentNode);
      return null;
    }

  })(tree);
};
