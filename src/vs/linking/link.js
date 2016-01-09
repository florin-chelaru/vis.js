/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 1/6/2016
 * Time: 10:00 AM
 */

goog.provide('vs.linking.Link');

goog.require('vs.models.DataSource');
goog.require('vs.linking.Key');

/**
 * @param {string} id
 * @param {string} groupId
 * @param {function(vs.models.DataSource, number): vs.linking.Key} keyFunc
 * @constructor
 */
vs.linking.Link = function(id, groupId, keyFunc) {
  /**
   * @type {string}
   * @private
   */
  this._id = id;

  /**
   * @type {string}
   * @private
   */
  this._groupId = groupId;

  /**
   * @type {function(vs.models.DataSource, number): vs.linking.Key}
   * @private
   */
  this._keyFunc = keyFunc;
};

/**
 * @type {string}
 * @name vs.linking.Link#id
 */
vs.linking.Link.prototype.id;

/**
 * @type {string}
 * @name vs.linking.Link#groupId
 */
vs.linking.Link.prototype.groupId;

/**
 * @type {function(vs.models.DataSource, number): vs.linking.Key}
 * @name vs.linking.Link#keyFunc
 */
vs.linking.Link.prototype.keyFunc;
