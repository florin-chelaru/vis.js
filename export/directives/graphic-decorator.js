/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 9:03 AM
 */

goog.require('vs.directives.GraphicDecorator');

goog.exportSymbol('vs.directives.GraphicDecorator', vs.directives.GraphicDecorator);
goog.exportProperty(vs.directives.GraphicDecorator.prototype, 'link', vs.directives.GraphicDecorator.prototype.link);

// Export for inheritance:

if (Object.getOwnPropertyDescriptor(vs.directives.GraphicDecorator.prototype, 'createDecorator') == undefined) {
  Object.defineProperty(vs.directives.GraphicDecorator.prototype, 'createDecorator', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.directives.GraphicDecorator)} */ (function() { return this.createDecorator; }),
    set: /** @type {function (this:vs.directives.GraphicDecorator)} */ (function(value) { this.createDecorator = value; })
  });
}
