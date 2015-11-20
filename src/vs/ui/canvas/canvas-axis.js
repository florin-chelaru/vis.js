/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/11/2015
 * Time: 5:51 PM
 */

goog.provide('vs.ui.canvas.CanvasAxis');

goog.require('vs.ui.decorators.Axis');
goog.require('vs.models.Transformer');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.decorators.Axis
 */
vs.ui.canvas.CanvasAxis = function($ng, $targetElement, target, options) {
  vs.ui.decorators.Axis.apply(this, arguments);
};

goog.inherits(vs.ui.canvas.CanvasAxis, vs.ui.decorators.Axis);

/**
 * @returns {Promise}
 */
vs.ui.canvas.CanvasAxis.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    if (!self['target']['data']['isReady']) { resolve(); return; }

    var target = self['target'];
    var type = self.type;
    var minYMargin = 25;
    var offset = {'top':0, 'bottom':0, 'left':0, 'right':0};

    if (type == 'x' && target['margins']['bottom'] < minYMargin) { offset['bottom'] = minYMargin - target['margins']['bottom']; }

    if (offset['top'] + offset['bottom'] + offset['left'] + offset['right'] > 0) {
      target['margins'] = target['margins'].add(offset);
      target.scheduleRedraw();
      resolve();
      return;
    }

    var height = target['height'];
    var width = target['width'];
    var margins = target['margins'];
    var intCoords = vs.models.Transformer.intCoords();
    var translate = vs.models.Transformer
      .translate({'x': margins['left'], 'y': margins['top']})
      .intCoords();

    var context = target['pendingCanvas'][0].getContext('2d');
    var moveTo = context.__proto__.moveTo;
    var lineTo = context.__proto__.lineTo;

    var scale = (type == 'x') ? target.optionValue('xScale') : target.optionValue('yScale');
    if (!scale) { throw new vs.ui.UiException('Visualization must have "xScale"/"yScale" settings defined in order to use the Axis decorator'); }

    context.strokeStyle = '#000000';
    context.lineWidth = 1;
    context.font = '17px Times New Roman';
    context.fillStyle = '#000000';

    var ticks = scale.ticks(self['ticks']);
    var units = ticks.map(scale.tickFormat(self['ticks'], self['format']));

    var maxTextSize = Math.max.apply(null, units.map(function(unit) { return context.measureText(unit).width; }));

    var minXMargin = maxTextSize + 11;
    if (type == 'y' && margins['left'] < minXMargin) {
      offset['left'] = minXMargin - margins['left'];
      target['margins'] = margins.add(offset);
      target.scheduleRedraw();
      resolve();
      return;
    }

    var origins = {'x': margins['left'], 'y': height - margins['bottom']};

    // Draw main line
    context.beginPath();
    moveTo.apply(context, intCoords.calcArr(origins));
    switch (type) {
      case 'x': lineTo.apply(context, intCoords.calcArr({'x': width - margins['right'], 'y': origins['y']})); break;
      case 'y': lineTo.apply(context, intCoords.calcArr({'x': origins['x'], 'y': margins['top']})); break;
    }

    // Draw ticks
    var x1 = type == 'x' ? scale : function() { return 0; };
    var x2 = type == 'x' ? scale : function() { return -6; };
    var y1 = type == 'y' ? scale : function() { return height - margins['top'] - margins['bottom']; };
    var y2 = type == 'y' ? scale : function() { return height - margins['top'] - margins['bottom'] + 6; };

    ticks.forEach(function(tick) {
      moveTo.apply(context, translate.calcArr({'x': x1(tick), 'y': y1(tick)}));
      lineTo.apply(context, translate.calcArr({'x': x2(tick), 'y': y2(tick)}));
    });

    context.stroke();

    // Draw units
    if (type == 'x') {
      context.textAlign = 'center';
      context.textBaseline = 'top';
    } else {
      context.textAlign = 'right';
      context.textBaseline = 'middle';
      translate = translate.translate({'x': -5, 'y': 0});
    }

    units.forEach(function(unit, i) {
      var p = translate.calc({'x': x2(ticks[i]), 'y': y2(ticks[i])});
      context.fillText(unit, p['x'], p['y']);
    });
    resolve();
  }).then(function() {
    return vs.ui.decorators.Axis.prototype.endDraw.apply(self, args);
  });
};
