/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/14/2015
 * Time: 2:57 PM
 */

goog.provide('vs.async.Task');

goog.require('goog.async.Deferred');

/**
 * @param {function} func
 * @constructor
 */
vs.async.Task = function(func) {
  /**
   * @type {number}
   * @private
   */
  this._id = vs.async.Task.nextId();

  /**
   * @type {Function}
   * @private
   */
  this._func = func;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._prev = null;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._next = null;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._first = this;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._last = this;
};

Object.defineProperties(vs.async.Task.prototype, {
  id: { get: function() { return this._id; } }
});

/**
 * @type {number}
 * @private
 */
vs.async.Task._nextId = 0;

/**
 * @returns {number}
 */
vs.async.Task.nextId = function() {
  return vs.async.Task._nextId++;
};
