/**
 * openEditor - Slide editor
 */
function openEditor() {
    $('#editorW').slideToggle("fast");
    $('#openEditor').slideToggle("fast");
}

var imported = document.createElement('script');
document.head.appendChild(imported);

/**
 * loadEditor - Load textarea from editor
 */
function loadEditor() {
  deleteAutomataResult();

    if (automata == null || automata.length <= 0) {
      errorMsg("So the code can work, it's necessary to upload at least one file.");
      return;
    }

    $(function () {
        lines = document.getElementById("editor").value;

        $(':input:not(#editor)').val('');
        $('#in').val('');
        $('#intable').empty();
        $('#rowToClone tr:not(:first)').not(function () {
            if ($(this).has('th').length) {
                return true;
            }
        }).remove();

        //Start the lexical analysis
        var sequence = start(lines);

        //Start the syntatic and semantic
        var syntax = new Syntactic(sequence);

        if (syntax == null || syntax.tree == null) {
          return;
        }

        //compute the tree
        var tree = new TreeProcess(syntax.tree);
        tree.compute();
    });
}
