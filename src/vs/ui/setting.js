/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/27/2015
 * Time: 2:06 PM
 */

goog.provide('vs.ui.Setting');

goog.require('vs.models.DataSource');

// for predefined settings:
goog.require('vs.models.Boundaries');
goog.require('vs.models.Margins');

/**
 * @param {{
 *  key: string,
 *  type: (vs.ui.Setting.Type|string),
 *  defaultValue: (function(Object.<string, *>, *, vs.models.DataSource, Object.<string, vs.ui.Setting>)|*),
 *  label: (string|undefined),
 *  template: (string|undefined),
 *  hidden: (boolean|undefined),
 *  possibleValues: (Array|function(Object.<string, *>, *, vs.models.DataSource, Object.<string, vs.ui.Setting>)|undefined)
 * }} args
 * @constructor
 */
vs.ui.Setting = function(args) { //key, type, defaultValue, label, template, hidden, possibleValues) {
  /**
   * @type {string}
   */
  this.key = args.key;

  /**
   * @type {vs.ui.Setting.Type|string}
   */
  this.type = args.type;

  /**
   * @type {function(Object.<string, *>, *, vs.models.DataSource, Object.<string, vs.ui.Setting>)|*}
   */
  this.defaultValue = args.defaultValue;

  /**
   * @type {string}
   */
  this.label = args.label || this.key;

  /**
   * @type {Array|function(Object.<string, *>, *, vs.models.DataSource, Object.<string, vs.ui.Setting>)|null}
   * @private
   */
  this._possibleValues = args.possibleValues || null;

  /**
   * @type {string}
   */
  this.template = args.template;

  /**
   * @type {boolean}
   */
  this.hidden = !!args.hidden;
};

/**
 * Extracts value from a set of raw options and element attributes
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.prototype.getValue = function(options, $attrs, data, settings) {
  // Declaring this as a function, so we don't perform the computation unless necessary
  var self = this;
  var defaultValue = function() {
    return (typeof self.defaultValue == 'function') ? self.defaultValue.call(null, options, $attrs, data, settings) : self.defaultValue;
  };

  if ((!options || !(this.key in options)) && (!$attrs || !(this.key in $attrs))) {
    return defaultValue();
  }

  var possibleVals;
  var val = (options && (this.key in options)) ? options[this.key] : $attrs[this.key];

  switch (this.type) {
    case vs.ui.Setting.Type.BOOLEAN:
      if (typeof val == 'boolean') { return val; }
      if (val == 'true') { return true; }
      if (val == 'false') { return false; }
      return defaultValue();

    case vs.ui.Setting.Type.NUMBER:
      if (typeof val == 'number') { return val; }
      try {
        val = parseFloat(val);
        return (isNaN(val)) ? defaultValue() : val;
      } catch (err) {
        return defaultValue();
      }

    case vs.ui.Setting.Type.STRING:
      if (typeof val == 'string') { return val; }
      if (typeof val == 'number') { return '' + val; }
      return defaultValue();

    case vs.ui.Setting.Type.DATA_ROW_LABEL:
      if (!data) { return val; }

      possibleVals = this.possibleValues(options, $attrs, data, settings);
      if (possibleVals.indexOf(val) < 0) {
        return possibleVals.length > 0 ? possibleVals[0] : defaultValue();
      }
      return val;

    case vs.ui.Setting.Type.DATA_COL_LABEL:
      if (!data) { return val; }

      possibleVals = this.possibleValues(options, $attrs, data, settings);
      if (possibleVals.indexOf(val) < 0) {
        return possibleVals.length > 0 ? possibleVals[0] : defaultValue();
      }
      return val;

    case vs.ui.Setting.Type.DATA_VAL_LABEL:
      if (!data) { return val; }

      possibleVals = this.possibleValues(options, $attrs, data, settings);
      if (possibleVals.indexOf(val) < 0) {
        return possibleVals.length > 0 ? possibleVals[0] : defaultValue();
      }
      return val;

    case vs.ui.Setting.Type.ARRAY:
      if (Array.isArray(val)) { return val; }
      if (typeof val == 'string') {
        try {
          val = JSON.parse(val);
          return (Array.isArray(val)) ? val : defaultValue();
        } catch (err) {
          return defaultValue();
        }
      }
      return defaultValue();

    case vs.ui.Setting.Type.CATEGORICAL:
      if (this._possibleValues === null) { return val; }
      possibleVals = (typeof this._possibleValues == 'function') ?
        this._possibleValues.call(null, options, $attrs, data, settings) : this._possibleValues;
      return possibleVals.indexOf(val) < 0 ? defaultValue() : val;

    case vs.ui.Setting.Type.OBJECT:
      if (typeof val == 'object') { return val; }
      if (typeof val == 'string') {
        try {
          return JSON.parse(val);
        } catch (err) {
          return defaultValue();
        }
      }
      return defaultValue();

    case vs.ui.Setting.Type.FUNCTION:
      if (typeof val == 'function') { return val.call(null, options, $attrs, data, settings); }
      return defaultValue();

    default:
      // In the default case, the type is the fully qualified type name of a class represented as a string
      try {
        var t = u.reflection.evaluateFullyQualifiedTypeName(this.type);
        if (typeof val == 'object') {
          return u.reflection.wrap(val, t);
        }
        if (typeof val == 'string') {
          var obj = JSON.parse(val);
          return u.reflection.wrap(obj, t);
        }
        return defaultValue();
      } catch (err) {
        return defaultValue();
      }
  }
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.prototype.possibleValues = function(options, $attrs, data, settings) {
  if (this._possibleValues) {
    return (typeof this._possibleValues != 'function') ?
      this._possibleValues : this._possibleValues.call(null, options, $attrs, data, settings);
  }
  if (!data) { return null; }

  switch (this.type) {
    case vs.ui.Setting.Type.DATA_ROW_LABEL:
      return data.rows.map(/** @param {vs.models.DataArray} row */ function(row) { return row.label });

    case vs.ui.Setting.Type.DATA_COL_LABEL:
      return data.cols.map(/** @param {vs.models.DataArray} col */ function(col) { return col.label });

    case vs.ui.Setting.Type.DATA_VAL_LABEL:
      return data.vals.map(/** @param {vs.models.DataArray} arr */ function(arr) { return arr.label });

    default: return null;
  }
};

