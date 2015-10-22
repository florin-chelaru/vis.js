/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 5:25 PM
 */

goog.provide('vs.ui.canvas.CanvasVisualization');

goog.require('vs.ui.Visualization');
goog.require('vs.ui.VisualizationOptions');

goog.require('vs.models.DataSource');
goog.require('vs.models.RowDataItemWrapper');
goog.require('vs.models.Boundaries');
goog.require('vs.models.Margins');

goog.require('vs.ui.canvas');

goog.require('vs.async.TaskService');

goog.require('goog.string.format');

/**
 * @param scope
 * @param element
 * @param attrs
 * @param {vs.async.TaskService} taskService
 * @param {vs.ui.VisualizationOptions} options
 * @constructor
 * @extends vs.ui.Visualization
 */
vs.ui.canvas.CanvasVisualization = function (scope, element, attrs, taskService, options) {
  vs.ui.Visualization.apply(this, arguments);

  /**
   * @type {boolean}
   * @private
   */
  this._doubleBuffer = options.doubleBuffer;
};

goog.inherits(vs.ui.canvas.CanvasVisualization, vs.ui.Visualization);

Object.defineProperties(vs.ui.canvas.CanvasVisualization.prototype, {
  /**
   * @type {jQuery}
   * @instance
   * @memberof vs.ui.canvas.CanvasVisualization
   */
  pendingCanvas: { get: function() { return this._doubleBuffer ? this.element.find('canvas').filter(':hidden') : this.element.find('canvas'); } },

  /**
   * @type {jQuery}
   * @instance
   * @memberof vs.ui.canvas.CanvasVisualization
   */
  activeCanvas: { get: function() { return this._doubleBuffer ? this.element.find('canvas').filter(':visible') : this.element.find('canvas'); } }
});

/**
 * @override
 */
vs.ui.canvas.CanvasVisualization.prototype.preDraw = function () {
  vs.ui.Visualization.prototype.preDraw.apply(this, arguments);

  // console.log('Canvas.preDraw');

  var pendingCanvas = this.pendingCanvas;
  if (this.pendingCanvas.length == 0) {
    var format = goog.string.format('<canvas width="%s" height="%s" style="display: %%s"></canvas>', this.options.width, this.options.height);
    $(goog.string.format(format, 'block') + (this._doubleBuffer ? goog.string.format(format, 'none') : '')).appendTo(this.element);
    pendingCanvas = this.pendingCanvas;
  }

  pendingCanvas
    .attr('width', this.options.width)
    .attr('height', this.options.height);

  var context = pendingCanvas[0].getContext('2d');
  context.translate(0.5,0.5);
  context.rect(0, 0, this.options.width, this.options.height);
  context.fillStyle = '#ffffff';
  context.fill();
};

/**
 * @override
 */
vs.ui.canvas.CanvasVisualization.prototype.draw = function () {
  vs.ui.Visualization.prototype.draw.apply(this, arguments);

  // console.log('Canvas.draw');
};

/**
 */
vs.ui.canvas.CanvasVisualization.prototype.finalizeDraw = function() {
  // console.log('Canvas.finalizeDraw');
  if (!this._doubleBuffer) { return; }
  var activeCanvas = this.activeCanvas;
  var pendingCanvas = this.pendingCanvas;
  activeCanvas.css({ display: 'none' });
  pendingCanvas.css({ display: 'block' });
};

/**
 * @override
 */
vs.ui.canvas.CanvasVisualization.prototype.doDraw = function() {
  // TODO: Change back once we've figured out how to bind these actions together
  // TODO: Currently, grid drawing seems to be ok but axis is not
  var self = this;
  if (!this._lastDraw.hasFired()) { return; }
  vs.ui.Visualization.prototype.doDraw.call(this)
    .then(function() { self.finalizeDraw(); });
  /*vs.ui.Visualization.prototype.doDraw.call(this);
  this.finalizeDraw();*/
};
