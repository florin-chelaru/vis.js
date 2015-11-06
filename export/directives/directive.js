/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 7:08 PM
 */

goog.require('vs.directives.Directive');

goog.exportSymbol('vs.directives.Directive', vs.directives.Directive);

goog.exportProperty(vs.directives.Directive.prototype, 'link', vs.directives.Directive.prototype.link);
goog.exportProperty(vs.directives.Directive, 'createNew', vs.directives.Directive.createNew);

