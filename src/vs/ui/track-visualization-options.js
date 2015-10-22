/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/23/2015
 * Time: 4:43 PM
 */

goog.provide('vs.ui.TrackVisualizationOptions');

goog.require('vs.ui.VisualizationOptions');

/**
 * @param options
 * @param {vs.models.DataSource} data
 * @constructor
 * @extends vs.ui.VisualizationOptions
 */
vs.ui.TrackVisualizationOptions = function(options, data) {
  vs.ui.VisualizationOptions.apply(this, arguments);
};

goog.inherits(vs.ui.TrackVisualizationOptions, vs.ui.VisualizationOptions);

Object.defineProperties(vs.ui.TrackVisualizationOptions.prototype, {
  /**
   * @type {{x: vs.models.Boundaries, y: vs.models.Boundaries}}
   * @instance
   * @memberof vs.ui.ManhattanPlotOptions
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
          xBoundaries = new vs.models.Boundaries(0, 0);
        } else {
          if (typeof rowsArr.d[0] == 'number') {
            xBoundaries = new vs.models.Boundaries(
              Math.min.apply(undefined, rowsArr.d),
              Math.max.apply(undefined, rowsArr.d)
            );
          }
        }
      }

      var valsArr = this._data.getVals(this._vals);
      if (!yBoundaries) {
        yBoundaries = valsArr.boundaries ||
          new vs.models.Boundaries(
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
