/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/22/2015
 * Time: 9:11 AM
 */

goog.provide('vs.ui.VisualContext');

/**
 * @param {{render: string, type: string}} construct
 * @param {Object.<string, *>} [options]
 * @param {{cls: Array.<string>, elem: Array.<{cls: string, options: Object.<string, *>}>}} [decorators]
 * @constructor
 */
vs.ui.VisualContext = function(construct, options, decorators) {
  /**
   * @type {{render: string, type: string}}
   */
  this['construct'] = construct;

  /**
   * @type {Object.<string, *>}
   */
  this['options'] = options || {};

  /**
   * @type {{cls: Array.<string>, elem: Array.<{cls: string, options: Object.<string, *>}>}|Array}
   */
  this['decorators'] = decorators || [];
};
