/**
 * Array with automata results
 */
var automataResult = new Array();
/**
 * Index of automata result
 */
var indexResult = 1;

/**
 * Convert result DOTstring to a graph
 *
 * @param  {newResult} DOTstring result to represent on graph
 * @param  {nameResult} Graph when DOTstring will be represented
 */
function newAutomataResult(newResult, nameResult){
  automataResult[indexResult] = {dot:newResult, name:nameResult};

  var navTabToAdd = "<li><a data-toggle='tab' href='#fileResult" + indexResult + "'>" + automataResult[indexResult].name + "</a></li>";
  var tabToAdd =  "<div id='fileResult" + indexResult + "' class='tab-pane fade in'>\n"+
                    "<div id='mynetworkResult" + indexResult + "'></div>\n"+
                    "<button class='btn btn-info footer col-md-3' onclick='downloadFile(" + indexResult + ")'>Download DOT file</button>\n"+
                    "</div>";

  $("#navtabsResult").append(navTabToAdd);
  $("#contentTabsResult").append(tabToAdd);
  $('#navtabsResult a:last').tab('show');
  readResult(automataResult[indexResult].dot, "mynetworkResult" + indexResult);
  indexResult++;
}

/**
 * Delete automata results
 */
function deleteAutomataResult(){
  automataResult = new Array();
  indexResult = 1;

  $("#navtabsResult").empty();
  $("#contentTabsResult").empty();
}

/**
 * Convert result DOTstring to a graph
 *
 * @param  {DOTstring} DOTstring to represent on graph
 * @param  {mynetwork} Graph when DOTstring will be represented
 */
function readResult(DOTstring, mynetwork){
  draw(DOTstring, mynetwork);
  var parsedData = vis.network.convertDot(DOTstring);
  var container = document.getElementById(mynetwork);
  var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
  }

  var options = parsedData.options;

  options.height = '400px';

  // create a network
  //var network = new vis.Network(container, data, options);
};
