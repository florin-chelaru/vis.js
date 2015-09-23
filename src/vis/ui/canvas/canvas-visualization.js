/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 5:25 PM
 */

goog.provide('vis.ui.canvas.CanvasVisualization');

goog.require('vis.ui.Visualization');
goog.require('vis.ui.VisualizationOptions');
goog.require('vis.utils');

goog.require('vis.models.DataSource');
goog.require('vis.models.RowDataItemWrapper');
goog.require('vis.models.Boundaries');
goog.require('vis.models.Margins');

goog.require('vis.ui.canvas');

goog.require('vis.async.TaskService');

goog.require('goog.string.format');

/**
 * @param scope
 * @param element
 * @param attrs
 * @param {vis.async.TaskService} taskService
 * @param {vis.ui.VisualizationOptions} options
 * @constructor
 * @extends vis.ui.Visualization
 */
vis.ui.canvas.CanvasVisualization = function (scope, element, attrs, taskService, options) {
  vis.ui.Visualization.apply(this, arguments);

  /**
   * @type {boolean}
   * @private
   */
  this._doubleBuffer = options.doubleBuffer;
};

goog.inherits(vis.ui.canvas.CanvasVisualization, vis.ui.Visualization);

Object.defineProperties(vis.ui.canvas.CanvasVisualization.prototype, {
  /**
   * @type {jQuery}
   * @instance
   * @memberof vis.ui.canvas.CanvasVisualization
   */
  pendingCanvas: { get: function() { return this._doubleBuffer ? this.element.find('canvas').filter(':hidden') : this.element.find('canvas'); } },

  /**
   * @type {jQuery}
   * @instance
   * @memberof vis.ui.canvas.CanvasVisualization
   */
  activeCanvas: { get: function() { return this._doubleBuffer ? this.element.find('canvas').filter(':visible') : this.element.find('canvas'); } }
});

/**
 * @override
 */
vis.ui.canvas.CanvasVisualization.prototype.preDraw = function () {
  vis.ui.Visualization.prototype.preDraw.apply(this, arguments);

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
vis.ui.canvas.CanvasVisualization.prototype.draw = function () {
  vis.ui.Visualization.prototype.draw.apply(this, arguments);
};

/**
 */
vis.ui.canvas.CanvasVisualization.prototype.finalizeDraw = function() {
  if (!this._doubleBuffer) { return; }
  var activeCanvas = this.activeCanvas;
  var pendingCanvas = this.pendingCanvas;
  activeCanvas.css({ display: 'none' });
  pendingCanvas.css({ display: 'block' });
};

/**
 * @override
 */
vis.ui.canvas.CanvasVisualization.prototype.doDraw = function() {
  // TODO: Change back once we've figured out how to bind these actions together
  // var self = this;
  // vis.ui.Visualization.prototype.doDraw.call(this)
  //   .then(function() { self.finalizeDraw(); });
  vis.ui.Visualization.prototype.doDraw.call(this);
  this.finalizeDraw();
};
