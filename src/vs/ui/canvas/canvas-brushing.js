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

  /**
   * @type {jQuery}
   * @private
   */
  this._brushingCanvas = null;
};

goog.inherits(vs.ui.canvas.CanvasBrushing, vs.ui.decorators.Brushing);

vs.ui.canvas.CanvasBrushing.prototype.beginDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    vs.ui.decorators.Brushing.prototype.beginDraw.apply(self, args).then(function() {

      resolve();
    });
  });
};

vs.ui.canvas.CanvasBrushing.prototype.endDraw = function() {
  var self = this;
  var args = arguments;

  if (this._initialized == null) {
    this._initialized = new Promise(function(resolve, reject) {

      var target = self['target'];

      if (!self._brushingCanvas) {
        var canvas = goog.string.format('<canvas width="%s" height="%s" style="display: none; position: absolute; bottom: 0; left: 0;"></canvas>',
          /** @type {number} */ (target.optionValue('width')), /** @type {number} */ (target.optionValue('height')));

        self._brushingCanvas = $(canvas);
        self._brushingCanvas.appendTo(target['$element']);
      }

      var activeCanvas = target['activeCanvas'][0];
      var selectedItem = null;
      var mousemove = function(evt) {
        var rect = activeCanvas.getBoundingClientRect();
        var mousePos = {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };

        var data = self['data'];

        var items = target.getItemsAt(mousePos.x, mousePos.y);
        if (selectedItem && (items.length == 0 || items[0] != selectedItem)) {
          self['brushing'].fire(new vs.ui.BrushingEvent(target, data, selectedItem, vs.ui.BrushingEvent.Action['MOUSEOUT']));
          selectedItem = null;
        }
        if (items.length > 0 && selectedItem != items[0]) {
          selectedItem = items[0];
          self['brushing'].fire(new vs.ui.BrushingEvent(target, data, items[0], vs.ui.BrushingEvent.Action['MOUSEOVER']));
        }
      };
      activeCanvas.addEventListener('mousemove', mousemove);
      self._brushingCanvas[0].addEventListener('mouseover', mousemove);
      self._brushingCanvas[0].addEventListener('mousemove', mousemove);

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

/**
 * @param {vs.ui.BrushingEvent} e
 */
vs.ui.canvas.CanvasBrushing.prototype.brush = function(e) {
  var target = this['target'];
  this._brushingCanvas
    .attr('width', target.optionValue('width'))
    .attr('height', target.optionValue('height'));

  var context = this._brushingCanvas[0].getContext('2d');
  context.drawImage(target['activeCanvas'][0], 0, 0);

  /*var target = this['target'];
  var svg = d3.select(target['$element'][0]).select('svg');
  var viewport = svg.empty() ? null : svg.select('.viewport');
  if (viewport == null || viewport.empty()) { return; }*/

  // TODO: Use LinkService!

  if (e['action'] == vs.ui.BrushingEvent.Action['MOUSEOVER']) {
    target.drawHighlightItem(this._brushingCanvas, e['selectedRow']);
    /*var items = viewport.selectAll('.vs-item').data([e['selectedRow']], vs.models.DataSource.key);
    items
      .style('stroke', '#ffc600')
      .style('stroke-width', '2');
    $(items[0]).appendTo($(viewport[0]));*/
    this._brushingCanvas.css('display', 'block');
  } else if (e['action'] == vs.ui.BrushingEvent.Action['MOUSEOUT']) {
    //this._brushingCanvas.css({ 'display': 'none' });
    /*viewport.selectAll('.vs-item').data([e['selectedRow']], vs.models.DataSource.key)
      .style('stroke', 'none');*/
  }
};
