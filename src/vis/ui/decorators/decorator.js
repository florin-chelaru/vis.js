/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:39 PM
 */

goog.provide('vis.ui.decorators.Decorator');

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param $targetElement
 * @constructor
 * @abstract
 */
vis.ui.decorators.Decorator = function($scope, $element, $attrs, $targetElement) {
  /**
   * @private
   */
  this._scope = $scope;

  /**
   * @private
   */
  this._element = $element;

  /**
   * @private
   */
  this._attrs = $attrs;

  /**
   * @private
   */
  this._targetElement = $targetElement;
};

Object.defineProperties(vis.ui.decorators.Decorator.prototype, {
  /**
   * @instance
   * @memberof vis.ui.decorators.Decorator
   */
  scope: {
    get: function() { return this._scope; }
  },

  /**
   * @instance
   * @memberof vis.ui.decorators.Decorator
   */
  element: {
    get: function() { return this._element; }
  },

  /**
   * @instance
   * @memberof vis.ui.decorators.Decorator
   */
  attrs: {
    get: function() { return this._attrs; }
  },

  /**
   * @instance
   * @memberof vis.ui.decorators.Decorator
   */
  targetElement: {
    get: function() { return this._targetElement; }
  }
});
