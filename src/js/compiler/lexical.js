/**
 * start - start the lexical analysis
 *
 * @param  {String} code lines of code
 * @return {Seq}      sequence of tokens
 */
function start(code) {

  var sequence = new Seq();

  var initial = 0;

  try {
    while (initial < code.length) {
      if (code[initial] == ' ' || code[initial] == '\n' || code[initial] == '\r') {
        initial++;
        continue;
      }
      var subText = code.substring(initial, code.length);
      var token = new Token();
      var step = token.create(subText);
      if (step != 0) {
        sequence.add(token);
        initial += step;
      } else {
        throw "Invalid token: " + subText;
      }
    }
  } catch (err) {
    errorMsg(err);
  }

  return sequence;
};
