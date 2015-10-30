/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 2:20 PM
 */

goog.provide('vs.plugins.canvas.ScatterPlot');

goog.require('vs.ui.canvas.CanvasVis');
goog.require('vs.models.DataRow');

/*goog.require('vs.models.DataSource');
goog.require('vs.models.RowDataItemWrapper');
goog.require('vs.models.Boundaries');
goog.require('vs.models.Margins');

goog.require('vs.ui.canvas');
goog.require('vs.models.Point');
goog.require('vs.models.Transformer');

goog.require('goog.async.Deferred');
goog.require('goog.array');*/

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

vs.plugins.canvas.ScatterPlot.prototype.beginDraw = function() {
  vs.ui.canvas.CanvasVis.prototype.beginDraw.apply(this, arguments);
};

/**
 * @override
 */
vs.plugins.canvas.ScatterPlot.prototype.endDraw = function() {
  vs.ui.canvas.CanvasVis.prototype.endDraw.apply(this, arguments);

  //console.log('scatterplot.endDraw');

  var data = this.data;
  if (!this.data.isReady) { return; }

  // Nothing to draw
  if (!data.nrows) { return; }

  var margins = this.optionValue('margins');
  var xScale = this.optionValue('xScale');
  var yScale = this.optionValue('yScale');
  var cols = this.optionValue('cols');
  var xCol = cols[0];
  var yCol = cols[1];

  var context = this.pendingCanvas[0].getContext('2d');

  var transform =
    vs.models.Transformer.scale(xScale, yScale)
      .combine(vs.models.Transformer.translate({x: margins.left, y: margins.top}));
  var items = u.array.range(data.nrows).map(function(i) {
    return new vs.models.DataRow(data, i);
  });

  items.forEach(function(d) {
    var point = transform.calc({x: d.val(xCol), y: d.val(yCol)});
    vs.ui.canvas.CanvasVis.circle(context, point.x, point.y, 10, '#ff6520')
  });
};
