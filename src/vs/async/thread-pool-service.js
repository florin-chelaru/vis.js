/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 11/4/2015
 * Time: 7:26 PM
 */

goog.provide('vs.async.ThreadPoolService');

goog.require('vs.Configuration');

/**
 * @param {vs.Configuration} config
 * @constructor
 */
vs.async.ThreadPoolService = function(config) {
  var settings = config.options['parallel'];
  if (!settings) { throw new vs.ui.UiException('Parallel settings have not been configured. Make sure you call configuration.customize({parallel: ...})'); }
  var nthreads = settings['nthreads'] || 16;
  var worker = settings['worker'];
  if (!worker) { throw new vs.ui.UiException('Parallel worker path needs to be defined in the configuration: configuration.customize({parallel: {worker: <path to worker>}})'); }

  /**
   * @type {parallel.ThreadPool}
   * @private
   */
  this._pool = new parallel.ThreadPool(nthreads, worker);
};

/**
 * @type {parallel.ThreadPool}
 * @name vs.async.ThreadPoolService#pool
 */
vs.async.ThreadPoolService.prototype.pool;

Object.defineProperties(vs.async.ThreadPoolService.prototype, {
  pool: { get: /** @type {function (this:vs.async.ThreadPoolService)} */ (function() { return this._pool; })}
});
