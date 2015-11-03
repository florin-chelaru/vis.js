/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:35 PM
 */

goog.provide('vs.ui.svg.SvgAxis');

goog.require('vs.ui.decorators.Axis');

/**
 * @constructor
 * @extends vs.ui.decorators.Axis
 */
vs.ui.svg.SvgAxis = function() {
  vs.ui.decorators.Axis.apply(this, arguments);
};

goog.inherits(vs.ui.svg.SvgAxis, vs.ui.decorators.Axis);

/**
 * @returns {Promise}
 */
vs.ui.svg.SvgAxis.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    vs.ui.decorators.Axis.prototype.endDraw.apply(self, args)
      .then(function() {
        if (!self.target.data.isReady) { resolve(); return; }

        var target = self.target;
        var svg = d3.select(target.$element[0]).select('svg');
        var type = self.type;
        var className = 'vs-axis-' + type;
        var axis = svg.select('.' + className);
        if (axis.empty()) {
          axis = svg.insert('g', '.viewport')
            .attr('class', className);
        }

        var height = target.height;
        var width = target.width;
        var margins = target.margins;
        var origins = {x: margins.left, y: height - margins.bottom};

        var scale = (type == 'x') ? target.optionValue('xScale') : target.optionValue('yScale');
        if (!scale) { throw new vs.ui.UiException('Visualization must have "xScale"/"yScale" settings defined in order to use the Axis decorator'); }

        var axisFn = d3.svg.axis()
          .scale(scale)
          .orient(vs.ui.decorators.Axis.Orientation[type])
          .ticks(self.ticks);

        if (self.format) {
          axisFn = axisFn.tickFormat(d3.format(self.format));
        }

        axis.call(axisFn);

        var axisBox = axis[0][0].getBBox();
        var axisLocation = type == 'x' ? origins : {x: margins.left, y: margins.top};
        axisBox = { x: axisBox.x + axisLocation.x, y: axisBox.y + axisLocation.y, width: axisBox.width, height: axisBox.height};

        var offset = {top:0, bottom:0, left:0, right:0};

        var dif;
        if (axisBox.height > height) {
          dif = (axisBox.height - height);
          offset.top += 0.5 * dif;
          offset.bottom += 0.5 * dif;
        }

        if (axisBox.width > width) {
          dif = (axisBox.width - width);
          offset.left += 0.5 * dif;
          offset.right += 0.5 * dif;
        }

        if (axisBox.x < 0) { offset.left += -axisBox.x; }
        if (axisBox.y < 0) { offset.top += -axisBox.y; }
        if (axisBox.x + axisBox.width > width) { offset.right += axisBox.x + axisBox.width - width; }
        if (axisBox.y + axisBox.height > height) { offset.bottom += axisBox.y + axisBox.height - height; }

        target.margins = target.margins.add(offset);
        target.scheduleRedraw();

        axis.attr('transform', 'translate(' + axisLocation.x + ', ' + axisLocation.y + ')');
        resolve();
      }, reject);
  });
};
