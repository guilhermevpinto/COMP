/**
 * loadExample - Load example file
 *
 * @param  {arg} example number
 */
function loadExample(arg){
  clearAll();
  var url = 'use_cases/examples/' + arg + '.txt'
  $.get(url, function (localData) {
    $(function(){
      readerResult = localData;
      //read file line by line
      var lines = readerResult.split(/(?:\\[rn]|[\r\n]+)+/g);

      var i = 0;
      while (i < lines.length) {
        lines[i] = lines[i].replace(" ", "");
        if (lines[i].length != 0) {
          if (lines[i] == "filename"){
            i++;
            var name = lines[i];
            var content = "";
            i++;
            while (lines[i] != "}") {
              content += lines[i] + "\n";
              i++;
            }
            content += lines[i];
            // CHAMAR ADICIONAR FICHEIRO
            addFile(name, content);
          }
          if (lines[i] == "textarea.start"){
            var textbox = "";
            i++;

            while (lines[i] != "textarea.stop") {
              textbox += lines[i] + "\n";
              i++;
            }
            // Guardar textbox na TEXT BOX
            $('#editor').val(textbox);
            loadEditor();
            $('#editorW').show();
          }
        }
        i++;
      }
    });
  });
}

/**
 * addFile - Add file to specific site position
 *
 * @param  {fileName} filename
 * @param  {content} filename content
 */
function addFile(fileName, content){
  automata[index] = {id:"file"+index, name:fileName, dot:content};
  document.getElementById("input").value = "";
  var listFiles = document.getElementsByClassName("listFiles").innerHTML;
  var buttonToAdd = "<li data-id='" + index +"' class='fileItem btn btn-success col-md-11'>" + automata[index].name + "</li><button data-id='" + index +"' class='btn btn-danger pull-right'>X</button>";
  var navTabToAdd = "<li><a data-toggle='tab' href='#file" + index + "'>" + automata[index].name + "</a></li>";
  var tabToAdd = "<div id='file" + index + "' class='tab-pane fade in'><div id='mynetwork" + index + "'></div></div>";
  $(".listFiles").append(buttonToAdd);
  $("#navtabs").append(navTabToAdd);
  $("#contentTabs").append(tabToAdd);
  $('#navtabs a:last').tab('show');
  var fa = read(content, "mynetwork" + index);

  if (fa != null) {
    var nfa = new NFA_to_DFA(fa);
    TreeProcess.hashmapFiles[fileName] = nfa.convert();
  }

  index++;
  fileListener();
}

/**
 * clearAll - clear all site information
 */
function clearAll(){
  automata = new Array();
  index = 1;
  $("#navtabs").empty();
  $("#contentTabs").empty();
  $(".listFiles").empty();
}
