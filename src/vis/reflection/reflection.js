/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 11:59 AM
 */

goog.provide('vis.reflection');

goog.require('vis.reflection.ReflectionException');

/**
 * Evaluates the given string into a constructor for a type
 * @param {string} typeName
 * @returns {?function(new: T)}
 * @template T
 */
vis.reflection.evaluateFullyQualifiedTypeName = function(typeName) {
  var result;

  try {
    var namespaces = typeName.split('.');
    var func = namespaces.pop();
    var context = window;
    for (var i = 0; i < namespaces.length; ++i) {
      context = context[namespaces[i]];
    }
    result = context[func];
  } catch (error) {
    throw new vis.reflection.ReflectionException('Unknown type name: ' + typeName, error);
  }

  if (typeof(result) !== 'function') {
    throw new vis.reflection.ReflectionException('Unknown type name: ' + typeName);
  }

  return result;
};

/**
 * Applies the given constructor to the given parameters and creates
 * a new instance of the class it defines
 * @param {function(new: T)} ctor
 * @param {Array} params
 * @returns {T}
 * @template T
 */
vis.reflection.applyConstructor = function(ctor, params) {
  var obj;

  // Use a fake constructor function with the target constructor's
  // `prototype` property to create the object with the right prototype
  var fakeCtor = function() {};
  fakeCtor.prototype = ctor.prototype;

  obj = /** @type {T} */ (new fakeCtor());

  // Set the object's `constructor`
  obj.constructor = ctor;

  // Call the constructor function
  ctor.apply(obj, params);

  return obj;
};

