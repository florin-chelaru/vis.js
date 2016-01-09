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
 * @param {vs.models.DataRow} selectedRow
 * @param {vs.ui.BrushingEvent.Action} action
 * @constructor
 */
vs.ui.BrushingEvent = function(source, data, selectedRow, action) {
  /**
   * @type {vs.ui.VisHandler}
   */
  this['source'] = source;

  /**
   * @type {vs.models.DataSource}
   */
  this['data'] = data;

  /**
   * @type {vs.models.DataRow}
   */
  this['selectedRow'] = selectedRow;

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
