/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/14/2015
 * Time: 2:57 PM
 */

goog.provide('vs.async.Task');

/**
 * @param {function():Promise} func
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
   * @type {function(): Promise}
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

/**
 * @type {number}
 * @name vs.async.Task#id
 */
vs.async.Task.prototype.id;

/**
 * @type {Object|undefined}
 * @name vs.async.Task#thisArg
 */
vs.async.Task.prototype.thisArg;

/**
 * @type {function():Promise}
 * @name vs.async.Task#func
 */
vs.async.Task.prototype.func;

/**
 * @type {vs.async.Task}
 * @name vs.async.Task#prev
 */
vs.async.Task.prototype.prev;

/**
 * @type {vs.async.Task}
 * @name vs.async.Task#next
 */
vs.async.Task.prototype.next;

/**
 * @type {vs.async.Task}
 * @name vs.async.Task#first
 */
vs.async.Task.prototype.first;

/**
 * @type {vs.async.Task}
 * @name vs.async.Task#last
 */
vs.async.Task.prototype.last;

Object.defineProperties(vs.async.Task.prototype, {
  'id': { get: /** @type {function (this:vs.async.Task)} */ (function() { return this._id; })},
  'thisArg': { get: /** @type {function (this:vs.async.Task)} */ (function() { return this._thisArg; })},
  'func': { get: /** @type {function (this:vs.async.Task)} */ (function() { return this._func; })},
  'prev': {
    get: /** @type {function (this:vs.async.Task)} */ (function() { return this._prev; }),
    set: /** @type {function (this:vs.async.Task)} */ (function(value) { this._prev = value; })
  },
  'next': {
    get: /** @type {function (this:vs.async.Task)} */ (function() { return this._next; }),
    set: /** @type {function (this:vs.async.Task)} */ (function(value) { this._next = value; })
  },
  'first': {
    get: /** @type {function (this:vs.async.Task)} */ (function() { return this._first; }),
    set: /** @type {function (this:vs.async.Task)} */ (function(value) { this._first = value; })
  },
  'last': {
    get: /** @type {function (this:vs.async.Task)} */ (function() { return this._last; }),
    set: /** @type {function (this:vs.async.Task)} */ (function(value) { this._last = value; })
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
