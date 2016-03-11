/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 5:25 PM
 */

goog.provide('vs.ui.canvas.CanvasVis');

goog.require('vs.ui.VisHandler');

goog.require('goog.string.format');

/**
 * @constructor
 * @extends {vs.ui.VisHandler}
 */
vs.ui.canvas.CanvasVis = function () {
  vs.ui.VisHandler.apply(this, arguments);

  /**
   * @type {jQuery}
   * @private
   */
  this._pendingCanvas = null;

  /**
   * @type {jQuery}
   * @private
   */
  this._activeCanvas = null;

  /**
   * @type {jQuery}
   * @private
   */
  this._brushingCanvas = null;
};

goog.inherits(vs.ui.canvas.CanvasVis, vs.ui.VisHandler);

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.canvas.CanvasVis.Settings = u.extend({}, vs.ui.VisHandler.Settings, {
  'doubleBuffer': vs.ui.Setting.PredefinedSettings['doubleBuffer']
});

/**
 * @type {jQuery}
 * @name vs.ui.canvas.CanvasVis#pendingCanvas
 */
vs.ui.canvas.CanvasVis.prototype.pendingCanvas;

/**
 * @type {jQuery}
 * @name vs.ui.canvas.CanvasVis#activeCanvas
 */
vs.ui.canvas.CanvasVis.prototype.activeCanvas;

/**
 * @type {boolean}
 * @name vs.ui.canvas.CanvasVis#doubleBuffer
 */
vs.ui.canvas.CanvasVis.prototype.doubleBuffer;

/**
 * @type {jQuery}
 * @name vs.ui.canvas.CanvasVis#brushingCanvas
 */
vs.ui.canvas.CanvasVis.prototype.brushingCanvas;

Object.defineProperties(vs.ui.canvas.CanvasVis.prototype, {
  'render': { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return 'canvas'; })},
  'settings': { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return vs.ui.canvas.CanvasVis.Settings; })},
  'doubleBuffer': {
    get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this.optionValue('doubleBuffer'); }),
    set: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function(value) { return this['options']['doubleBuffer'] = value; })
  },
  'pendingCanvas': { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this._pendingCanvas; })},
  'activeCanvas': { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this['doubleBuffer'] ? this._activeCanvas : this._pendingCanvas; })},
  'brushingCanvas': {
    get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function () {
      return this._brushingCanvas;
    })
  }
});

/**
 * @returns {Promise}
 */
vs.ui.canvas.CanvasVis.prototype.beginDraw = function () {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    vs.ui.VisHandler.prototype.beginDraw.apply(self, args).then(
      function() {
        var pendingCanvas = self._pendingCanvas;
        var activeCanvas = self._activeCanvas;
        if (!pendingCanvas || !activeCanvas) {
          var format = goog.string.format('<canvas width="%s" height="%s" style="display: %%s"></canvas>',
            /** @type {number} */ (self.optionValue('width')), /** @type {number} */ (self.optionValue('height')));

          activeCanvas = $(goog.string.format(format, 'block')).appendTo(self['$element']);
          pendingCanvas = self['doubleBuffer'] ?  $(goog.string.format(format, 'none')).appendTo(self['$element']) : activeCanvas;

          self._pendingCanvas = pendingCanvas;
          self._activeCanvas = activeCanvas;

          self._initializeBrushing();
        }

        pendingCanvas
          .attr('width', self.optionValue('width'))
          .attr('height', self.optionValue('height'));

        var context = pendingCanvas[0].getContext('2d');
        context.translate(0.5,0.5);
        context.rect(0, 0, self.optionValue('width'), self.optionValue('height'));
        context.fillStyle = '#ffffff';
        context.fill();
        resolve();
      }, reject);
  });
};

/**
 * @returns {Promise}
 */
vs.ui.canvas.CanvasVis.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    if (!self['doubleBuffer']) { resolve(); return; }
    //var activeCanvas = self['activeCanvas'];
    //var pendingCanvas = self['pendingCanvas'];
    self._activeCanvas.css({'display': 'none'});
    self._pendingCanvas.css({ 'display': 'block' });
    //activeCanvas.css({ 'display': 'none' });
    //pendingCanvas.css({ 'display': 'block' });
    var aux = self._activeCanvas;
    self._activeCanvas = self._pendingCanvas;
    self._pendingCanvas = aux;
    resolve();
  }).then(function() {
    return vs.ui.VisHandler.prototype.endDraw.apply(self, args);
  });
};

/**
 * @param {number} x
 * @param {number} y
 * @returns {Array.<Object>}
 */
