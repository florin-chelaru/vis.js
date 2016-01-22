/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/11/2015
 * Time: 5:51 PM
 */

goog.provide('vs.ui.canvas.CanvasBrushing');

goog.require('vs.ui.decorators.Brushing');
goog.require('vs.models.Transformer');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.decorators.Brushing
 */
vs.ui.canvas.CanvasBrushing = function($ng, $targetElement, target, options) {
  vs.ui.decorators.Brushing.apply(this, arguments);

  /**
   * @type {Promise}
   * @private
   */
  this._initialized = null;
};

goog.inherits(vs.ui.canvas.CanvasBrushing, vs.ui.decorators.Brushing);

vs.ui.canvas.CanvasBrushing.prototype.endDraw = function() {
  var self = this;
  var args = arguments;

  if (this._initialized == null) {
    this._initialized = new Promise(function(resolve, reject) {
      if (!self['data']['isReady']) { resolve(); return; }
      var target = self['target'];
      var data = self['data'];

      var activeCanvas = target['activeCanvas'][0];
      var mousemove = function(evt) {
        var rect = activeCanvas.getBoundingClientRect();
        var mousePos = {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };

        // And now, use the getItemsAt method.
        // TODO: Aici am ramas
      };
      activeCanvas.addEventListener('mousemove', mousemove);

      if (target['doubleBuffer']) {
        var pendingCanvas = target['pendingCanvas'][0];
        pendingCanvas.addListener('mousemove', mousemove);
      }
    });
  }

  return new Promise(function(resolve, reject) {






    var newItems = null;
    var viewport = d3.select(target['$element'][0]).select('svg').select('.viewport');
    if (!self._newDataItems) {
      newItems = viewport.selectAll('.vs-item');
    } else {
      newItems = viewport.selectAll('.vs-item').data(self._newDataItems, vs.models.DataSource.key);
    }

    newItems
      .on('mouseover', function (d) {
        self['brushing'].fire(new vs.ui.BrushingEvent(target, data, d, vs.ui.BrushingEvent.Action['MOUSEOVER']));
      })
      .on('mouseout', function (d) {
        self['brushing'].fire(new vs.ui.BrushingEvent(target, data, d, vs.ui.BrushingEvent.Action['MOUSEOUT']));
      })
      .on('click', function (d) {
        //self['brushing'].fire(new vs.ui.BrushingEvent(target, data, d, vs.ui.BrushingEvent.Action['SELECT']));
        d3.event.stopPropagation();
      });

    resolve();
  }).then(function() {
      return vs.ui.decorators.Brushing.prototype.endDraw.apply(self, args);
    });
};
