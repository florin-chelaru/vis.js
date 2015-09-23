/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/23/2015
 * Time: 4:43 PM
 */

goog.provide('vis.ui.TrackVisualizationOptions');

goog.require('vis.ui.VisualizationOptions');

/**
 * @param options
 * @param {vis.models.DataSource} data
 * @constructor
 * @extends vis.ui.VisualizationOptions
 */
vis.ui.TrackVisualizationOptions = function(options, data) {
  vis.ui.VisualizationOptions.apply(this, arguments);
};

goog.inherits(vis.ui.TrackVisualizationOptions, vis.ui.VisualizationOptions);

Object.defineProperties(vis.ui.TrackVisualizationOptions.prototype, {
  /**
   * @type {{x: vis.models.Boundaries, y: vis.models.Boundaries}}
   * @instance
   * @memberof vis.ui.ManhattanPlotOptions
   */
  axisBoundaries: {
    get: function() {
      var xBoundaries, yBoundaries;

      if (this._axisBoundaries) {
        xBoundaries = this._axisBoundaries.x;
        yBoundaries = this._axisBoundaries.y;
      }

      var rowsArr = this._data.getRows(this._rowsLabel);
      if (!xBoundaries) {
        xBoundaries = rowsArr.boundaries;
      }
      if (!xBoundaries) {
        if (!this._data.nrows) {
          xBoundaries = new vis.models.Boundaries(0, 0);
        } else {
          if (typeof rowsArr.d[0] == 'number') {
            xBoundaries = new vis.models.Boundaries(
              Math.min.apply(undefined, rowsArr.d),
              Math.max.apply(undefined, rowsArr.d)
            );
          }
        }
      }

      var valsArr = this._data.getVals(this._vals);
      if (!yBoundaries) {
        yBoundaries = valsArr.boundaries ||
          new vis.models.Boundaries(
            Math.min.apply(undefined, valsArr.d),
            Math.max.apply(undefined, valsArr.d)
          );
      }

      return {
        x: xBoundaries,
        y: yBoundaries
      };
    },
    set: function(value) { this._axisBoundaries = value; this.redrawRequired(); }
  }
});