vs.ui.canvas.CanvasVis.prototype.getItemsAt = function(x, y) { return []; };

/**
 * @private
 */
vs.ui.canvas.CanvasVis.prototype._initializeBrushing = function() {
  var self = this;
  if (!this._brushingCanvas) {
    var canvas = goog.string.format('<canvas width="%s" height="%s" style="display: none; position: absolute; bottom: 0; left: 0;"></canvas>',
      /** @type {number} */ (this.optionValue('width')), /** @type {number} */ (this.optionValue('height')));

    this._brushingCanvas = $(canvas);
    this._brushingCanvas.appendTo(this['$element']);
  }

  var activeCanvas = this._activeCanvas[0];

  /** @type {Object.<string, Array.<Object>>|null} */
  var selectedItemsMap = null;

  /** @type {Array.<Object>} */
  var selectedItems = [];

  /**
   * If the number of selected items is smaller than this number, then we will check to see whether on
   * mousemove they have changed. Otherwise, we will trigger a MOUSEOUT and MOUSEOVER again.
   * @type {number}
   */
  var maxItemsCountCheck = 10;

  /** @type {Array.<vs.models.DataSource>} */
  var data = this['data'];

  /** @type {Object.<string|number, vs.models.DataSource>} */
  var dataMap = u.mapToObject(data, function(d) { return {'key': d['id'], 'value': d}});

  /** @param {MouseEvent} evt */
  var mousemove = function(evt) {
    /** @type {ClientRect} */
    var rect = activeCanvas.getBoundingClientRect();
    var mousePos = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };

    var items = self.getItemsAt(mousePos.x, mousePos.y);

    if (!items.length && !selectedItems.length) { return; }

    var selectedItemsChanged = false;
    if (items.length > maxItemsCountCheck || selectedItems.length > maxItemsCountCheck ||
        items.length != selectedItems.length) {
      selectedItemsChanged = true;
    }

    var i;
    if (!selectedItemsChanged) {
      for (i = 0; i < items.length; ++i) {
        if (selectedItems.indexOf(items[i]) < 0) {
          selectedItemsChanged = true;
          break;
        }
      }
    }

    if (!selectedItemsChanged) { return; }

    if (selectedItemsMap) {
      u.each(selectedItemsMap, function(dataId, items) {
        self['brushing'].fire(u.reflection.applyConstructor(/** @type {function(new: vs.ui.BrushingEvent)} */ (vs.ui.BrushingEvent), [dataMap[dataId], vs.ui.BrushingEvent.Action['MOUSEOUT']].concat(items)));
      });
      selectedItemsMap = null;
    }

    selectedItems = items;
    if (!items.length) { return; }

    selectedItemsMap = {};
    for (i = 0; i < items.length; ++i) {
      var item = items[i];
      var dataId = item['__d__'];
      var dataItems = selectedItemsMap[dataId];
      if (!dataItems) {
        dataItems = [];
        selectedItemsMap[dataId] = dataItems;
      }
      dataItems.push(item);
    }
    u.each(selectedItemsMap, function(dataId, items) {
      self['brushing'].fire(u.reflection.applyConstructor(/** @type {function(new: vs.ui.BrushingEvent)} */ (vs.ui.BrushingEvent), [dataMap[dataId], vs.ui.BrushingEvent.Action['MOUSEOVER']].concat(items)));
    });
  };

  activeCanvas.addEventListener('mousemove', mousemove);
  activeCanvas.addEventListener('mouseover', mousemove);
  activeCanvas.addEventListener('mouseout', mousemove);
  this._brushingCanvas[0].addEventListener('mouseover', mousemove);
  this._brushingCanvas[0].addEventListener('mousemove', mousemove);
  this._brushingCanvas[0].addEventListener('mouseout', mousemove);

  if (this['doubleBuffer']) {
    var pendingCanvas = this._pendingCanvas[0];
    pendingCanvas.addEventListener('mousemove', mousemove);
    pendingCanvas.addEventListener('mouseover', mousemove);
    pendingCanvas.addEventListener('mouseout', mousemove);
  }
};

/**
 * @param {CanvasRenderingContext2D} context
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 * @param {string} [fill]
 * @param {string} [stroke]
 * @param {number} [strokeWidth]
 */
vs.ui.canvas.CanvasVis.circle = function(context, cx, cy, r, fill, stroke, strokeWidth) {
  context.beginPath();
  context.arc(cx, cy, r, 0, 2 * Math.PI);

  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = strokeWidth || 0;
    context.stroke();
  }

  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }

  context.closePath();
};
