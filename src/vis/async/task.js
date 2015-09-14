/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/14/2015
 * Time: 2:57 PM
 */

goog.provide('vis.async.Task');

goog.require('goog.async.Deferred');

/**
 * @param {function} func
 * @constructor
 */
vis.async.Task = function(func) {
  /**
   * @type {number}
   * @private
   */
  this._id = vis.async.Task.nextId();

  /**
   * @type {Function}
   * @private
   */
  this._func = func;

  /**
   * @type {vis.async.Task}
   * @private
   */
  this._prev = null;

  /**
   * @type {vis.async.Task}
   * @private
   */
  this._next = null;

  /**
   * @type {vis.async.Task}
   * @private
   */
  this._first = this;

  /**
   * @type {vis.async.Task}
   * @private
   */
  this._last = this;
};

Object.defineProperties(vis.async.Task.prototype, {
  id: { get: function() { return this._id; } }
});

/**
 * @type {number}
 * @private
 */
vis.async.Task._nextId = 0;

/**
 * @returns {number}
 */
vis.async.Task.nextId = function() {
  return vis.async.Task._nextId++;
};
