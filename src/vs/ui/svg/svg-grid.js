/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 8:59 AM
 */

goog.provide('vs.ui.svg.SvgGrid');

goog.require('vs.ui.decorators.Grid');

/**
 * @constructor
 * @extends vs.ui.decorators.Grid
 */
vs.ui.svg.SvgGrid = function() {
  vs.ui.decorators.Grid.apply(this, arguments);
};

goog.inherits(vs.ui.svg.SvgGrid, vs.ui.decorators.Grid);

/**
 * @returns {Promise}
 */
vs.ui.svg.SvgGrid.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    vs.ui.decorators.Grid.prototype.endDraw.apply(self, args)
      .then(function() {
        if (!self.target['data']['isReady']) { resolve(); return; }

        var target = self.target;
        var svg = d3.select(target['$element'][0]).select('svg');

        var type = self.type;
        var className = 'grid-' + type;
        var grid = svg.select('.' + className);
        if (grid.empty()) {
          grid = svg.insert('g', '.viewport')
            .attr('class', className);
        }

        var height = target.height;
        var width = target.width;
        var margins = target.margins;
        var origins = {'x': margins['left'], 'y': height - margins['bottom']};

        var scale = (type == 'x') ? target.optionValue('xScale') : target.optionValue('yScale');
        if (!scale) { throw new vs.ui.UiException('Visualization must have "xScale"/"yScale" settings defined in order to use the Grid decorator'); }

        var gridLines = grid
          .selectAll('.grid-line')
          .data(scale.ticks(self.ticks));

        gridLines
          .enter().append('line')
          .attr('class', 'grid-line');

        var x1 = type == 'x' ? scale : 0;
        var x2 = type == 'x' ? scale : width - margins['left'] - margins['right'];
        var y1 = type == 'y' ? scale : 0;
        var y2 = type == 'y' ? scale : height - margins['top'] - margins['bottom'];

        gridLines
          .attr('transform', 'translate(' + margins['left'] + ', ' + margins['top'] + ')')
          .attr('x1', x1)
          .attr('x2', x2)
          .attr('y1', y1)
          .attr('y2', y2)
          .style('stroke', '#eeeeee')
          .style('shape-rendering', 'crispEdges');

        gridLines.exit().remove();
        resolve();
      }, reject);
  });
};
