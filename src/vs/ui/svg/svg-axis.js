/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:35 PM
 */

goog.provide('vs.ui.svg.SvgAxis');

goog.require('vs.ui.decorators.Axis');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.decorators.Axis
 */
vs.ui.svg.SvgAxis = function($ng, $targetElement, target, options) {
  vs.ui.decorators.Axis.apply(this, arguments);
};

goog.inherits(vs.ui.svg.SvgAxis, vs.ui.decorators.Axis);

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.svg.SvgAxis.Settings = u.extend({}, vs.ui.decorators.Axis.Settings);

Object.defineProperties(vs.ui.svg.SvgAxis.prototype, {
  'settings': { get: /** @type {function (this:vs.ui.svg.SvgAxis)} */ (function() { return vs.ui.svg.SvgAxis.Settings; })}
});

/**
 * @returns {Promise}
 */
vs.ui.svg.SvgAxis.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    if (!vs.models.DataSource.allDataIsReady(self['target']['data'])) { resolve(); return; }

    var target = self['target'];
    var svg = d3.select(target['$element'][0]).select('svg');
    var type = self.type;
    var className = 'vs-axis-' + type;
    var axis = svg.select('.' + className);
    if (axis.empty()) {
      axis = svg.insert('g', '.viewport')
        .attr('class', className);
    }

    var height = target['height'];
    var width = target['width'];
    var margins = target['margins'];
    var origins = {'x': margins['left'], 'y': height - margins['bottom']};

    var scale = (type == 'x') ? target.optionFunctionValue('xScale') : target.optionFunctionValue('yScale');
    if (!scale) { throw new vs.ui.UiException('Visualization must have "xScale"/"yScale" settings defined in order to use the Axis decorator'); }

    var axisFn = d3.svg.axis()
      .scale(scale)
      .orient(vs.ui.decorators.Axis.Orientation[type])
      .ticks(self['ticks']);

    if (self['format']) {
      axisFn = axisFn.tickFormat(d3.format(self['format']));
    }

    axis.call(axisFn);


    // Label

    var axisBox;

    var label = self['label'];
    if (label) {
      var labelEl = axis.select('.vs-label');
      if (labelEl.empty()) {
        axisBox = axis[0][0]['getBBox'](); // Closure compiler doesn't recognize the getBBox function
        labelEl = axis.append('text')
          .attr('class', 'vs-label')
          .attr('font-weight', 'bold')
          .attr('fill', '#000000')
          .attr('text-anchor', 'middle');

        if (type == 'x') {
          labelEl
            .attr('alignment-baseline', 'before-edge')
            .attr('y', axisBox['height']);
        } else {
          labelEl
            .attr('alignment-baseline', 'after-edge')
            .attr('transform', 'rotate(-90)translate(' + 0 + ',' + (-axisBox['width']) + ')');
        }
      }

      labelEl.text(label);

      if (type == 'x') {
        labelEl.attr('x', (width - margins['left'] - margins['right']) * 0.5);
      } else {
        var t = labelEl.attr('transform');
        labelEl
          .attr('transform', t.replace(/rotate\(([\d\-\.]+)\)translate\(([\d\-\.]+),\s*([\d\-\.]+)\)/, function(match, angle, x, y) { return 'rotate(' + angle + ')translate(' + (-(height - margins['top'] - margins['bottom']) / 2) + ',' + y + ')'; }));
      }
    }

    // End Label


    axisBox = axis[0][0]['getBBox'](); // Closure compiler doesn't recognize the getBBox function
    var axisLocation = type == 'x' ? origins : {'x': margins['left'], 'y': margins['top']};
    axisBox = { 'x': axisBox['x'] + axisLocation['x'], 'y': axisBox['y'] + axisLocation['y'], 'width': axisBox['width'], 'height': axisBox['height']};

    var offset = {'top':0, 'bottom':0, 'left':0, 'right':0};

    var dif;
    if (axisBox['height'] > height) {
      dif = (axisBox['height'] - height);
      offset['top'] += 0.5 * dif;
      offset['bottom'] += 0.5 * dif;
    }

    if (axisBox['width'] > width) {
      dif = (axisBox['width'] - width);
      offset['left'] += 0.5 * dif;
      offset['right'] += 0.5 * dif;
    }

    if (axisBox['x'] < 0) { offset['left'] += -axisBox['x']; }
    if (axisBox['y'] < 0) { offset['top'] += -axisBox['y']; }
    if (axisBox['x'] + axisBox['width'] > width) { offset['right'] += axisBox['x'] + axisBox['width'] - width; }
    if (axisBox['y'] + axisBox['height'] > height) { offset['bottom'] += axisBox['y'] + axisBox['height'] - height; }

    if (offset['top'] + offset['left'] + offset['bottom'] + offset['right'] > 0) {
      target['margins'] = target['margins'].add(offset);
      target.scheduleRedraw();
    }

    axis.attr('transform', 'translate(' + axisLocation['x'] + ', ' + axisLocation['y'] + ')');
    resolve();
  }).then(function() {
    return vs.ui.decorators.Axis.prototype.endDraw.apply(self, args);
  });
};
