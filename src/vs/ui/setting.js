/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/27/2015
 * Time: 2:06 PM
 */

//region goog...
goog.provide('vs.ui.Setting');

goog.require('vs.models.DataSource');

// for predefined 'settings':
goog.require('vs.models.Boundaries');
goog.require('vs.models.Margins');
//endregion

/**
 * @param {{
 *  key: string,
 *  type: (vs.ui.Setting.Type|string),
 *  defaultValue: (function(Object.<string, *>, *, Array.<vs.models.DataSource>, Object.<string, vs.ui.Setting>)|*),
 *  label: (string|undefined),
 *  template: (string|undefined),
 *  hidden: (boolean|undefined),
 *  possibleValues: (Array|function(Object.<string, *>, *, Array.<vs.models.DataSource>, Object.<string, vs.ui.Setting>)|undefined)
 * }} args
 * @constructor
 */
vs.ui.Setting = function(args) {
  /**
   * @type {string}
   */
  this['key'] = args['key'];

  /**
   * @type {vs.ui.Setting.Type|string}
   */
  this['type'] = args['type'];

  /**
   * @type {function(Object.<string, *>, *, Array.<vs.models.DataSource>, Object.<string, vs.ui.Setting>)|*}
   */
  this['defaultValue'] = args['defaultValue'];

  /**
   * @type {string}
   */
  this['label'] = args['label'] || this['key'];

  /**
   * @type {Array|function(Object.<string, *>, *, (Array.<vs.models.DataSource>|undefined), (Object.<string, vs.ui.Setting>|undefined))|null}
   * @private
   */
  this._possibleValues = args['possibleValues'] || null;

  /**
   * @type {string}
   */
  this['template'] = args['template'];

  /**
   * @type {boolean}
   */
  this['hidden'] = !!args['hidden'];
};

//region Methods
/**
 * Extracts value from a set of raw options and element attributes
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.prototype.getValue = function(options, $attrs, data, settings) {
  // Declaring this as a function, so we don't perform the computation unless necessary
  var self = this;
  var defaultValue = function() {
    return (typeof self['defaultValue'] == 'function') ? self['defaultValue'].call(null, options, $attrs, data, settings) : self['defaultValue'];
  };

  if ((!options || !(this['key'] in options)) && (!$attrs || !(this['key'] in $attrs))) {
    return defaultValue();
  }

  var possibleVals;
  var val = (options && (this['key'] in options)) ? options[this['key']] : $attrs[this['key']];

  switch (this['type']) {
    case vs.ui.Setting.Type['BOOLEAN']:
      if (typeof val == 'boolean') { return val; }
      if (val == 'true') { return true; }
      if (val == 'false') { return false; }
      return defaultValue();

    case vs.ui.Setting.Type['NUMBER']:
      if (typeof val == 'number') { return val; }
      try {
        val = parseFloat(val);
        return (isNaN(val)) ? defaultValue() : val;
      } catch (err) {
        return defaultValue();
      }

    case vs.ui.Setting.Type['STRING']:
      if (typeof val == 'string') { return val; }
      if (typeof val == 'number') { return '' + val; }
      return defaultValue();

    case vs.ui.Setting.Type['DATA_ROW_LABEL']:
      if (!data) { return val; }

      possibleVals = this.possibleValues(options, $attrs, data, settings);
      if (possibleVals.indexOf(val) < 0) {
        return possibleVals.length > 0 ? possibleVals[0] : defaultValue();
      }
      return val;

    case vs.ui.Setting.Type['DATA_COL_LABEL']:
      if (!data) { return val; }

      possibleVals = this.possibleValues(options, $attrs, data, settings);
      if (possibleVals.indexOf(val) < 0) {
        return possibleVals.length > 0 ? possibleVals[0] : defaultValue();
      }
      return val;

    case vs.ui.Setting.Type['DATA_VAL_LABEL']:
      if (!data) { return val; }

      possibleVals = this.possibleValues(options, $attrs, data, settings);
      if (possibleVals.indexOf(val) < 0) {
        return possibleVals.length > 0 ? possibleVals[0] : defaultValue();
      }
      return val;

    case vs.ui.Setting.Type['ARRAY']:
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

    case vs.ui.Setting.Type['CATEGORICAL']:
      if (this._possibleValues === null) { return val; }
      possibleVals = (typeof this._possibleValues == 'function') ?
        this._possibleValues.call(null, options, $attrs, data, settings) : this._possibleValues;
      return possibleVals.indexOf(val) < 0 ? defaultValue() : val;

    case vs.ui.Setting.Type['OBJECT']:
      if (typeof val == 'object') { return val; }
      if (typeof val == 'string') {
        try {
          return JSON.parse(val);
        } catch (err) {
          return defaultValue();
        }
      }
      return defaultValue();

    case vs.ui.Setting.Type['FUNCTION']:
      if (typeof val == 'function') { return val.call(null, options, $attrs, data, settings); }
      return defaultValue();

    default:
      // In the default case, the type is the fully qualified type name of a class represented as a string
      try {
        var t = u.reflection.evaluateFullyQualifiedTypeName(this['type']);
        if (typeof val == 'object') {
          return u.reflection.wrap(val, t);
        }
        if (typeof val == 'string') {
          var obj = JSON.parse(val);
          return u.reflection.wrap(/** @type {Object} */ (obj), t);
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
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.prototype.possibleValues = function(options, $attrs, data, settings) {
  if (this._possibleValues) {
    return (typeof this._possibleValues != 'function') ?
      this._possibleValues : this._possibleValues.call(null, options, $attrs, data, settings);
  }
  if (!data) { return null; }

  switch (this['type']) {
    case vs.ui.Setting.Type['DATA_ROW_LABEL']:
      return u.array.uniqueFast(data.map(function(d) { return d['rowMetadata'].map(function(m) { return m['label']; }); }).reduce(function(m1, m2) { return m1.concat(m2); }));

    case vs.ui.Setting.Type['DATA_COL_LABEL']:
      return data.map(function(d) { return d['label']; });

    case vs.ui.Setting.Type['DATA_COL_ID']:
      return data.map(function(d) { return d['id']; });

    default: return null;
  }
};
//endregion

