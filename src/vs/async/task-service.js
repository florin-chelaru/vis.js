/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/14/2015
 * Time: 5:59 PM
 */

goog.provide('vs.async.TaskService');

goog.require('vs.async.Task');
goog.require('goog.async.Deferred');

/**
 * @param {function(function, number)} $timeout Angular timeout service
 * @constructor
 */
vs.async.TaskService = function($timeout) {
  /**
   * @type {function(Function, number)}
   * @private
   */
  this._timeout = $timeout || setTimeout;

  /**
   * @type {Object.<number, vs.async.Task>}
   * @private
   */
  this._tasks = {};
};

/**
 * @param {function} func
 */
vs.async.TaskService.prototype.createTask = function(func) {
  var ret = new vs.async.Task(func);
  this._tasks[ret.id] = ret;
  return ret;
};

/**
 * @param {vs.async.Task|function} t1
 * @param {vs.async.Task|function} t2
 * @returns {vs.async.Task}
 */
vs.async.TaskService.prototype.chain = function(t1, t2) {
  if ($.isFunction(t1)) {
    return this.chain(new vs.async.Task(t1), t2);
  }

  if ($.isFunction(t2)) {
    return this.chain(t1, new vs.async.Task(t2));
  }

  t1._next = t1._next || t2._first;
  t1._last._next = t2._first;
  t1._last = t2._last;

  t2._prev = t2._prev || t1._last;
  t2._first._prev = t1._last;
  t2._first = t1._first;

  return t1._first;
};

/**
 * @param {vs.async.Task} task
 * @param {boolean} [sequential] If true, the tasks will run sequentially
 * @returns {goog.async.Deferred}
 */
vs.async.TaskService.prototype.runChain = function(task, sequential) {
  var current = task._first;
  var deferred = new goog.async.Deferred();
  if (sequential) {
    for (; !!current; current = current._next) {
      current._func.apply();
    }
    deferred.callback();
    return deferred;
  }

  var timeout = this._timeout;
  var iterate = function() {
    timeout.call(null, function() {
      current._func.apply();
      current = current._next;
      if (current) {
        iterate();
      } else {
        deferred.callback();
      }
    }, 0);
  };

  iterate();

  return deferred;
};
