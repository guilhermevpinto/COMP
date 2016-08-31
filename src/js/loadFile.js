/**
 * Array with automatas
 */
var automata = new Array();
/**
 * Index of automata
 */
var index = 1
/**
 * Upload file listener
 */
var inputElement = document.getElementById("input");
inputElement.addEventListener("change", handleFiles, false);

/**
 * Upload DOTfile
 */
function handleFiles() {
  var files = this.files;
  var file = files[0];
  var textType = /^[a-zA-Z][a-zA-Z0-9_\- \.]*\.dot/g;

  var result = true;
  automata.forEach(function(item){
    if(item.name == file.name){
      result = false;
      return;
    }
  });

  if(!result){
    swal("Error!", "There is already an automata named '" + file.name + "'", "error");
    document.getElementById("input").value = "";
    return;
  }

  if (textType.test(file.name)) {
    var reader = new FileReader();
    reader.onload = function (e) {
      readerResult = reader.result;
      automata[index] = {id:"file"+index, name:file.name, dot:readerResult};

      document.getElementById("input").value = "";
      var listFiles = document.getElementsByClassName("listFiles").innerHTML;
      var buttonToAdd = "<li data-id='" + index +"' class='fileItem btn btn-success col-md-11'>" + automata[index].name + "</li><button data-id='" + index +"' class='btn btn-danger pull-right'>X</button>";
      var navTabToAdd = "<li><a data-toggle='tab' href='#file" + index + "'>" + automata[index].name + "</a></li>";
      var tabToAdd = "<div id='file" + index + "' class='tab-pane fade in'><div id='mynetwork" + index + "'></div></div>";
      $(".listFiles").append(buttonToAdd);
      $("#navtabs").append(navTabToAdd);
      $("#contentTabs").append(tabToAdd);
      $('#navtabs a:last').tab('show');
      fileListener();
      var fa = read(readerResult, "mynetwork" + index);
      if (fa != null) {
        var nfa = new NFA_to_DFA(fa);
        TreeProcess.hashmapFiles[file.name] = nfa.convert();
      }

      index++;
    }
    textType.lastIndex = 0;
    reader.readAsText(file);
    swal("Success!", "File successfully uploaded!", "success");
  } else {
    swal("Error!", "File not supported!", "error");
  }
}

/**
 * Active file listeners
 */
function fileListener(){
  id = $(this).attr("data-id");
  $( ".listFiles li" ).click(function() {
    id = $(this).attr("data-id");
    openDotEditor(automata[id].name, automata[id].dot);
  });
  $( ".listFiles button" ).click(function() {
    id = $(this).attr("data-id");
    $(".listFiles li[data-id='" + id + "']").remove();
    $(".listFiles button[data-id='" + id + "']").remove();
    $("#navtabs a[href='#file" + id +"']").remove();
    $("#contentTabs #file" + id).remove();
    if($('#navtabs >li').size() > 0)
      $('#navtabs a:last').tab('show');
    var i = null;
    automata.forEach(function(item, position){
      if(item.id == 'file'+ id){
        i = position;
        return;
      }
    });
    if(i != null)
      automata.splice(i, 1);
  });
}

$("#writeDotButton").click(function(){openDotEditor("","");});

function openDotEditor(name, dot){
  $("#editDot").modal();
  $("#editorDotName").val(name);
  $("#editorDotText").val(dot);
}

function submitButton(){
  var dotName = $("#editorDotName").val();
  var dotText = $("#editorDotText").val();

  var result = null;
  automata.forEach(function(item){
    if(item.name == dotName || item.dot == dotText){
      result = item.id;
      return;
    }
  });

  if(result != null){
    result = result.split("file")[1];
    $(".listFiles li[data-id='" + result + "']").remove();
    $(".listFiles button[data-id='" + result + "']").remove();
    $("#navtabs a[href='#file" + result +"']").remove();
    $("#contentTabs #file" + result).remove();
    if($('#navtabs >li').size() > 0)
      $('#navtabs a:last').tab('show');
    var i = null;
    automata.forEach(function(item, position){
      if(item.id == 'file'+ result){
        i = position;
        return;
      }
    });
    if(i != null)
      automata.splice(i, 1);
  }

  if (dotName != "" && dotText != ""){
    automata[index] = {id:"file"+index, name:dotName, dot:dotText};

    document.getElementById("input").value = "";
    var listFiles = document.getElementsByClassName("listFiles").innerHTML;
    var buttonToAdd = "<li data-id='" + index +"' class='fileItem btn btn-success col-md-11'>" + automata[index].name + "</li><button data-id='" + index +"' class='btn btn-danger pull-right'>X</button>";
    var navTabToAdd = "<li><a data-toggle='tab' href='#file" + index + "'>" + automata[index].name + "</a></li>";
    var tabToAdd = "<div id='file" + index + "' class='tab-pane fade in'><div id='mynetwork" + index + "'></div></div>";
    $(".listFiles").append(buttonToAdd);
    $("#navtabs").append(navTabToAdd);
    $("#contentTabs").append(tabToAdd);
    $('#navtabs a:last').tab('show');
    fileListener();
    
    $('#editDot').modal('toggle');
    loadEditor();
   
    var fa = read(dotText, "mynetwork" + index);
    if (fa != null) {
      var nfa = new NFA_to_DFA(fa);
      TreeProcess.hashmapFiles[dotName] = nfa.convert();
    }

    index++;
    if(result != null){
      swal("Success!", "File successfully edited!", "success");
    }
    else{
      swal("Success!", "File successfully created!", "success");
    }
  }
  else {
    swal("Error!", "Null value!", "error");
  }
}

