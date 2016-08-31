this.TOKENS = {
  OPEN : {img: /^\(/g},
  CLOSE : {img: /^\)/g},
  MULTIPLY : {img: /^\x/g},
  CONCATENATE : {img: /^\./g},
  COMPLEMENT : {img: /^not/g},
  REVERSE : {img: /^rev/g},
  INTERSECTION : {img: /^int/g},
  UNION : {img: /^\+/g},
  EQUAL : {img: /^=/g},
  SEMI_COLON : {img: /^;/g},
  NEW : {img: /^new/g},
  QUOTE : {img: /^\"/g},
  DUMP : {img: /^dump/g},
  DECLARATION : {img: /^FA/g},
  IDENTIFIER : {img: /^[a-zA-Z][a-zA-Z0-9\-_]*/g},
  FILENAME : {img: /^[a-zA-Z0-9][a-zA-Z0-9_\- \.]*\.dot/g}
};

/**
 * var - constructor of the token
 *
 * @param  {String} id  token's id
 * @param  {String} img token's image
 */
var Token = function(id, img) {
  this.id = id;
  this.img = img;
};

/**
 * Token.prototype.create - parse the code creating the tokens
 *
 * @param  {String} code lines of the code
 * @return {integer}      longest match
 */
Token.prototype.create = function(code) {
  var biggestMatch = 0;

  for (var tk in TOKENS) {
    var prop = TOKENS[tk];
    //thank this line of code to the bad design of javascript
    //http://stackoverflow.com/questions/2851308/why-does-my-javascript-regex-test-give-alternating-results
    //http://stackoverflow.com/questions/2630418/javascript-regex-returning-true-then-false-then-true-etc
    prop.img.lastIndex = 0;
    if (prop.img.test(code)) {
      if (biggestMatch < prop.img.lastIndex) {
        biggestMatch = prop.img.lastIndex;
        this.id = prop;
        this.img = code.substring(0, biggestMatch);
      }
    }
  }

  return biggestMatch;
};
