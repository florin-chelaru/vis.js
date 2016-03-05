/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 12/1/2015
 * Time: 1:45 PM
 */

goog.provide('vs.ui.BrushingEvent');

goog.require('vs.models.DataSource');

/**
 * @param {vs.models.DataSource} data
 * @param {vs.ui.BrushingEvent.Action} action
 * @param {...Object} items
 * @constructor
 */
vs.ui.BrushingEvent = function(data, action, items) {
  /**
   * @type {string}
   */
  this['id'] = u.generatePseudoGUID(10);

  /**
   * @type {vs.models.DataSource}
   */
  this['data'] = data;

  /**
   * @type {Array.<Object>}
   */
  this['items'] = u.array.fromArguments(arguments).slice(2);

  /**
   * @type {vs.ui.BrushingEvent.Action}
   */
  this['action'] = action;
};

/**
 * @enum {string}
 */
vs.ui.BrushingEvent.Action = {
  'MOUSEOVER': 'mouseover',
  'MOUSEOUT': 'mouseout',
  'SELECT': 'select',
  'DESELECT': 'deselect'
};