/**
 * Convert DOTstring to a graph
 *
 * @param  {DOTstring} DOTstring to represent on graph
 * @param  {mynetwork} Graph when DOTstring will be represented
 */
function read(DOTstring, mynetwork){
  draw(DOTstring, mynetwork);
  var parsedData = vis.network.convertDot(DOTstring);
  var container = document.getElementById(mynetwork);
  var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
  }

  var options = parsedData.options;

  options.height = '400px';

  /*for (var i = 0; i < data.nodes.length; i++) {
    data.nodes[i].color = data.nodes[i].color.background;
  }*/

  // create a network
  //var network = new vis.Network(container, data, options);

  if (!(checkNodes(data.nodes) && checkEdges(data.edges))) {
    return null;
  }

  var fa = new DFA(options);
  fa.setData(data);

  return fa;
};

/**
 * Convert DOTstring to a graph
 *
 * @param  {DOTstring} DOTstring to represent on graph
 * @param  {mynetwork} Graph when DOTstring will be represented
 */
function draw(DOTstring, mynetwork){
  var parsedData = vis.network.convertDot(DOTstring);
  var container = document.getElementById(mynetwork);
  var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
  }
  var options = parsedData.options;

  options.height = '400px';

  for (var i = 0; i < data.nodes.length; i++) {
    data.nodes[i].color = data.nodes[i].color.background;
  }

  // create a network
  var network = new vis.Network(container, data, options);
};

/**
 * Check nodes validity
 *
 * @param  {nodes} Graph nodes
 */
function checkNodes(nodes){
  if (!checkValidFA(nodes)) {
    errorMsg('The finite automata is required to have a initial state and at least one final.\n' +
                  'Epsilon states require the label $ (dollar sign). Each transition can have multiple inputs. ' +
                  'Therefore, multiple inputs can be represented by being separated by a comma.\n' +
                  'Valid NFA (Non-Deterministic Finite Automata) example:\n' +
                  'dinetwork { '+
                  'A -> B [label="$"]; ' +
                  'A -> C [label="0"]; ' +
                  'B -> C [label="1"]; ' +
                  'A[ color=blue, shape=triangle] '+
                  'B[ color=blue, shape=circle] '+
                  'C[ color=red, shape=circle] '+
                  '}');
    return false;
  }
	if(!checkInitial(nodes)){
		errorMsg('Initial state is not correctly defined. Its shape is a triangle.');
    return false;
	}
  if (!checkFinal(nodes)) {
		errorMsg('Final state is not correctly defined. Its color is red.');
    return false;
  }

  return true;
};

/**
 * Check Finite Automata
 *
 * @param  {nodes} Graph nodes
 */
function checkValidFA(nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (!(validShape(nodes[i]) && validColor(nodes[i]))) {
      return false;
    }
  }

  return true;
};

/**
 * Check edges validity
 *
 * @param  {edges} Graph edges
 */
function checkEdges(edges) {
  for (var i = 0; i < edges.length; i++) {
    if (!validTransition(edges[i])) {
      return false;
    }
  }

  return true;
};

/**
 * Check shape validity
 *
 * @param  {node} Graph node
 */
function validShape(node) {
  return node.shape == "triangle" || node.shape == "circle";
};

/**
 * Check transition validity
 *
 * @param  {edge} Graph edge
 */
function validTransition(edge) {
  return edge.to != null && edge.from != null;
};

/**
 * Check color validity
 *
 * @param  {node} Graph node
 */
function validColor(node) {
  return node.color != null && (checkColor(node, finalStateColorGlobal) || checkColor(node, normalStateColorGlobal));
};

/**
 * Check node color
 *
 * @param  {node} Graph node
 * @param  {color} Node color
 */
function checkColor(node, color) {
  return node.color.background == color && node.color.border == color;
};

/**
 * Check initial state existance
 *
 * @param  {node} Graph node
 */
function checkInitial(nodes) {
  var cnt = 0;

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].shape == "triangle")
      cnt++;
  }

  return cnt == 1;
};

/**
 * Check final state existance
 *
 * @param  {nodes} Graph nodes
 */
function checkFinal(nodes) {
  var cnt = 0;

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].color != null && nodes[i].color.background == finalStateColorGlobal && nodes[i].color.border == finalStateColorGlobal)
      cnt++;
  }

  return cnt > 0;
};
