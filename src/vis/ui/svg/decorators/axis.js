/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:35 PM
 */

goog.provide('vis.ui.svg.decorators.Axis');

goog.require('vis.ui.Decorator');
goog.require('vis.ui.VisualizationOptions');

/**
 * @constructor
 * @extends vis.ui.Decorator
 */
vis.ui.svg.decorators.Axis = function($scope, $element, $attrs, $targetElement) {
  vis.ui.Decorator.apply(this, [$scope, $element, $attrs, $targetElement]);

};

goog.inherits(vis.ui.svg.decorators.Axis, vis.ui.Decorator);

/**
 * @type {{x: string, y: string}}
 */
vis.ui.svg.decorators.Axis.orientation = {
  x: 'bottom',
  y: 'left'
};

Object.defineProperties(vis.ui.svg.decorators.Axis.prototype, {
  type: {
    get: function() { return this.scope.type; }
  },

  ticks: {
    get: function () { return this.scope.ticks || 10; }
  }
});

vis.ui.svg.decorators.Axis.prototype.draw = function() {
  var opts = this.targetOptions;
  if (!opts) { return; }

  var svg = d3.select(this.targetElement[0]).select('svg');

  var type = this.type;
  var className = 'axis-' + type;
  var axis = svg.select('.' + className);
  if (axis.empty()) {
    axis = svg.append('g')
      .attr('class', 'axis ' + className);
  }

  var scale = opts.scales[type];

  var axisFn = d3.svg.axis()
      .scale(scale)
      .orient(vis.ui.svg.decorators.Axis.orientation[type])
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

  axis.attr('transform', 'translate(' + axisLocation.x + ', ' + axisLocation.y + ')');
};
