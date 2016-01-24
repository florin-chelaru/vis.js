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

      var target = self['target'];
      var activeCanvas = target['activeCanvas'][0];
      var selectedItem = null;
      var mousemove = function(evt) {
        var rect = activeCanvas.getBoundingClientRect();
        var mousePos = {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };

        var data = self['data'];

        if (selectedItem) {
          self['brushing'].fire(new vs.ui.BrushingEvent(target, data, selectedItem, vs.ui.BrushingEvent.Action['MOUSEOUT']));
          selectedItem = null;
        }

        var items = target.getItemsAt(mousePos.x, mousePos.y);
        if (items.length > 0) {
          selectedItem = items[0];
          self['brushing'].fire(new vs.ui.BrushingEvent(target, data, items[0], vs.ui.BrushingEvent.Action['MOUSEOVER']));
        }
      };
      activeCanvas.addEventListener('mousemove', mousemove);

      if (target['doubleBuffer']) {
        var pendingCanvas = target['pendingCanvas'][0];
        pendingCanvas.addEventListener('mousemove', mousemove);
      }

      resolve();
    });
  }

  return this._initialized.then(function() {
    return vs.ui.decorators.Brushing.prototype.endDraw.apply(self, args);
  });
};
