/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/14/2015
 * Time: 5:59 PM
 */

goog.require('vs.async.TaskService');

goog.exportSymbol('vs.async.TaskService', vs.async.TaskService);

goog.exportProperty(vs.async.TaskService.prototype, 'createTask', vs.async.TaskService.prototype.createTask);
goog.exportProperty(vs.async.TaskService.prototype, 'chain', vs.async.TaskService.prototype.chain);
goog.exportProperty(vs.async.TaskService.prototype, 'runChain', vs.async.TaskService.prototype.runChain);
