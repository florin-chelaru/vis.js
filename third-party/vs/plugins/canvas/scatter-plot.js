/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 2:20 PM
 */

goog.provide('vs.plugins.canvas.ScatterPlot');

goog.require('vs.ui.canvas.CanvasVis');
goog.require('vs.models.DataRow');
goog.require('vs.models.Transformer');

/**
 * @constructor
 * @extends vs.ui.canvas.CanvasVis
 */
vs.plugins.canvas.ScatterPlot = function() {
  vs.ui.canvas.CanvasVis.apply(this, arguments);
};

goog.inherits(vs.plugins.canvas.ScatterPlot, vs.ui.canvas.CanvasVis);

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.plugins.canvas.ScatterPlot.Settings = u.extend({}, vs.ui.canvas.CanvasVis.Settings, {
  'vals': vs.ui.Setting.PredefinedSettings['vals'],
  'xBoundaries': vs.ui.Setting.PredefinedSettings['xBoundaries'],
  'yBoundaries': vs.ui.Setting.PredefinedSettings['yBoundaries'],
  'xScale': vs.ui.Setting.PredefinedSettings['xScale'],
  'yScale': vs.ui.Setting.PredefinedSettings['yScale'],
  'cols': vs.ui.Setting.PredefinedSettings['cols']
});

Object.defineProperties(vs.plugins.canvas.ScatterPlot.prototype, {
  settings: { get: /** @type {function (this:vs.plugins.canvas.ScatterPlot)} */ (function() { return vs.plugins.canvas.ScatterPlot.Settings; })}
});

vs.plugins.canvas.ScatterPlot.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    vs.ui.canvas.CanvasVis.prototype.endDraw.apply(self, args)
      .then(function() {
        var data = self.data;
        if (!self.data.isReady) { return; }

        // Nothing to draw
        if (!data.nrows) { return; }

        var margins = self.optionValue('margins');
        var xScale = self.optionValue('xScale');
        var yScale = self.optionValue('yScale');
        var cols = self.optionValue('cols');
        var xCol = cols[0];
        var yCol = cols[1];
        var valsLabel = self.optionValue('vals');

        var context = self.pendingCanvas[0].getContext('2d');

        var transform =
          vs.models.Transformer
            .scale(xScale, yScale)
            .translate({x: margins.left, y: margins.top});
        var items = u.array.range(data.nrows).map(function(i) {
          return new vs.models.DataRow(data, i);
        });

        items.forEach(function(d) {
          var point = transform.calc({x: d.val(xCol, valsLabel), y: d.val(yCol, valsLabel)});
          vs.ui.canvas.CanvasVis.circle(context, point.x, point.y, 3, '#ff6520');
        });

        resolve();
      }, reject);
  });
};
