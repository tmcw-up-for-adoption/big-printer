/* global big, phantom */

var page = require('webpage').create();
var system = require('system');
var args = system.args;

if (!args[1]) throw new Error('needs URL');
if (!args[2]) throw new Error('needs output path');

function leftPad(str, width) {
  var char = '0';
  str = str.toString();
  while (str.length < width) str = char + str;
  return str;
}

page.viewportSize = { width: 1280, height: 720 };

page.open(args[1], function() {
  var slideCount = page.evaluate(function() { return big.length; });

  function getSlide(i) {
    if (i >= slideCount) {
      return phantom.exit();
    } else {
      page.onConsoleMessage = function(msg, lineNum, sourceId) {
        console.log('{"page":' + i + ',"message":' + JSON.stringify(msg) + '}');
      };
      page.evaluate(new Function('big.go(' + i + ')'));
      setTimeout(function() {
        page.render(args[2] + '/page-' + leftPad(i, 4) + '.' + 'png', { format: 'png' });
        getSlide(++i);
      }, 500);
    }
  }
  getSlide(0);
});
