/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/11/2015
 * Time: 5:51 PM
 */

goog.provide('vis.ui.canvas.decorators.Axis');

goog.require('vis.ui.Decorator');
goog.require('vis.ui.VisualizationOptions');

/**
 * @constructor
 * @extends vis.ui.Decorator
 */
vis.ui.canvas.decorators.Axis = function($scope, $element, $attrs, $targetElement) {
  vis.ui.Decorator.apply(this, [$scope, $element, $attrs, $targetElement]);

};

goog.inherits(vis.ui.canvas.decorators.Axis, vis.ui.Decorator);

/**
 * @type {{x: string, y: string}}
 */
vis.ui.canvas.decorators.Axis.orientation = {
  x: 'bottom',
  y: 'left'
};

Object.defineProperties(vis.ui.canvas.decorators.Axis.prototype, {
  type: {
    get: function() { return this.scope.type; }
  },

  ticks: {
    get: function () { return this.scope.ticks || 10; }
  }
});

vis.ui.canvas.decorators.Axis.prototype.draw = function() {
  var opts = this.targetOptions;
  if (!opts) { return; }

  var type = this.type;
  var minMargin = 25;
  var offset = {top:0, bottom:0, left:0, right:0};

  if (type == 'x' && opts.margins.left < minMargin) { offset.left = minMargin - opts.margins.left; }
  else if (type == 'y' && opts.margins.bottom < minMargin) { offset.bottom = minMargin - opts.margins.bottom; }

  if (offset.top + offset.bottom + offset.left + offset.right > 0) {
    opts.margins = opts.margins.add(offset);
    return;
  }

  var context = this.visualization.pendingCanvas[0].getContext('2d');

  /*
   http://www.html5canvastutorials.com/labs/html5-canvas-graphing-an-equation/
   */

  var scale = opts.scales[type];

  context.save();
  context.beginPath();
  context.moveTo(opts.origins.x, opts.origins.y);

  switch (type) {
    case 'x':
      context.lineTo(opts.width - opts.margins.right, opts.origins.y);
      break;
    case 'y':
      context.lineTo(opts.origins.x, opts.margins.top);
      break;

  }

  //context.strokeStyle = '#000000';
  //context.lineWidth = 1;
  context.stroke();

  // draw tick marks
  /*var xPosIncrement = this.unitsPerTick * this.unitX;
  var xPos, unit;
  context.font = this.font;
  context.textAlign = 'center';
  context.textBaseline = 'top';

  // draw left tick marks
  xPos = this.centerX - xPosIncrement;
  unit = -1 * this.unitsPerTick;
  while(xPos > 0) {
    context.moveTo(xPos, this.centerY - this.tickSize / 2);
    context.lineTo(xPos, this.centerY + this.tickSize / 2);
    context.stroke();
    context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
    unit -= this.unitsPerTick;
    xPos = Math.round(xPos - xPosIncrement);
  }

  // draw right tick marks
  xPos = this.centerX + xPosIncrement;
  unit = this.unitsPerTick;
  while(xPos < this.canvas.width) {
    context.moveTo(xPos, this.centerY - this.tickSize / 2);
    context.lineTo(xPos, this.centerY + this.tickSize / 2);
    context.stroke();
    context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
    unit += this.unitsPerTick;
    xPos = Math.round(xPos + xPosIncrement);
  }
  context.restore();

  */



  /*var type = this.type;
  var className = 'axis-' + type;
  var axis = svg.select('.' + className);
  if (axis.empty()) {
    axis = svg.append('g')
      .attr('class', 'axis ' + className);
  }

  var scale = opts.scales[type];

  var axisFn = d3.svg.axis()
    .scale(scale)
    .orient(vis.ui.canvas.decorators.Axis.orientation[type])
    .ticks(this.ticks);

  axis.call(axisFn);

  var axisBox = axis[0][0].getBBox();
  var axisLocation = type == 'x' ? opts.origins : {x: opts.margins.left, y: opts.margins.top};
  axisBox = { x: axisBox.x + axisLocation.x, y: axisBox.y + axisLocation.y, width: axisBox.width, height: axisBox.height};

  var offset = {top:0, bottom:0, left:0, right:0};

  var dif;
  if (axisBox.height > opts.height) {
    dif = (axisBox.height - opts.height);
    offset.top += 0.5 * dif;
    offset.bottom += 0.5 * dif;
  }

  if (axisBox.width > opts.width) {
    dif = (axisBox.width - opts.width);
    offset.left += 0.5 * dif;
    offset.right += 0.5 * dif;
  }

  if (axisBox.x < 0) { offset.left += -axisBox.x; }
  if (axisBox.y < 0) { offset.top += -axisBox.y; }
  if (axisBox.x + axisBox.width > opts.width) { offset.right += axisBox.x + axisBox.width - opts.width; }
  if (axisBox.y + axisBox.height > opts.height) { offset.bottom += axisBox.y + axisBox.height - opts.height; }

  opts.margins = opts.margins.add(offset);

  axis.attr('transform', 'translate(' + axisLocation.x + ', ' + axisLocation.y + ')');*/
};