//region Nested Types
/**
 * @enum {string}
 */
vs.ui.Setting.Type = {
  'NUMBER': 'number',
  'STRING': 'string',
  'ARRAY': 'array',
  'BOOLEAN': 'boolean',
  'OBJECT': 'object',
  'CATEGORICAL': 'categorical',
  'DATA_COL_LABEL': 'dataColLbl',
  'DATA_COL_ID': 'dataColId',
  'DATA_ROW_LABEL': 'dataRowLbl',
  'FUNCTION': 'function'
};
//endregion

//region Static Methods
/**
 * @param {Array.<vs.models.DataSource>} data
 */
vs.ui.Setting.getAllRowMetadata = function(data) {
  return u.array.uniqueFast(data.map(function(d) { return d['rowMetadata'].map(function(m) { return m['label']; }); }).reduce(function(m1, m2) { return m1.concat(m2); }));
};

/**
 * @param {string} dep
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.boundaries = function (dep, options, $attrs, data, settings) {
  var boundaries;
  if (!settings || !(dep in settings)) { throw new vs.ui.UiException('Missing dependency for "' + dep + '" in the "boundaries" defaultValue function'); }

  var depMetadata = /** @type {string} */ (settings[dep].getValue(options, $attrs, data, settings));

  var min, max;
  if (depMetadata) {
    data.forEach(function (d) {
      var m = d.getRowMetadata(depMetadata);
      if (m == null || !('boundaries' in m)) { return; }
      if (min == undefined || min > m['boundaries']['min']) { min = m['boundaries']['min']; }
      if (max == undefined || max < m['boundaries']['max']) { max = m['boundaries']['max']; }
    });

    if (min != undefined && max != undefined) {
      boundaries = new vs.models.Boundaries(min, max);
    }
  }

  if (boundaries == undefined) {
    var values = data.map(function(d) {
      return d['d'].map(function(record) { return record[depMetadata]; });
    });
    min = values.reduce(function(arr1, arr2) {
      return Math.min(Math.min.apply(null, arr1), Math.min.apply(null, arr2));
    });

    max = values.reduce(function(arr1, arr2) {
      return Math.max(Math.max.apply(null, arr1), Math.max.apply(null, arr2));
    });
    if (min != undefined && max != undefined) {
      boundaries = new vs.models.Boundaries(min, max);
    }
  }

  if (boundaries == undefined) {
    throw new vs.ui.UiException('Boundaries could not be determined');
  }

  return boundaries;
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.xBoundaries = function (options, $attrs, data, settings) {
  return vs.ui.Setting.boundaries('xVal', options, $attrs, data, settings);
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.yBoundaries = function (options, $attrs, data, settings) {
  return vs.ui.Setting.boundaries('yVal', options, $attrs, data, settings);
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.firstColsId = function (options, $attrs, data, settings) {
  return data.length ? data[0]['id'] : null;
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.firstRowsLabel = function (options, $attrs, data, settings) {
  return data.length ? data[0]['rowMetadata'][0]['label'] : null;
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
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

  var xBoundaries = /** @type {vs.models.Boundaries} */ (settings['xBoundaries'].getValue(options, $attrs, data, settings));
  var width = /** @type {number} */ (settings['width'].getValue(options, $attrs, data, settings));
  var margins = /** @type {vs.models.Margins} */ (settings['margins'].getValue(options, $attrs, data, settings));
  return d3.scale.linear()
    .domain([xBoundaries['min'], xBoundaries['max']])
    .range([0, width - margins['left'] - margins['right']]);
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
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

  var yBoundaries = /** @type {vs.models.Boundaries} */ (settings['yBoundaries'].getValue(options, $attrs, data, settings));
  var height = /** @type {number} */ (settings['height'].getValue(options, $attrs, data, settings));
  var margins = /** @type {vs.models.Margins} */ (settings['margins'].getValue(options, $attrs, data, settings));
  return d3.scale.linear()
    .domain([yBoundaries['min'], yBoundaries['max']])
    .range([height - margins['top'] - margins['bottom'], 0]);
};

/**
 * @const {function(*):string}
 */
vs.ui.Setting.defaultPalette = d3.scale.category20();

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.mergeColsDefault = function (options, $attrs, data, settings) {
  if (!settings || !('xVal' in settings)) { throw new vs.ui.UiException('Missing dependency for "xVal" in the "mergeCols" defaultValue function'); }
  return vs.ui.Setting.mergeCols;
};

/**
 * @param {string} xVal
 * @param {Array.<vs.models.DataSource>} ds
 * @returns {vs.models.DataSource}
 */
vs.ui.Setting.mergeCols = function(xVal, ds) {
  var ret = {
    'id': ds.map(function(d) { return d['id']; }).join('-'),
    'label': ds.map(function(d) { return d['label']; }).join(', '),
    'rowMetadata': u.array.unique(ds.map(function(d) { return d['rowMetadata']; }).reduce(function(a1, a2) { return a1.concat(a2); })),
    'query': [],
    'metadata': {}
  };

  var map = {};
  var data = [];

  ds.forEach(function(d, i) {
    d['d'].forEach(function(item) {
      var merged = map[item[xVal]];
      if (!merged) {
        merged = {};
        merged[xVal] = item[xVal];
        map[item[xVal]] = merged;
        data.push(merged);
      }
      merged[item['__d__']] = item;
    });
  });

  data.sort(function(it0, it1) {
    if (it0[xVal] == it1[xVal]) { return 0; }
    return (it0[xVal] < it1[xVal]) ? -1 : 1;
  });

  ret['d'] = data;
  return u.reflection.wrap(ret, vs.models.DataSource);
};
//endregion

//region Constants
/**
 * @const {Object.<string, vs.ui.Setting>}
 */
vs.ui.Setting.PredefinedSettings = {
  'col': new vs.ui.Setting({'key':'col', 'type':vs.ui.Setting.Type['DATA_COL_ID'], 'defaultValue':vs.ui.Setting.firstColsId, 'label':'column', 'template':'_categorical.html'}),

  'xVal': new vs.ui.Setting({'key':'xVal', 'type':vs.ui.Setting.Type['DATA_ROW_LABEL'], 'defaultValue':vs.ui.Setting.firstRowsLabel, 'label':'x values', 'template':'_categorical.html'}),
  'yVal': new vs.ui.Setting({'key':'yVal', 'type':vs.ui.Setting.Type['DATA_ROW_LABEL'], 'defaultValue':vs.ui.Setting.firstRowsLabel, 'label':'y values', 'template':'_categorical.html'}),
  'xBoundaries': new vs.ui.Setting({'key':'xBoundaries', 'type':'vs.models.Boundaries', 'defaultValue':vs.ui.Setting.xBoundaries, 'label':'x boundaries', 'template':'_boundaries.html'}),
  'yBoundaries': new vs.ui.Setting({'key':'yBoundaries', 'type':'vs.models.Boundaries', 'defaultValue':vs.ui.Setting.yBoundaries, 'label':'y boundaries', 'template':'_boundaries.html'}),

  // TODO: Margins + width and height could well go in a single template that looks pretty. For the future.
  'margins': new vs.ui.Setting({'key':'margins', 'type':'vs.models.Margins', 'defaultValue':new vs.models.Margins(0, 0, 0, 0), 'template':'_margins.html'}),
  'width': new vs.ui.Setting({'key':'width', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':300, 'template':'_number.html'}),
  'height': new vs.ui.Setting({'key':'height', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':300, 'template':'_number.html'}),

  'cols': new vs.ui.Setting({'key':'cols', 'type':vs.ui.Setting.Type['ARRAY'], 'defaultValue':function(options, $attrs, data) { return data.map(function(d) { return d['id']; }); }, 'label':'columns', 'template':'_multiselect-tbl.html'}),
  'xVals': new vs.ui.Setting({'key':'xVals', 'type':vs.ui.Setting.Type['ARRAY'], 'defaultValue':function(options, $attrs, data) { return vs.ui.Setting.getAllRowMetadata(data); }, 'label':'xs', 'template':'_multiselect-tbl.html'}),
  'yVals': new vs.ui.Setting({'key':'yVals', 'type':vs.ui.Setting.Type['ARRAY'], 'defaultValue':function(options, $attrs, data) { return vs.ui.Setting.getAllRowMetadata(data); }, 'label':'ys', 'template':'_multiselect-tbl.html'}),

  'rowsOrderBy': new vs.ui.Setting({'key':'rowsOrderBy', 'type':vs.ui.Setting.Type['DATA_ROW_LABEL'], 'defaultValue':vs.ui.Setting.firstRowsLabel, 'label':'order rows by', 'template':'_categorical.html'}),
  'rowsScale': new vs.ui.Setting({'key':'rowsScale', 'type':vs.ui.Setting.Type['BOOLEAN'], 'defaultValue':true, 'label':'scale rows axis', 'template':'_switch.html'}),

  'doubleBuffer': new vs.ui.Setting({'key':'doubleBuffer', 'type':vs.ui.Setting.Type['BOOLEAN'], 'defaultValue':true, 'label':'double buffer', 'template':'_switch.html'}),

  'xScale': new vs.ui.Setting({'key':'xScale', 'type':vs.ui.Setting.Type['FUNCTION'], 'defaultValue':vs.ui.Setting.xScale, 'hidden': true}),
  'yScale': new vs.ui.Setting({'key':'yScale', 'type':vs.ui.Setting.Type['FUNCTION'], 'defaultValue':vs.ui.Setting.yScale, 'hidden': true}),

  'fill': new vs.ui.Setting({'key':'fill', 'type':vs.ui.Setting.Type['STRING'], 'defaultValue':'rgba(30,96,212,0.3)', 'label':'object fill'}),
  'fills': new vs.ui.Setting({'key':'fills', 'type':vs.ui.Setting.Type['FUNCTION'], 'defaultValue': function() { return vs.ui.Setting.defaultPalette; }, 'label':'object fill'}),
  'fillOpacity': new vs.ui.Setting({'key':'fillOpacity', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':.3, 'label':'fill opacity'}),
  'stroke': new vs.ui.Setting({'key':'stroke', 'type':vs.ui.Setting.Type['STRING'], 'defaultValue':'rgba(30,96,212,1)', 'label':'object stroke'}),
  'strokes': new vs.ui.Setting({'key':'strokes', 'type':vs.ui.Setting.Type['FUNCTION'], 'defaultValue':function() { return vs.ui.Setting.defaultPalette; }, 'label':'object stroke'}),
  'strokeThickness': new vs.ui.Setting({'key':'strokeThickness', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':1, 'label':'stroke thickness'}),

  'selectFill': new vs.ui.Setting({'key':'selectFill', 'type':vs.ui.Setting.Type['STRING'], 'defaultValue':'#ff6520', 'label':'selected object fill'}),
  'selectStroke': new vs.ui.Setting({'key':'selectStroke', 'type':vs.ui.Setting.Type['STRING'], 'defaultValue':'#ffc600', 'label':'selected object stroke'}),
  'selectStrokeThickness': new vs.ui.Setting({'key':'selectStrokeThickness', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':2, 'label':'selected stroke thickness'}),

  'mergeCols': new vs.ui.Setting({'key': 'mergeCols', 'type': vs.ui.Setting.Type['FUNCTION'], 'defaultValue': vs.ui.Setting.mergeColsDefault, 'hidden': true})
};
//endregion
