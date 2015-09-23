/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 8:59 AM
 */

goog.provide('vis.ui.svg.decorators.Grid');

goog.require('vis.ui.decorators.Grid');
goog.require('vis.ui.VisualizationOptions');

/**
 * @constructor
 * @extends vis.ui.decorators.Grid
 */
vis.ui.svg.decorators.Grid = function($scope, $element, $attrs, $targetElement) {
  vis.ui.decorators.Grid.apply(this, [$scope, $element, $attrs, $targetElement]);
};

goog.inherits(vis.ui.svg.decorators.Grid, vis.ui.decorators.Grid);

vis.ui.svg.decorators.Grid.prototype.draw = function() {
  var opts = this.visOptions;
  if (!opts) { return; }

  var svg = d3.select(this.targetElement[0]).select('svg');

  var type = this.type;
  var className = 'grid-' + type;
  var grid = svg.select('.' + className);
  if (grid.empty()) {
    grid = svg.insert('g', '.viewport')
      .attr('class', 'grid ' + className);
  }

  var scale = opts.scales[type];

  var gridLines = grid
    .selectAll('.grid-line')
    .data(scale.ticks(this.ticks));

  gridLines
    .enter().append('line')
    .attr('class', 'grid-line');

  var x1 = type == 'x' ? scale : 0;
  var x2 = type == 'x' ? scale : opts.width - opts.margins.left - opts.margins.right;
  var y1 = type == 'y' ? scale : 0;
  var y2 = type == 'y' ? scale : opts.height - opts.margins.top - opts.margins.bottom;

  gridLines
    .attr('transform', 'translate(' + opts.margins.left + ', ' + opts.margins.top + ')')
    .attr('x1', x1)
    .attr('x2', x2)
    .attr('y1', y1)
    .attr('y2', y2)
    .style('stroke', '#eeeeee')
    .style('shape-rendering', 'crispEdges');

  gridLines.exit().remove();
};
