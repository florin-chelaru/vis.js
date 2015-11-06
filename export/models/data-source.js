/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 1:43 PM
 */

goog.require('vs.models.DataSource');

goog.exportSymbol('vs.models.DataSource', vs.models.DataSource);
goog.exportProperty(vs.models.DataSource.prototype, 'applyQuery', vs.models.DataSource.prototype.applyQuery);
goog.exportProperty(vs.models.DataSource, 'singleQuery', vs.models.DataSource.singleQuery);
goog.exportProperty(vs.models.DataSource.prototype, 'getVals', vs.models.DataSource.prototype.getVals);
goog.exportProperty(vs.models.DataSource.prototype, 'getRow', vs.models.DataSource.prototype.getRow);
goog.exportProperty(vs.models.DataSource.prototype, 'getCol', vs.models.DataSource.prototype.getCol);
goog.exportProperty(vs.models.DataSource.prototype, 'valsIndex', vs.models.DataSource.prototype.valsIndex);
goog.exportProperty(vs.models.DataSource.prototype, 'colIndex', vs.models.DataSource.prototype.colIndex);
goog.exportProperty(vs.models.DataSource.prototype, 'rowIndex', vs.models.DataSource.prototype.rowIndex);
goog.exportProperty(vs.models.DataSource.prototype, 'raw', vs.models.DataSource.prototype.raw);
