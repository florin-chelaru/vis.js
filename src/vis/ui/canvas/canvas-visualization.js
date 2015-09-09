/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 5:25 PM
 */

goog.provide('vis.ui.canvas.CanvasVisualization');

goog.require('vis.ui.Visualization');
goog.require('vis.utils');

goog.require('vis.models.DataSource');
goog.require('vis.models.RowDataItemWrapper');
goog.require('vis.models.Boundaries');
goog.require('vis.models.Margins');

/**
 * @param scope
 * @param element
 * @param attrs
 * @constructor
 * @extends vis.ui.Visualization
 */
vis.ui.canvas.CanvasVisualization = function (scope, element, attrs) {
  vis.ui.Visualization.call(this, scope, element, attrs);
};

goog.inherits(vis.ui.canvas.CanvasVisualization, vis.ui.Visualization);

vis.ui.canvas.CanvasVisualization.prototype.preDraw = function () {
  vis.ui.Visualization.prototype.preDraw.apply(this, arguments);

  if (this.element.find('canvas').length == 0) {
    this.element
      .append('<canvas width="' + this.options.width + '" height="' + this.options.height + '"></canvas>');
  }
};

/**
 * @override
 */
vis.ui.canvas.CanvasVisualization.prototype.draw = function () {
  vis.ui.Visualization.prototype.draw.apply(this, arguments);

  var canvas = this.element.find('canvas');

  canvas
    .attr('width', this.options.width)
    .attr('height', this.options.height);

  var context = canvas[0].getContext('2d');
  context.rect(0, 0, this.options.width, this.options.height);
  context.fillStyle = '#ffffff';
  context.fill();
};
