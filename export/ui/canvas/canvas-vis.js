/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 5:25 PM
 */

goog.require('vs.ui.canvas.CanvasVis');

goog.exportSymbol('vs.ui.canvas.CanvasVis', vs.ui.canvas.CanvasVis);
goog.exportProperty(vs.ui.canvas.CanvasVis, 'Settings', vs.ui.canvas.CanvasVis.Settings);

goog.exportProperty(vs.ui.canvas.CanvasVis.prototype, 'beginDraw', vs.ui.canvas.CanvasVis.prototype.beginDraw);
goog.exportProperty(vs.ui.canvas.CanvasVis.prototype, 'finalizeDraw', vs.ui.canvas.CanvasVis.prototype.finalizeDraw);
goog.exportProperty(vs.ui.canvas.CanvasVis.prototype, 'draw', vs.ui.canvas.CanvasVis.prototype.draw);
goog.exportProperty(vs.ui.canvas.CanvasVis, 'circle', vs.ui.canvas.CanvasVis.circle);
