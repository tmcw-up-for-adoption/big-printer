/* global big, phantom */

var page = require('webpage').create();
var system = require('system');
var args = system.args;

var bigURL = args[1];
var format = args[2] || 'png';

var dimensions = (args.length == 5) ?
    [args[3], args[4]].map(function(n) { return parseInt(n, 10); }) :
    [2560, 1440];

console.log('big printer!');
console.log('saving ' + bigURL + ' for posterity forever');
console.log('as ' + format + ' at ' + dimensions.join('x') + '\n');

page.viewportSize = { width: dimensions[0], height: dimensions[1] };

function leftPad(str, width) {
    var char = '0';
    str = str.toString();
    while (str.length < width) str = char + str;
    return str;
}

page.open(bigURL, function() {
  var slideCount = page.evaluate(function() { return big.length; });
  console.log('presentation has ' + slideCount + ' slides!');
  function getSlide(i) {
      if (i >= slideCount) {
          return phantom.exit();
      } else {
          page.evaluate(new Function('big.go(' + i + ')'));
          setTimeout(function() {
              console.log('page ' + (i + 1) + '...');
              page.render('page-' + leftPad(i, 4) + '.' + format, {
                  format: format
              });
              getSlide(++i);
          }, 500);
      }
  }
  getSlide(0);
});
