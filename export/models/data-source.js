/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 1:43 PM
 */

goog.require('vs.models.DataSource');

goog.exportSymbol('vs.models.DataSource', vs.models.DataSource);
goog.exportProperty(vs.models.DataSource.prototype, 'filter', vs.models.DataSource.prototype.filter);
goog.exportProperty(vs.models.DataSource.prototype, 'raw', vs.models.DataSource.prototype.raw);
goog.exportProperty(vs.models.DataSource.prototype, 'getRowMetadata', vs.models.DataSource.prototype.getRowMetadata);

goog.exportProperty(vs.models.DataSource, 'singleQuery', vs.models.DataSource.singleQuery);
goog.exportProperty(vs.models.DataSource, 'combinedArrayMetadata', vs.models.DataSource.combinedArrayMetadata);
goog.exportProperty(vs.models.DataSource, 'allDataIsReady', vs.models.DataSource.allDataIsReady);

// Export for inheritance:

if (Object.getOwnPropertyDescriptor(vs.models.DataSource.prototype, 'applyQuery') == undefined) {
  Object.defineProperty(vs.models.DataSource.prototype, 'applyQuery', {
    configurable: true,
    enumerable: true,
    get: /** @type {function (this:vs.models.DataSource)} */ (function() { return this.applyQuery; }),
    set: /** @type {function (this:vs.models.DataSource)} */ (function(value) { this.applyQuery = value; })
  });
}
