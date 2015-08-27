/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 10:08 AM
 */

goog.provide('vis.ui.Visualization');

/**
 * @param scope
 * @param element
 * @param attrs
 * @constructor
 */
vis.ui.Visualization = function(scope, element, attrs) {
  Object.defineProperties(this, {
    scope: {
      get: function() { return scope; }
    },
    element: {
      get: function() { return element; }
    },
    attrs: {
      get: function() { return attrs; }
    }
  });
};

/**
 */
vis.ui.Visualization.prototype.draw = function() {
  var data = this.scope.data;
  console.log(data);
};
