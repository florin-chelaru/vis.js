/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/14/2015
 * Time: 2:57 PM
 */

goog.provide('vs.async.Task');

goog.require('goog.async.Deferred');

/**
 * @param {function} func
 * @param {Object} [thisArg]
 * @constructor
 */
vs.async.Task = function(func, thisArg) {
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
   * @type {Object|undefined}
   * @private
   */
  this._thisArg = thisArg;

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
  id: { get: function() { return this._id; } },
  thisArg: { get: function() { return this._thisArg; } },
  func: { get: function() { return this._func; } },
  prev: {
    get: function() { return this._prev; },
    set: function(value) { this._prev = value; }
  },
  next: {
    get: function() { return this._next; },
    set: function(value) { this._next = value; }
  },
  first: {
    get: function() { return this._first; },
    set: function(value) { this._first = value; }
  },
  last: {
    get: function() { return this._last; },
    set: function(value) { this._last = value; }
  }

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
