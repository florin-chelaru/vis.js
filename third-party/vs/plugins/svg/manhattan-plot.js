/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 12:19 PM
 */

goog.provide('vs.plugins.svg.ManhattanPlot');

goog.require('vs.ui.svg.SvgVis');
goog.require('vs.models.DataRow');

/**
 * @constructor
 * @extends vs.ui.svg.SvgVis
 */
vs.plugins.svg.ManhattanPlot = function() {
  vs.ui.svg.SvgVis.apply(this, arguments);
};

goog.inherits(vs.plugins.svg.ManhattanPlot, vs.ui.svg.SvgVis);

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.plugins.svg.ManhattanPlot.Settings = u.extend({}, vs.ui.VisHandler.Settings, {
  'rows': vs.ui.Setting.PredefinedSettings['rows'],
  'vals': vs.ui.Setting.PredefinedSettings['vals'],
  'xBoundaries': new vs.ui.Setting({key:'xBoundaries', type:'vs.models.Boundaries', defaultValue:vs.ui.Setting.rowBoundaries, label:'x boundaries', template:'_boundaries.html'}),
  'yBoundaries': vs.ui.Setting.PredefinedSettings['yBoundaries'],
  'xScale': vs.ui.Setting.PredefinedSettings['xScale'],
  'yScale': vs.ui.Setting.PredefinedSettings['yScale'],
  'cols': vs.ui.Setting.PredefinedSettings['cols']
});

Object.defineProperties(vs.plugins.svg.ManhattanPlot.prototype, {
  settings: { get: /** @type {function (this:vs.plugins.svg.ManhattanPlot)} */ (function() { return vs.plugins.svg.ManhattanPlot.Settings; })}
});

/**
 * @override
 */
vs.plugins.svg.ManhattanPlot.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    vs.ui.svg.SvgVis.prototype.draw.apply(self, args)
      .then(function() {
        /** @type {vs.models.DataSource} */
        var data = self.data;

        // Nothing to draw
        if (!data.nrows) { return; }

        var margins = self.optionValue('margins');
        var xScale = self.optionValue('xScale');
        var yScale = self.optionValue('yScale');
        var cols = self.optionValue('cols');
        var row = self.optionValue('rows')[0];
        var valsLabel = self.optionValue('vals');

        var svg = d3.select(self.$element[0]).select('svg');

        var viewport = svg.select('.viewport');
        if (viewport.empty()) {
          viewport = svg.append('g')
            .attr('class', 'viewport');
        }
        viewport
          .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

        var items = goog.array.range(data.nrows).map(function(i) {
          return new vs.models.DataRow(data, i);
        });
        var selection = viewport.selectAll('circle').data(items);

        selection.enter()
          .append('circle');

        selection
          .attr('r', 3)
          .attr('cx', function(d) { return xScale(parseFloat(d.info(row))); })
          .attr('cy', function(d) { return yScale(d.val(cols[0], valsLabel)); })
          .attr('fill', '#1e60d4');

        selection.exit()
          .remove();

        resolve();
      }, reject);
  });
};
