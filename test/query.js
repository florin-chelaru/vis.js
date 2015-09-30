/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/30/2015
 * Time: 2:51 PM
 */

goog.require('goog.math.Long');
goog.require('goog.async.Deferred');
goog.require('goog.string.format');
goog.require('bigwig.BigwigFile');

/**
 * @returns {Object.<string, string|Array.<string>>}
 */
var extractWindowLocationArgs = function() {
  var argsStr = window.location.search.length > 0 ? window.location.search.substr(1) : '';
  var argPairs = argsStr.split('&');

  var args = {};
  argPairs.forEach(function(pair, i) {
    if (pair.trim().length == 0) { return; }
    var arrInd = pair.indexOf('[]');
    if (arrInd == 0) { return; }

    var arg, val;
    var eqInd = pair.indexOf('=');
    if (eqInd < 0) {
      arg = (arrInd < 0) ? pair : pair.substr(0, arrInd);
      val = 'true';
    } else {
      arg = (arrInd < 0) ? pair.substr(0, eqInd) : pair.substr(0, arrInd);
      val = pair.substr(eqInd + 1);
    }

    arg = decodeURIComponent(arg);
    val = decodeURIComponent(val);

    if (arrInd < 0) { args[arg] = val; }
    else {
      if (!(arg in args)) { args[arg] = []; }
      args[arg].push(val);
    }
  });

  return args;
};

$(function() {
  var args = extractWindowLocationArgs();
  if (!args.file || !args.chr || !args.start || !args.end) {
    $('#result').text('Please specify valid file, chr, start and end');
    return;
  }
  var file = new bigwig.BigwigFile(args.file);
  file.query(args.chr, parseInt(args.start), parseInt(args.end))
    .then(function(d) {
      $('#result').text(JSON.stringify(d, function (k, v) {
        if (v instanceof bigwig.DataRecord) {
          return v.toJSON();
        }
        return v;
      }, 2));
    });
});
