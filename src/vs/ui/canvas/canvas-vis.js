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

Object.defineProperties(vs.ui.canvas.CanvasVis.prototype, {
  'render': { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return 'canvas'; })},
  'settings': { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return vs.ui.canvas.CanvasVis.Settings; })},
  'doubleBuffer': {
    get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this.optionValue('doubleBuffer'); }),
    set: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function(value) { return this['options']['doubleBuffer'] = value; })
  },
  'pendingCanvas': { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this['doubleBuffer'] ? this['$element'].find('canvas').filter(':hidden') : this['$element'].find('canvas'); })},
  'activeCanvas': { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this['doubleBuffer'] ? this['$element'].find('canvas').filter(':visible') : this['$element'].find('canvas'); })}
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
        var pendingCanvas = self['pendingCanvas'];
        if (pendingCanvas.length == 0) {
          var format = goog.string.format('<canvas width="%s" height="%s" style="display: %%s"></canvas>',
            /** @type {number} */ (self.optionValue('width')), /** @type {number} */ (self.optionValue('height')));
          $(goog.string.format(format, 'block') + (self['doubleBuffer'] ? goog.string.format(format, 'none') : '')).appendTo(self['$element']);
          pendingCanvas = self['pendingCanvas'];
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
    var activeCanvas = self['activeCanvas'];
    var pendingCanvas = self['pendingCanvas'];
    activeCanvas.css({ 'display': 'none' });
    pendingCanvas.css({ 'display': 'block' });
    resolve();
  }).then(function() {
    return vs.ui.VisHandler.prototype.endDraw.apply(self, args);
  });
};

/**
 * @param {number} x
 * @param {number} y
 * @returns {Array.<vs.models.DataRow>}
 */
vs.ui.canvas.CanvasVis.prototype.getItemsAt = function(x, y) { return []; };

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
