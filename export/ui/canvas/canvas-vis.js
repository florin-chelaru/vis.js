/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 5:25 PM
 */

goog.require('vs.ui.canvas.CanvasVis');

goog.exportSymbol('vs.ui.canvas.CanvasVis', vs.ui.canvas.CanvasVis);
goog.exportProperty(vs.ui.canvas.CanvasVis, 'Settings', vs.ui.canvas.CanvasVis.Settings);
goog.exportProperty(vs.ui.canvas.CanvasVis, 'circle', vs.ui.canvas.CanvasVis.circle);

// Export for inheritance:

if (Object.getOwnPropertyDescriptor(vs.ui.canvas.CanvasVis.prototype, 'beginDraw') == undefined) {
  Object.defineProperty(vs.ui.canvas.CanvasVis.prototype, 'beginDraw', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this.beginDraw; }),
    set: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function(value) { this.beginDraw = value; })
  });
}

if (Object.getOwnPropertyDescriptor(vs.ui.canvas.CanvasVis.prototype, 'endDraw') == undefined) {
  Object.defineProperty(vs.ui.canvas.CanvasVis.prototype, 'endDraw', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this.endDraw; }),
    set: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function(value) { this.endDraw = value; })
  });
}

if (Object.getOwnPropertyDescriptor(vs.ui.canvas.CanvasVis.prototype, 'getItemsAt') == undefined) {
  Object.defineProperty(vs.ui.canvas.CanvasVis.prototype, 'getItemsAt', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this.getItemsAt; }),
    set: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function(value) { this.getItemsAt = value; })
  });
}
