/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/11/2015
 * Time: 5:51 PM
 */

goog.provide('vs.ui.canvas.CanvasGrid');

goog.require('vs.ui.decorators.Grid');
goog.require('vs.models.Transformer');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.decorators.Grid
 */
vs.ui.canvas.CanvasGrid = function($ng, $targetElement, target, options) {
  vs.ui.decorators.Grid.apply(this, arguments);
};

goog.inherits(vs.ui.canvas.CanvasGrid, vs.ui.decorators.Grid);

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.canvas.CanvasGrid.Settings = u.extend({}, vs.ui.decorators.Grid.Settings);

Object.defineProperties(vs.ui.canvas.CanvasGrid.prototype, {
  'settings': { get: /** @type {function (this:vs.ui.canvas.CanvasGrid)} */ (function() { return vs.ui.canvas.CanvasGrid.Settings; })}
});

vs.ui.canvas.CanvasGrid.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    if (!vs.models.DataSource.allDataIsReady(self['target']['data'])) { resolve(); return; }

    var target = self['target'];
    var type = self.type;
    var margins = target['margins'];
    var height = target['height'];
    var width = target['width'];
    var intCoords = vs.models.Transformer.intCoords();
    var translate = vs.models.Transformer
      .translate({'x': margins['left'], 'y': margins['top']})
      .intCoords();

    var context = target['pendingCanvas'][0].getContext('2d');
    var moveTo = context.__proto__.moveTo;
    var lineTo = context.__proto__.lineTo;

    var scale = (type == 'x') ? target.optionValue('xScale') : target.optionValue('yScale');
    if (!scale) { throw new vs.ui.UiException('Visualization must have "xScale"/"yScale" settings defined in order to use the Grid decorator'); }

    context.strokeStyle = '#eeeeee';
    context.lineWidth = 1;

    var ticks = scale.ticks(self['ticks']);

    // Draw ticks
    var x1 = type == 'x' ? scale : function() { return 0; };
    var x2 = type == 'x' ? scale : function() { return width - margins['left'] - margins['right']; };
    var y1 = type == 'y' ? scale : function() { return 0; };
    var y2 = type == 'y' ? scale : function() { return height - margins['top'] - margins['bottom']; };

    u.fast.forEach(ticks, function(tick) {
      moveTo.apply(context, translate.calcArr({'x': x1(tick), 'y': y1(tick)}));
      lineTo.apply(context, translate.calcArr({'x': x2(tick), 'y': y2(tick)}));
    });


    context.stroke();
    resolve();
  }).then(function() {
    return vs.ui.decorators.Grid.prototype.endDraw.apply(self, args);
  });
};
