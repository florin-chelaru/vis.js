/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/22/2015
 * Time: 3:12 PM
 */

goog.require('vs.ui.VisHandler');

goog.exportSymbol('vs.ui.VisHandler', vs.ui.VisHandler);
goog.exportProperty(vs.ui.VisHandler, 'Settings', vs.ui.VisHandler.Settings);
goog.exportProperty(vs.ui.VisHandler.prototype, 'optionValue', vs.ui.VisHandler.prototype.optionValue);
goog.exportProperty(vs.ui.VisHandler.prototype, 'scheduleRedraw', vs.ui.VisHandler.prototype.scheduleRedraw);
goog.exportProperty(vs.ui.VisHandler.prototype, 'schedulePreProcessData', vs.ui.VisHandler.prototype.schedulePreProcessData);

// Export for inheritance:

if (Object.getOwnPropertyDescriptor(vs.ui.VisHandler.prototype, 'draw') == undefined) {
  Object.defineProperty(vs.ui.VisHandler.prototype, 'draw', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this.draw; }),
    set: /** @type {function (this:vs.ui.VisHandler)} */ (function(value) { this.draw = value; })
  });
}

if (Object.getOwnPropertyDescriptor(vs.ui.VisHandler.prototype, 'preProcessData') == undefined) {
  Object.defineProperty(vs.ui.VisHandler.prototype, 'preProcessData', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this.preProcessData; }),
    set: /** @type {function (this:vs.ui.VisHandler)} */ (function(value) { this.preProcessData = value; })
  });
}

if (Object.getOwnPropertyDescriptor(vs.ui.VisHandler.prototype, 'beginDraw') == undefined) {
  Object.defineProperty(vs.ui.VisHandler.prototype, 'beginDraw', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this.beginDraw; }),
    set: /** @type {function (this:vs.ui.VisHandler)} */ (function(value) { this.beginDraw = value; })
  });
}

if (Object.getOwnPropertyDescriptor(vs.ui.VisHandler.prototype, 'endDraw') == undefined) {
  Object.defineProperty(vs.ui.VisHandler.prototype, 'endDraw', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this.endDraw; }),
    set: /** @type {function (this:vs.ui.VisHandler)} */ (function(value) { this.endDraw = value; })
  });
}

if (Object.getOwnPropertyDescriptor(vs.ui.VisHandler.prototype, 'highlightItem') == undefined) {
  Object.defineProperty(vs.ui.VisHandler.prototype, 'highlightItem', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this.highlightItem; }),
    set: /** @type {function (this:vs.ui.VisHandler)} */ (function(value) { this.highlightItem = value; })
  });
}

if (Object.getOwnPropertyDescriptor(vs.ui.VisHandler.prototype, 'unhighlightItem') == undefined) {
  Object.defineProperty(vs.ui.VisHandler.prototype, 'unhighlightItem', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this.unhighlightItem; }),
    set: /** @type {function (this:vs.ui.VisHandler)} */ (function(value) { this.unhighlightItem = value; })
  });
}
