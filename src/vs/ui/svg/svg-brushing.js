/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 1/8/2016
 * Time: 12:11 PM
 */

goog.provide('vs.ui.svg.SvgBrushing');

goog.require('vs.ui.decorators.Brushing');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.decorators.Brushing
 */
vs.ui.svg.SvgBrushing = function($ng, $targetElement, target, options) {
  vs.ui.decorators.Brushing.apply(this, arguments);

  /**
   * @type {Array.<vs.models.DataRow>}
   * @private
   */
  this._newDataItems = null;
};

goog.inherits(vs.ui.svg.SvgBrushing, vs.ui.decorators.Brushing);

/**
 * @returns {Promise}
 */
vs.ui.svg.SvgBrushing.prototype.beginDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    var target = self['target'];
    var svg = d3.select(target['$element'][0]).select('svg');
    var viewport = svg.empty() ? null : svg.select('.viewport');
    if (viewport == null || viewport.empty()) {
      // In this case, all items are new, so we return immediately
      self._newDataItems = null;
      resolve();
      return;
    }

    var items = self['data'].asDataRowArray();
    var newItems = viewport.selectAll('.vs-item').data(items, vs.models.DataSource.key).enter();
    self._newDataItems = newItems.empty() ? [] : newItems[0].filter(function(item) { return item; }).map(function(item) { return item['__data__']; });
    resolve();
  });
};

/**
 * @returns {Promise}
 */
vs.ui.svg.SvgBrushing.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    if (!self['data']['isReady']) { resolve(); return; }

    var target = self['target'];
    var data = self['data'];

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

/**
 * @param {vs.ui.BrushingEvent} e
 */
vs.ui.svg.SvgBrushing.prototype.brush = function(e) {
  var target = this['target'];
  var svg = d3.select(target['$element'][0]).select('svg');
  var viewport = svg.empty() ? null : svg.select('.viewport');
  if (viewport == null || viewport.empty()) { return; }

  // TODO: Use LinkService!

  if (e['action'] == vs.ui.BrushingEvent.Action['MOUSEOVER']) {
    var items = viewport.selectAll('.vs-item').data([e['selectedRow']], vs.models.DataSource.key);
    items
      .style('stroke', '#ffc600')
      .style('stroke-width', '2');
    $(items[0]).appendTo($(viewport[0]));
  } else if (e['action'] == vs.ui.BrushingEvent.Action['MOUSEOUT']) {
    viewport.selectAll('.vs-item').data([e['selectedRow']], vs.models.DataSource.key)
      .style('stroke', 'none');
  }
};
