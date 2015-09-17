/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/26/2015
 * Time: 4:53 PM
 */

goog.provide('vis.Configuration');

/**
 * @constructor
 */
vis.Configuration = function() {

  /**
   * @type {Object.<string, *>}
   * @private
   */
  this._options = {
    visualizations: {
      scatterplot: {
        'canvas': 'vis.ui.canvas.ScatterPlot',
        'svg': 'vis.ui.svg.ScatterPlot',
        'default': 'svg'
      }
    }
  };
};

Object.defineProperties(vis.Configuration.prototype, {
  options: {
    get: function () { return this._options; }
  }
});

/**
 * @param {Object.<string, *>} options
 */
vis.Configuration.prototype.customize = function(options) {
  angular.extend(this._options, options);
};
