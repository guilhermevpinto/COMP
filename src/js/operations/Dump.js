/**
 * Complement - constructor of the complement operation
 *
 * @param  {DFA} dfa to be dumped
 * @param {name} filename name
 */
var Dump = function Dump(dfa, name) {
	this.name = name + ".dot";
  if(dfa.data == null) return;
	this.dfa = new DFA(dfa.options);
	this.dfa.clone(dfa);
};

/**
 * Dump.prototype.compute - performs the dump operation
 */
Dump.prototype.compute = function(){
  if(this.dfa == null) return;
  if(this.dfa.data == null) return;
  
  var content='dinetwork{\n';
  var nodes = this.dfa.data.nodes;
  var edges = this.dfa.data.edges;

  for(var i=0; i< edges.length; i++){
    content+='  "'+edges[i].from + "\"->\""+ edges[i].to + "\"[label=\""+ edges[i].label+"\"];\n"
  }

  for(var i=0; i < nodes.length; i++){
    content+= '  "'+nodes[i].id +"\"[color="+ nodes[i].color.background +", shape="+nodes[i].shape+ "]\n";
  }

  content+='}';

	newAutomataResult(content, this.name);
};
