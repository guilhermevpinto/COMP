//Code from the open source github project "data-structures"
//from the user "tutsplus"
//https://github.com/tutsplus/data-structures
//http://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393
function Node(data, token) {
    this.data = data;
    this.token = token;
    this.parent = null;
    this.children = [];
}

function Tree(data) {
    var node = new Node(data);
    this._root = node;
}

function Tree(data, token) {
    var node = new Node(data, token);
    this._root = node;
}

Tree.prototype.traverseDF = function(callback) {

    // this is a recurse and immediately-invoking function
    (function recurse(currentNode) {
        // step 2
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            // step 3
            recurse(currentNode.children[i]);
        }

        // step 4
        callback(currentNode);

        // step 1
    })(this._root);

};

Tree.prototype.traverseBF = function(callback) {
    var queue = new Queue();

    queue.enqueue(this._root);

    currentTree = queue.dequeue();

    while(currentTree){
        for (var i = 0, length = currentTree.children.length; i < length; i++) {
            queue.enqueue(currentTree.children[i]);
        }

        callback(currentTree);
        currentTree = queue.dequeue();
    }
};

Tree.prototype.contains = function(callback, traversal) {
    traversal.call(this, callback);
};

Tree.prototype.add = function(data, toData, traversal, token) {
    var child = new Node(data, token),
        parent = null,
        callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };

    this.contains(callback, traversal);

    if (parent) {
        parent.children.push(child);
        child.parent = parent;
    } else {
        throw new Error('Cannot add node to a non-existent parent.');
    }
};

Tree.prototype.addBegining = function(data, toData, traversal, token) {
    var child = new Node(data, token),
        parent = null,
        callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };

    this.contains(callback, traversal);

    if (parent) {
        parent.children.unshift(child);
        child.parent = parent;
    } else {
        throw new Error('Cannot add node to a non-existent parent.');
    }
};

Tree.prototype.addTree = function(tree, toData, traversal) {
    var parent = null;
    callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };

    this.contains(callback, traversal);

    if(parent != null) {
        tree._root.parent = parent;
        parent.children.push(tree._root);
    }
};

Tree.prototype.addTreeBegining = function(tree, toData, traversal) {
    var parent = null;
    callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };

    this.contains(callback, traversal);

    if(parent != null) {
        tree._root.parent = parent;
        parent.children.unshift(tree._root);
    }
};

Tree.prototype.remove = function(data, fromData, traversal) {
    var tree = this,
        parent = null,
        childToRemove = null,
        index;

    var callback = function(node) {
        if (node.data === fromData) {
            parent = node;
        }
    };

    this.contains(callback, traversal);

    if (parent) {
        index = findIndex(parent.children, data);

        if (index === undefined) {
            throw new Error('Node to remove does not exist.');
        } else {
            childToRemove = parent.children.splice(index, 1);
        }
    } else {
        throw new Error('Parent does not exist.');
    }

    return childToRemove;
};

function findIndex(arr, data) {
    var index;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].data === data) {
            index = i;
        }
    }

    return index;
}
