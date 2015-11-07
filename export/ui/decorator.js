/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:39 PM
 */

goog.require('vs.ui.Decorator');
goog.exportSymbol('vs.ui.Decorator', vs.ui.Decorator);

goog.exportProperty(vs.ui.Decorator.prototype, 'optionValue', vs.ui.Decorator.prototype.optionValue);

// Export for inheritance:

if (Object.getOwnPropertyDescriptor(vs.ui.Decorator.prototype, 'beginDraw') == undefined) {
  Object.defineProperty(vs.ui.Decorator.prototype, 'beginDraw', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this.beginDraw; }),
    set: /** @type {function (this:vs.ui.Decorator)} */ (function(value) { this.beginDraw = value; })
  });
}

if (Object.getOwnPropertyDescriptor(vs.ui.Decorator.prototype, 'endDraw') == undefined) {
  Object.defineProperty(vs.ui.Decorator.prototype, 'endDraw', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this.endDraw; }),
    set: /** @type {function (this:vs.ui.Decorator)} */ (function(value) { this.endDraw = value; })
  });
}
