var Syntactic = function(sequence) {
	this.sequence = sequence;
	this.tree = null;
	this.opIndex = 0;

	this.variables = [];

	this.syntacticAnalysis();
};

Syntactic.prototype.syntacticAnalysis = function() {
	if(this.sequence.tokens.length == 0)
		return;

	if(this.S())
		successMsg("Correct Syntactic construction of the statement.");
	else
		errorMsg("Error on statement's construction.");
};

/**
 * @return {boolean} [Returns true is the tree was successfuly created or false, otherwise]
 */
Syntactic.prototype.S = function() {
	this.tree = new Tree('START');
	var loop = true;
	var i = 0;

	while(this.sequence.peek() != null){

		if(!this.expressionHandler(i++)) {
			this.tree = null;
			return false;
		}

		this.sequence.nextToken();
	}

	return true;
};

/**
 * @param  {[Node]} [Parent Node to which the new subtree will be added]
 * @return {[Tree]} [New generated subTree]
 */
Syntactic.prototype.expressionHandler = function(parent) {
	this.tree.add(parent, 'START', this.tree.traverseDF, null);

	if(this.sequence.peek().id == TOKENS.DECLARATION) {
		this.sequence.nextToken();
		return this.declaration(parent);
	}
	return this.dump(parent);
};

/**
 * [declaration parses the identification of a new variable]
 */
Syntactic.prototype.declaration = function(parent) {
	var identifier = null;
	var equalsId = null;

	if(this.sequence.peek().id == TOKENS.IDENTIFIER) {
		if (this.variables[this.sequence.peek().img] != null) {
			warningMsg("Variable '" + this.sequence.peek().img + "' is already defined.");
		}
		identifier = this.sequence.peek();
		this.variables[this.sequence.peek().img] = true;
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.EQUAL) {
			equalsId = this.sequence.peek().img + parent;
			this.tree.add(equalsId, parent, this.tree.traverseDF, this.sequence.peek());
			this.tree.add(identifier.img, equalsId, this.tree.traverseDF, identifier);
			return this.declarationHandler(equalsId);
		}
	}
	return false;
};

/**
 * [declarationHandler Handles the declaration of a variable either if it is a new dfa or a statemento operation]
 */
Syntactic.prototype.declarationHandler = function(parent) {
	this.sequence.nextToken();
	if(this.sequence.peek().id == TOKENS.NEW) {
		return this.newExpression(parent);
	}
	else
	{
		var data = this.operation(parent, this.tree);
		if (data != null)
		{
			if(this.sequence.peek() == null)
				return false;
			if (this.sequence.peek().id == TOKENS.SEMI_COLON)
			  return true;
		}
	}
	return false;
};

/**
 * [newExpression parsing of a NEW statement]
 * @param  {[type]} parent [description]
 * @return {[type]}        [description]
 */
Syntactic.prototype.newExpression = function(parent) {
	this.sequence.nextToken();
	if(this.sequence.peek().id == TOKENS.OPEN) {
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.QUOTE) {
			this.sequence.nextToken();
			if(this.sequence.peek().id == TOKENS.FILENAME) {
				if (!this.fileExists(this.sequence.peek().img)) {
					errorMsg("File '" + this.sequence.peek().img +"' does not exist.");
					return null;
				}
				this.tree.add(this.sequence.peek().img, parent, this.tree.traverseDF, this.sequence.peek());
				this.sequence.nextToken();
				if(this.sequence.peek().id == TOKENS.QUOTE) {
					this.sequence.nextToken();
					if(this.sequence.peek().id == TOKENS.CLOSE) {
						this.sequence.nextToken();
						return this.sequence.peek().id == TOKENS.SEMI_COLON;
					}
				}
			}
		}
	}
	return false;
};

/**
 * [fileExists Semantic verification of the requires file]
 */
Syntactic.prototype.fileExists = function(filename) {
	var result = false;
	automata.forEach(function(item){
    if(item.name == filename){
      result = true;
      return;
    }
  });
	return result;
};

/**
 * [dump parsing of a DUMP statement]
 */
Syntactic.prototype.dump = function(parent) {
	if(this.sequence.peek().id == TOKENS.IDENTIFIER) {
		if (this.variables[this.sequence.peek().img] == null) {
			errorMsg("Variable '" + this.sequence.peek().img + "' is used but not defined.");
			return false;
		}
		var filename = this.sequence.peek();
		this.sequence.nextToken();
		if(this.sequence.peek().id == TOKENS.CONCATENATE) {
			this.sequence.nextToken();
			if(this.sequence.peek().id == TOKENS.DUMP) {
				var dump = this.sequence.peek().img + parent;
				this.tree.add(dump, parent, this.tree.traverseDF, this.sequence.peek());
				this.tree.add(filename.img, dump, this.tree.traverseDF, filename);
				this.sequence.nextToken();
				if(this.sequence.peek().id == TOKENS.OPEN) {
					this.sequence.nextToken();
					if(this.sequence.peek().id == TOKENS.QUOTE) {
						this.sequence.nextToken();
						if(this.sequence.peek().id == TOKENS.IDENTIFIER) {
							this.tree.add(this.sequence.peek().img, dump, this.tree.traverseDF, this.sequence.peek());
							this.sequence.nextToken();
							if(this.sequence.peek().id == TOKENS.QUOTE) {
								this.sequence.nextToken();
								if(this.sequence.peek().id == TOKENS.CLOSE) {
									this.sequence.nextToken();
									return this.sequence.peek().id == TOKENS.SEMI_COLON;
								}
							}
						}
					}
				}
			}
		}
	}

	return false;
};

/**
 * [operation Parsing of an operation statement]
 */
