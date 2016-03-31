/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 1/6/2016
 * Time: 9:36 AM
 */

goog.provide('vs.linking.LinkProvider');

goog.require('vs.models.DataSource');

/**
 * @constructor
 * @extends {ngu.Configuration}
 */
vs.linking.LinkProvider = function() {
  ngu.Configuration.apply(this, arguments);

  /**
   * d1 => d2 => (d1, obj1, d2, [adapter1], [adapter2]) => obj2
   * @type {Object.<string, Object.<string, function(vs.models.DataSource, Array.<Object>, vs.models.DataSource): Array.<Object>>>}
   * @private
   */
  this._linkMap = {};

  /**
   * brushingEvent.id => data.id => objects
   * @type {Object.<string, Object.<string, Array.<Object>>>}
   * @private
   */
  this._brushingCache = {};
};

goog.inherits(vs.linking.LinkProvider, ngu.Configuration);

/**
 * @param {string} dataId1
 * @param {string} dataId2
 * @param {function(vs.models.DataSource, Array.<Object>, vs.models.DataSource): Array.<Object>} link (d1, obj1, d2) => obj2
 */
vs.linking.LinkProvider.prototype.register = function(dataId1, dataId2, link) {
  if (!(dataId1 in this._linkMap)) { this._linkMap[dataId1] = {}; }
  this._linkMap[dataId1][dataId2] = link;
};

/**
 * @param {vs.ui.BrushingEvent} brushingEvent
 * @param {Array.<vs.models.DataSource>} data
 * @returns {Array.<Object>}
 */
vs.linking.LinkProvider.prototype.brushingObjects = function(brushingEvent, data) {
  var eventId = brushingEvent['id'];
  var eventCache = this._brushingCache[eventId];
  if (!eventCache) {
    eventCache = {};
    this._brushingCache[eventId] = eventCache;
  }

  var linkMap = this._linkMap;
  return u.fast.concat(u.fast.map(data, function(d) {
    if (brushingEvent['data']['id'] == d['id']) { return brushingEvent['items']; }

    var ret = eventCache[d['id']];
    if (ret) { return ret; }
    var link = linkMap[brushingEvent['data']['id']] ? linkMap[brushingEvent['data']['id']][d['id']] : null;
    if (link) { return link(brushingEvent['data'], brushingEvent['items'], /** @type {vs.models.DataSource} */ (d)); }
    return [];
  }));
};
