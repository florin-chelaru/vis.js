/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 1/6/2016
 * Time: 9:36 AM
 */

goog.provide('vs.linking.LinkService');

goog.require('vs.models.DataSource');
goog.require('vs.linking.Link');

/**
 * @constructor
 */
vs.linking.LinkService = function() {
  /**
   * linkGroupId -> dataSourceId -> dataSource
   * @type {Object.<string, Object.<string, vs.models.DataSource>>}
   * @private
   */
  this._linksDataMap = {};

  /**
   * dataSourceId -> linkGroupId -> link
   * @type {Object.<string, Object.<string, vs.linking.Link>>}
   * @private
   */
  this._dataLinksMap = {};
};

/**
 * @param {vs.models.DataSource} data
 * @param {vs.linking.Link} link
 */
vs.linking.LinkService.prototype.register = function(data, link) {
  if (!(link.groupId in this._linksDataMap)) {
    this._linksDataMap[link.groupId] = {};
  }
  this._linksDataMap[link.groupId][data.id] = data;

  if (!(data.id in this._dataLinksMap)) {
    this._dataLinksMap[data.id] = {};
  }
  this._dataLinksMap[data.id][link.groupId] = link;
};

/**
 * Gets the indices of the rows in data2 that match row i in data1
 * @param {vs.models.DataSource} data1
 * @param {number} i
 * @param {vs.models.DataSource} data2
 * @returns {Array.<number>}
 */
vs.linking.LinkService.prototype.matches = function(data1, i, data2) {
  if (data1 == data2) { return [i]; }

  var commonLinks = [];
  if (!(data1.id in this._dataLinksMap) || !(data2.id in this._dataLinksMap)) {
    return [];
  }

  var self = this;
  u.each(this._dataLinksMap[data1.id], function(linkGroupId, link) {
    if (data2.id in self._linksDataMap[linkGroupId]) {
      commonLinks.push([
        link,
        self._dataLinksMap[data2.id][link.groupId]
      ]);
    }
  });

  if (commonLinks.length == 0) {
    return [];
  }

  var ret = [];
  commonLinks.forEach(function(pair, i) {
    var key1 = pair[0].keyFunc(data1, i);
    for (var j = 0; j < data2.nrows; ++j) {
      var key2 = pair[1].keyFunc(data2, j);
      if (key1.matches(key2)) {
        ret.push(j);
      }
    }
  });
  return ret;
};