Syntactic.prototype.operation = function(parent, tree_) {
	if (this.sequence.peek().id == TOKENS.COMPLEMENT) {

		var newTree = this.checkComplement();
		if(newTree != null)
		{
			var newParentTree = this.operationR(parent, tree_);
			if(newParentTree != null)
			{
				newParentTree.addTreeBegining(newTree, newParentTree._root.data, tree_.traverseDF);
				tree_.addTree(newParentTree, parent, tree_.traverseDF);
			}
			else tree_.addTree(newTree, parent, tree_.traverseDF);
			return tree_;
		}

	} else if (this.sequence.peek().id == TOKENS.REVERSE) {

		var newTree = this.checkReverse();
		if(newTree != null)
		{
			var newParentTree = this.operationR(parent, tree_);
			if(newParentTree != null)
			{
				newParentTree.addTreeBegining(newTree, newParentTree._root.data, tree_.traverseDF);
				tree_.addTree(newParentTree, parent, tree_.traverseDF);
			}
			else tree_.addTree(newTree, parent, tree_.traverseDF);

			return tree_;
		}

	} else if (this.sequence.peek().id == TOKENS.IDENTIFIER) {

		if (this.variables[this.sequence.peek().img] == null) {
			errorMsg("Variable '" + this.sequence.peek().img + "' is used but not defined.");
			return false;
		}

		var ident = this.sequence.peek();
		this.sequence.nextToken();
		var newParentTree = this.operationR(parent, tree_);
		if (newParentTree != null){
			tree_.addTree(newParentTree, parent, tree_.traverseDF);
			tree_.addBegining(ident.img, newParentTree._root.data, tree_.traverseDF, ident);
		}
		else tree_.add(ident.img, parent, tree_.traverseDF, ident);

		return tree_;

	} else if (this.sequence.peek().id == TOKENS.OPEN) {
		this.sequence.nextToken();
		newTree = this.checkParenteses(parent);
		if(newTree != null)
		{
			var newParentTree = this.operationR(parent, tree_);
			if(newParentTree != null)
			{
				newParentTree.addTreeBegining(newTree, newParentTree._root.data, tree_.traverseDF);
				tree_.addTree(newParentTree, parent, tree_.traverseDF);
			}
			else tree_.addTree(newTree, parent, tree_.traverseDF);

			return tree_;
		}
	}

	errorMsg("Operation not recognized.");
	return null;
};

/**
 * [checkReverse Parsing of a reverse operation]
 * @return {[type]} [description]
 */
Syntactic.prototype.checkReverse = function() {
	var reverseId = this.sequence.peek().img + this.opIndex++;
	var newTree = new Tree(reverseId, this.sequence.peek());
	this.sequence.nextToken();
	if(this.sequence.peek().id == TOKENS.OPEN) {
		this.sequence.nextToken();
		var newTree_ = this.operation(reverseId, newTree); //returns a updated version of 'newTree' with all the nodes of the expression inside the not operation
		if (newTree_ != null) {
			if (this.sequence.peek().id == TOKENS.CLOSE) {
				this.sequence.nextToken();
				return newTree_;
			}
		}
	}
	errorMsg("Reverse operation is badly defined.");
	return null;
};

/**
 * [checkReverse Parsing of a comlement operation]
 * @return {[type]} [description]
 */
Syntactic.prototype.checkComplement = function() {
	var complementId = this.sequence.peek().img + this.opIndex++;
	var newTree = new Tree(complementId, this.sequence.peek());
	this.sequence.nextToken();
	if(this.sequence.peek().id == TOKENS.OPEN) {
		this.sequence.nextToken();
		var newTree_ = this.operation(complementId, newTree); //returns a updated version of 'newTree' with all the nodes of the expression inside the not operation
		if (newTree_ != null) {
			if (this.sequence.peek().id == TOKENS.CLOSE) {
				this.sequence.nextToken();
				return newTree_;
			}
		}
	}
	errorMsg("Complement operation is badly defined.");
	return null;
};

/**
 * [checkReverse Parsing of a precedence with parentheses]
 * @return {[type]} [description]
 */
Syntactic.prototype.checkParenteses = function() {
	var	parent = "precedence" + this.opIndex++;
	var tree_ = new Tree(parent);
	var newTree_ = this.operation(parent, tree_); //returns a updated version of 'newTree' with all the nodes of the expression inside the not operation
	if (newTree_ != null) {
		if (this.sequence.peek().id == TOKENS.CLOSE) {
			this.sequence.nextToken();
			return newTree_;
		}
	}

	errorMsg("Parenteses operation is badly defined.");
	return null;
};


/**
 * [checkReverse Generates new subtree with a new OPCoperation]
 */
Syntactic.prototype.operationR = function(parent) {
	var tokenOP = this.checkOPC();

	if (tokenOP != null) {
		var tokenOPId = tokenOP.img + this.opIndex++;
		var newTree = new Tree(tokenOPId, tokenOP);
		this.sequence.nextToken();
		var data = this.operation(tokenOPId, newTree);
		return data;
	}

	return null;
};

/**
 * [checkReverse Parsing of an operation like multiply, concatenate, intersection and union]
 * @return {[type]} [description]
 */
Syntactic.prototype.checkOPC = function() {
	if(this.sequence.peek() == null)
		return null;

	if (this.sequence.peek().id == TOKENS.MULTIPLY
		|| this.sequence.peek().id == TOKENS.CONCATENATE
		|| this.sequence.peek().id == TOKENS.INTERSECTION
		|| this.sequence.peek().id == TOKENS.UNION) {
			return this.sequence.peek();
		}

	return null;
};
