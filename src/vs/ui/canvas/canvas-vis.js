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
  render: { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return 'canvas'; })},
  settings: { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return vs.ui.canvas.CanvasVis.Settings; })},
  doubleBuffer: {
    get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this.optionValue('doubleBuffer'); }),
    set: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function(value) { return this.options['doubleBuffer'] = value; })
  },
  pendingCanvas: { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this.doubleBuffer ? this.$element.find('canvas').filter(':hidden') : this.$element.find('canvas'); })},
  activeCanvas: { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this.doubleBuffer ? this.$element.find('canvas').filter(':visible') : this.$element.find('canvas'); })}
});

/**
 * @returns {Promise}
 */
vs.ui.canvas.CanvasVis.prototype.beginDraw = function () {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    vs.ui.VisHandler.prototype.beginDraw.apply(self, args)
      .then(
      function() {
        var pendingCanvas = self.pendingCanvas;
        if (self.pendingCanvas.length == 0) {
          var format = goog.string.format('<canvas width="%s" height="%s" style="display: %%s"></canvas>', self.options.width, self.options.height);
          $(goog.string.format(format, 'block') + (self.doubleBuffer ? goog.string.format(format, 'none') : '')).appendTo(self.$element);
          pendingCanvas = self.pendingCanvas;
        }

        pendingCanvas
          .attr('width', self.options.width)
          .attr('height', self.options.height);

        var context = pendingCanvas[0].getContext('2d');
        context.translate(0.5,0.5);
        context.rect(0, 0, self.options.width, self.options.height);
        context.fillStyle = '#ffffff';
        context.fill();
        resolve();
      }, reject);
  });
};

vs.ui.canvas.CanvasVis.prototype.finalizeDraw = function() {
  if (!this.doubleBuffer) { return; }
  var activeCanvas = this.activeCanvas;
  var pendingCanvas = this.pendingCanvas;
  activeCanvas.css({ display: 'none' });
  pendingCanvas.css({ display: 'block' });
};

/**
 * @override
 */
vs.ui.canvas.CanvasVis.prototype.draw = function() {
  var self = this;
  return vs.ui.VisHandler.prototype.draw.apply(this, arguments)
    .then(function() { self.finalizeDraw(); });
};

/**
 * @param {CanvasRenderingContext2D} context
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 * @param {string} [fill]
 * @param {string} [stroke]
 */
vs.ui.canvas.CanvasVis.circle = function(context, cx, cy, r, fill, stroke) {
  context.beginPath();
  context.arc(cx, cy, r, 0, 2 * Math.PI);

  if (stroke) {
    context.strokeStyle = stroke;
    context.stroke();
  }

  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }

  context.closePath();
};
