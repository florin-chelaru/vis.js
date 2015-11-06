/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/27/2015
 * Time: 2:06 PM
 */

goog.require('vs.ui.Setting');

goog.exportSymbol('vs.ui.Setting', vs.ui.Setting);
goog.exportProperty(vs.ui.Setting.prototype, 'getValue', vs.ui.Setting.prototype.getValue);
goog.exportProperty(vs.ui.Setting.prototype, 'possibleValues', vs.ui.Setting.prototype.possibleValues);

goog.exportSymbol('vs.ui.Setting.Type', vs.ui.Setting.Type);

goog.exportProperty(vs.ui.Setting, 'valueBoundaries', vs.ui.Setting.valueBoundaries);
goog.exportProperty(vs.ui.Setting, 'rowBoundaries', vs.ui.Setting.rowBoundaries);
goog.exportProperty(vs.ui.Setting, 'firstColsLabel', vs.ui.Setting.firstColsLabel);
goog.exportProperty(vs.ui.Setting, 'firstRowsLabel', vs.ui.Setting.firstRowsLabel);
goog.exportProperty(vs.ui.Setting, 'firstValsLabel', vs.ui.Setting.firstValsLabel);
goog.exportProperty(vs.ui.Setting, 'xScale', vs.ui.Setting.xScale);
goog.exportProperty(vs.ui.Setting, 'yScale', vs.ui.Setting.yScale);

goog.exportProperty(vs.ui.Setting, 'PredefinedSettings', vs.ui.Setting.PredefinedSettings);
