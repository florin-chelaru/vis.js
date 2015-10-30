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
 * @param {Object} [thisArg]
 */
vs.async.TaskService.prototype.createTask = function(func, thisArg) {
  var ret = new vs.async.Task(func, thisArg);
  this._tasks[ret.id] = ret;
  return ret;
};

/**
 * @param {vs.async.Task|function} t1
 * @param {vs.async.Task|function} t2
 * @returns {vs.async.Task}
 */
vs.async.TaskService.prototype.chain = function(t1, t2) {
  if (typeof t1 == 'function') {
    return this.chain(new vs.async.Task(t1), t2);
  }

  if (typeof t2 == 'function') {
    return this.chain(t1, new vs.async.Task(t2));
  }

  t1.next = t1.next || t2.first;
  t1.last.next = t2.first;
  t1.last = t2.last;

  t2.prev = t2.prev || t1.last;
  t2.first.prev = t1.last;
  t2.first = t1.first;

  return t1.first;
};

/**
 * TODO: test!
 * @param {vs.async.Task} task
 * @param {boolean} [sequential] If true, the tasks will run sequentially
 * @returns {goog.async.Deferred}
 */
vs.async.TaskService.prototype.runChain = function(task, sequential) {
  // TODO: test!
  var current = task.first;
  if (sequential) {
    return new Promise(function(resolve, reject) {
      for (; !!current; current = current.next) {
        current.func.apply(current.thisArg);
      }
      resolve();
    });
  }

  var tasks = [];
  for (; !!current; current = current.next) {
    tasks.push(current);
  }

  return u.async.each(tasks, function(task) {
    return new Promise(function(resolve, reject) {
      task.func.apply(task.thisArg);
      resolve();
    });
  }, true);
};
