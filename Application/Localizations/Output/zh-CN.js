;(function() {
  var localizations = {
    'INDEX__GAME_DESCRIPTION': function anonymous(it) {
      return 'KEY_NOT_TRANSLATED: INDEX__GAME_DESCRIPTION';
    }
  };
  
  function l(key) {
    if(!(key in localizations)) {
      return 'KEY_NOT_IN_SOURCE: ' + key;
    }
    return localizations[key].call(undefined, arguments[1]);
  };
  
  function lci(operand1, operand2) {
    operand1 = operand1 + '';
    operand2 = operand2 + '';
    operand1LastNumber = operand1.substr(-1,1);
    return operand1LastNumber === operand2;
  };

  if(typeof require === "function" && typeof exports === 'object' && typeof module === 'object') {
    module.exports = l;
  }
  else if (typeof define === "function" && define.amd) {
    define(function() {
      return l;
    });
  }
  else {
    window.l = l;
  }
})();
