/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/4/2015
 * Time: 1:12 PM
 */

goog.provide('vs.ui.svg.SvgVis');

goog.require('vs.ui.VisHandler');

/**
 * @constructor
 * @extends vs.ui.VisHandler
 */
vs.ui.svg.SvgVis = function () {
  vs.ui.VisHandler.apply(this, arguments);
};

goog.inherits(vs.ui.svg.SvgVis, vs.ui.VisHandler);

Object.defineProperties(vs.ui.svg.SvgVis.prototype, {
  'render': { get: /** @type {function (this:vs.ui.svg.SvgVis)} */ (function() { return 'svg'; })}
});

vs.ui.svg.SvgVis.prototype.beginDraw = function () {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    vs.ui.VisHandler.prototype.beginDraw.apply(self, args)
      .then(function() {
        if (d3.select(self['$element'][0]).select('svg').empty()) {
          d3.select(self['$element'][0])
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .append('rect')
            .style('fill', '#ffffff')
            .attr('width', '100%')
            .attr('height', '100%');
        }
        resolve();
      }, reject);
  });
};
