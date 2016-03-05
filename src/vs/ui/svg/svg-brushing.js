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
   * @type {Array.<Object>}
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

    var items = self['data'].map(function(d) { return d['d']; }).reduce(function(a1, a2) { return a1.concat(a2); });
    var newItems = viewport.selectAll('.vs-item').data(items, JSON.stringify).enter();
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
    if (!vs.models.DataSource.allDataIsReady(self['data'])) { resolve(); return; }

    var target = self['target'];
    var data = self['data'];

    var dataMap = {};
    data.forEach(function(d) { dataMap[d['id']] = d; });

    var newItems = null;
    var viewport = d3.select(target['$element'][0]).select('svg').select('.viewport');
    if (!self._newDataItems) {
      newItems = viewport.selectAll('.vs-item');
    } else {
      newItems = viewport.selectAll('.vs-item').data(self._newDataItems, JSON.stringify);
    }

    newItems
      .on('mouseover', function (d) {
        self['brushing'].fire(new vs.ui.BrushingEvent(target, dataMap[d['__d__']], vs.ui.BrushingEvent.Action['MOUSEOVER'], d));
      })
      .on('mouseout', function (d) {
        self['brushing'].fire(new vs.ui.BrushingEvent(target, dataMap[d['__d__']], vs.ui.BrushingEvent.Action['MOUSEOUT'], d));
      })
      .on('click', function (d) {
        // TODO
        d3.event.stopPropagation();
      });

    resolve();
  }).then(function() {
      return vs.ui.decorators.Brushing.prototype.endDraw.apply(self, args);
    });
};

/**
 * @param {vs.ui.BrushingEvent} e
 * @param {Array.<Object>} objects
 */
vs.ui.svg.SvgBrushing.prototype.brush = function(e, objects) {
  var target = this['target'];
  var svg = d3.select(target['$element'][0]).select('svg');
  var viewport = svg.empty() ? null : $(svg[0][0]).find('.viewport');
  if (viewport == null || viewport.length == 0) { return; }

  // TODO: Use LinkService!

  if (e['action'] == vs.ui.BrushingEvent.Action['MOUSEOVER']) {
    //target.highlightItem(viewport[0], e['selectedRow']);
    target.highlightItem(viewport[0], objects);
/*
    var items = viewport.selectAll('.vs-item').data([e['selectedRow']], vs.models.DataSource.key);
    items
      .style('stroke', selectStroke)
      .style('stroke-width', selectStrokeThickness)
      .style('fill', selectFill);
    $(items[0]).appendTo($(viewport[0]));*/
  } else if (e['action'] == vs.ui.BrushingEvent.Action['MOUSEOUT']) {
    // target.unhighlightItem(viewport[0], e['selectedRow']);
    target.unhighlightItem(viewport[0], objects);
    /*viewport.selectAll('.vs-item').data([e['selectedRow']], vs.models.DataSource.key)
      .style('stroke', stroke)
      .style('stroke-width', strokeThickness)
      .style('fill', fill);*/
  }
};
