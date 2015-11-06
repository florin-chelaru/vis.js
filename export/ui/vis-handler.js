/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/22/2015
 * Time: 3:12 PM
 */

goog.require('vs.ui.VisHandler');

goog.exportSymbol('vs.ui.VisHandler', vs.ui.VisHandler);
goog.exportProperty(vs.ui.VisHandler, 'Settings', vs.ui.VisHandler.Settings);
goog.exportProperty(vs.ui.VisHandler.prototype, 'optionValue', vs.ui.VisHandler.prototype.optionValue);
goog.exportProperty(vs.ui.VisHandler.prototype, 'beginDraw', vs.ui.VisHandler.prototype.beginDraw);
goog.exportProperty(vs.ui.VisHandler.prototype, 'endDraw', vs.ui.VisHandler.prototype.endDraw);
goog.exportProperty(vs.ui.VisHandler.prototype, 'draw', vs.ui.VisHandler.prototype.draw);
goog.exportProperty(vs.ui.VisHandler.prototype, 'scheduleRedraw', vs.ui.VisHandler.prototype.scheduleRedraw);