/**
 * @enum {string}
 */
vs.ui.Setting.Type = {
  NUMBER: 'number',
  STRING: 'string',
  ARRAY: 'array',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  CATEGORICAL: 'categorical',
  DATA_COL_LABEL: 'dataColLbl',
  DATA_ROW_LABEL: 'dataRowLbl',
  DATA_VAL_LABEL: 'dataValLbl',
  FUNCTION: 'function'
};

/**
 * @const {string}
 */
vs.ui.Setting.DEFAULT = 'default';

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.valueBoundaries = function (options, $attrs, data, settings) {
  var boundaries;

  if (!settings || !('vals' in settings)) { throw new vs.ui.UiException('Missing dependency for "vals" in the "boundaries" defaultValue function'); }

  var valsArr = data.getVals(settings['vals'].getValue(options, $attrs, data, settings));
  boundaries = valsArr.boundaries || new vs.models.Boundaries(
      Math.min.apply(null, valsArr.d),
      Math.max.apply(null, valsArr.d));

  return boundaries;
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.rowBoundaries = function (options, $attrs, data, settings) {
  var boundaries;

  if (!settings || !('rows' in settings)) { throw new vs.ui.UiException('Missing dependency for "row" in the "boundaries" defaultValue function'); }

  var min, max;
  var rows = settings['rows'].getValue(options, $attrs, data, settings);

  rows.forEach(function(label) {
    var row = data.getRow(label);
    if (!row.boundaries && !data.nrows) {
      return;
    }
    var b = row.boundaries || new vs.models.Boundaries(
        Math.min.apply(null, row.d),
        Math.max.apply(null, row.d));
    if (min == undefined || b.min < min) { min = b.min; }
    if (max == undefined || b.max > max) { max = b.max; }
  });

  if (min == undefined && max == undefined) { min = max = 0; }
  if (min == undefined) { min = max; }
  if (max == undefined) { max = min; }

  return new vs.models.Boundaries(min, max);
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.firstColsLabel = function (options, $attrs, data, settings) {
  return data.cols[0].label
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.firstRowsLabel = function (options, $attrs, data, settings) {
  return data.rows[0].label
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.firstValsLabel = function (options, $attrs, data, settings) {
  return data.vals[0].label;
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.xScale = function (options, $attrs, data, settings) {
  var dependencies = ['xBoundaries', 'width', 'margins'];
  if (!settings) { throw new vs.ui.UiException('Settings not provided for "xScale", which depends on ' + JSON.stringify(dependencies)); }
  dependencies.forEach(function(dep) {
    if (!(dep in settings)) {
      throw new vs.ui.UiException('Missing dependency for "' + dep + '" in the "xScale" defaultValue function');
    }
  });

  var xBoundaries = settings['xBoundaries'].getValue(options, $attrs, data, settings);
  var width = settings['width'].getValue(options, $attrs, data, settings);
  var margins = settings['margins'].getValue(options, $attrs, data, settings);
  return d3.scale.linear()
    .domain([xBoundaries.min, xBoundaries.max])
    .range([0, width - margins.left - margins.right]);
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.yScale = function (options, $attrs, data, settings) {
  var dependencies = ['yBoundaries', 'height', 'margins'];
  if (!settings) { throw new vs.ui.UiException('Settings not provided for "yScale", which depends on ' + JSON.stringify(dependencies)); }
  dependencies.forEach(function(dep) {
    if (!(dep in settings)) {
      throw new vs.ui.UiException('Missing dependency for "' + dep + '" in the "yScale" defaultValue function');
    }
  });

  var yBoundaries = settings['yBoundaries'].getValue(options, $attrs, data, settings);
  var height = settings['height'].getValue(options, $attrs, data, settings);
  var margins = settings['margins'].getValue(options, $attrs, data, settings);
  return d3.scale.linear()
    .domain([yBoundaries.min, yBoundaries.max])
    .range([height - margins.top - margins.bottom, 0]);
};

/**
 * @const {Object.<string, vs.ui.Setting>}
 */
vs.ui.Setting.PredefinedSettings = {
  'col': new vs.ui.Setting({key:'col', type:vs.ui.Setting.Type.DATA_COL_LABEL, defaultValue:vs.ui.Setting.firstColsLabel, label:'column', template:'_categorical.html'}),
  'row': new vs.ui.Setting({key:'row', type:vs.ui.Setting.Type.DATA_ROW_LABEL, defaultValue:vs.ui.Setting.firstRowsLabel, label:'row', template:'_categorical.html'}),

  'vals': new vs.ui.Setting({key:'vals', type:vs.ui.Setting.Type.DATA_VAL_LABEL, defaultValue:vs.ui.Setting.firstValsLabel, label:'values set', template:'_categorical.html'}),
  'xBoundaries': new vs.ui.Setting({key:'xBoundaries', type:'vs.models.Boundaries', defaultValue:vs.ui.Setting.valueBoundaries, label:'x boundaries', template:'_boundaries.html'}),
  'yBoundaries': new vs.ui.Setting({key:'yBoundaries', type:'vs.models.Boundaries', defaultValue:vs.ui.Setting.valueBoundaries, label:'y boundaries', template:'_boundaries.html'}),

  // TODO: Margins + width and height could well go in a single template that looks pretty. For the future.
  'margins': new vs.ui.Setting({key:'margins', type:'vs.models.Margins', defaultValue:new vs.models.Margins(0, 0, 0, 0), template:'_margins.html'}),
  'width': new vs.ui.Setting({key:'width', type:vs.ui.Setting.Type.NUMBER, defaultValue:300, template:'_number.html'}),
  'height': new vs.ui.Setting({key:'height', type:vs.ui.Setting.Type.NUMBER, defaultValue:300, template:'_number.html'}),

  'cols': new vs.ui.Setting({key:'cols', type:vs.ui.Setting.Type.ARRAY, defaultValue:function(options, $attrs, data) { return u.array.range(data.ncols); }, label:'columns', template:'_multiselect-tbl.html'}),
  'rows': new vs.ui.Setting({key:'rows', type:vs.ui.Setting.Type.ARRAY, defaultValue:function(options, $attrs, data) { return u.array.range(data.nrows); }, label:'rows', template:'_multiselect-tbl.html'}),

  'rowsOrderBy': new vs.ui.Setting({key:'rowsOrderBy', type:vs.ui.Setting.Type.DATA_ROW_LABEL, defaultValue:vs.ui.Setting.firstRowsLabel, label:'order rows by', template:'_categorical.html'}),
  'rowsScale': new vs.ui.Setting({key:'rowsScale', type:vs.ui.Setting.Type.BOOLEAN, defaultValue:true, label:'scale rows axis', template:'_switch.html'}),

  'doubleBuffer': new vs.ui.Setting({key:'doubleBuffer', type:vs.ui.Setting.Type.BOOLEAN, defaultValue:true, label:'double buffer', template:'_switch.html'}),

  'xScale': new vs.ui.Setting({key:'xScale', type:vs.ui.Setting.Type.FUNCTION, defaultValue:vs.ui.Setting.xScale, hidden: true}),
  'yScale': new vs.ui.Setting({key:'yScale', type:vs.ui.Setting.Type.FUNCTION, defaultValue:vs.ui.Setting.yScale, hidden: true})
};
