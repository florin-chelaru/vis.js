/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 12/1/2015
 * Time: 1:45 PM
 */

goog.provide('vs.ui.BrushingEvent');

goog.require('vs.ui.VisHandler');
goog.require('vs.models.DataSource');

/**
 * @param {vs.ui.VisHandler} source
 * @param {vs.models.DataSource} data
 * @param {Object} item
 * @param {vs.ui.BrushingEvent.Action} action
 * @constructor
 */
vs.ui.BrushingEvent = function(source, data, item, action) {
  /**
   * @type {vs.ui.VisHandler}
   */
  this['source'] = source;

  /**
   * @type {vs.models.DataSource}
   */
  this['data'] = data;

  /**
   * @type {number}
   */
  this['item'] = item;

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
