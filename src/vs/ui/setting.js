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
 *  possibleValues: (*|function(Object.<string, *>, *, Array.<vs.models.DataSource>, Object.<string, vs.ui.Setting>)|undefined),
 *  dependencies: (Object.<string, string>|undefined)
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
   * @type {*|function(Object.<string, *>, *, (Array.<vs.models.DataSource>|undefined), (Object.<string, vs.ui.Setting>|undefined))|null}
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

  /**
   * @type {Object.<string, string>}
   */
  this['dependencies'] = args['dependencies'];
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
    return (typeof self['defaultValue'] == 'function') ? self['defaultValue'].call(null, self, options, $attrs, data, settings) : self['defaultValue'];
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
      // if (typeof val == 'function') { return val.call(null, options, $attrs, data, settings); }
      if (typeof val == 'function') { return val; }
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
      return vs.models.DataSource.combinedArrayMetadata(data);

    case vs.ui.Setting.Type['DATA_COL_LABEL']:
      return u.fast.map(data, function(d) { return d['label']; });

    case vs.ui.Setting.Type['DATA_COL_ID']:
      return u.fast.map(data, function(d) { return d['id']; });

    default: return null;
  }
};

/**
 * @param {{
 *  key: string,
 *  type: (vs.ui.Setting.Type|string|undefined),
 *  defaultValue: (function(Object.<string, *>, *, Array.<vs.models.DataSource>, Object.<string, vs.ui.Setting>)|*),
 *  label: (string|undefined),
 *  template: (string|undefined),
 *  hidden: (boolean|undefined),
 *  possibleValues: (*|function(Object.<string, *>, *, Array.<vs.models.DataSource>, Object.<string, vs.ui.Setting>)|undefined),
 *  dependencies: (Object.<string, string>|undefined)
 * }} options
 */
vs.ui.Setting.prototype.copy = function(options) {
  return new vs.ui.Setting({
    'key': options['key'] || this['key'],
    'type': options['type'] || this['type'],
    'defaultValue': options['defaultValue'] || this['defaultValue'],
    'label': options['label'] || this['label'],
    'template': options['template'] || this['template'],
    'hidden': options['hidden'] || this['hidden'],
    'possibleValues': options['possibleValues'] || this._possibleValues,
    'dependencies': u.extend({}, (this['dependencies'] || {}), (options['dependencies'] || {}))
  });
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
 * @param {string} rowMetadataLabel
 * @returns {vs.models.DataSource.FieldType}
 */
vs.ui.Setting.metadataType = function(data, rowMetadataLabel) {
  return u.fast.map(data, function(d) {
    var m = d.getRowMetadata(rowMetadataLabel);
    if (m == undefined) { return null; }
    return m['type'];
  }).reduce(function(t1, t2) {
    if (t1 == t2) { return t1; }
    if (t1 == null) { return t2; }
    if (t2 == null) { return t1; }

    // If we cannot determine the type, we default to string
    return vs.models.DataSource.FieldType['STRING'];
  });
};

/**
 * @param {vs.ui.Setting} setting
 * @param {string} metadataField
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.boundaries = function (setting, metadataField, options, $attrs, data, settings) {
  var boundaries;
  var deps = setting['dependencies'];
  if (!settings) { throw new vs.ui.UiException('Settings not provided for "' + setting['key'] + '", which depends on ' + JSON.stringify(deps)); }
  u.each(deps, function(key, dep) {
    if (!(dep in settings)) {
      throw new vs.ui.UiException('Missing dependency for "' + dep + '" in the "mergeCols" defaultValue function');
    }
  });

  var depMetadata = /** @type {string} */ (settings[deps[metadataField]].getValue(options, $attrs, data, settings));

  /**
   * @type {vs.models.DataSource.FieldType}
   */
  var metadataType = vs.ui.Setting.metadataType(/** @type {Array.<vs.models.DataSource>} */ (data), depMetadata);

  var min, max;

  switch (metadataType) {
    case vs.models.DataSource.FieldType['NUMBER']:
      u.fast.forEach(/** @type {Array.<vs.models.DataSource>} */ (data), function (d) {
        var m = d.getRowMetadata(depMetadata);
        if (m == null || !('boundaries' in m)) { return; }
        if (min == undefined || min > m['boundaries']['min']) { min = m['boundaries']['min']; }
        if (max == undefined || max < m['boundaries']['max']) { max = m['boundaries']['max']; }
      });

      if (min != undefined && max != undefined) {
        boundaries = new vs.models.Boundaries(min, max);
      }

      if (boundaries == undefined) {
        var values = u.fast.concat(u.fast.map(/** @type {Array.<vs.models.DataSource>} */ (data), function(d) {
          return u.fast.map(d['d'], function(record) { return record[depMetadata]; });
        }));
        min = Math.min.apply(null, values);
        max = Math.max.apply(null, values);

        if (min != undefined && max != undefined) {
          boundaries = new vs.models.Boundaries(min, max);
        }
      }
      break;
    case vs.models.DataSource.FieldType['BOOLEAN']:
      boundaries = new vs.models.Boundaries(0, 1);
      break;
    case vs.models.DataSource.FieldType['FACTOR']:
      min = 0;
      u.fast.forEach(/** @type {Array.<vs.models.DataSource>} */ (data), function (d) {
        var m = d.getRowMetadata(depMetadata);
        if (m == null || !('levels' in m)) { return; }
        if (max == undefined || max < m['levels'].length) { max = m['levels'].length; }
      });

      if (min != undefined && max != undefined) {
        boundaries = new vs.models.Boundaries(min, max - 1);
      }
      break;
    case vs.models.DataSource.FieldType['STRING']:
    default:
      var uniques = u.array.uniqueFast(u.fast.concat(u.fast.map(/** @type {Array.<vs.models.DataSource>} */ (data), function(d) {
        return u.fast.map(d['d'], function(record) { return record[depMetadata]; });
      })));
      min = 0;
      max = uniques.length - 1;

      boundaries = new vs.models.Boundaries(min, max);
  }


  if (boundaries == undefined) {
    throw new vs.ui.UiException('Boundaries could not be determined');
  }

  return boundaries;
};

/**
 * @param {vs.ui.Setting} setting
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.xBoundaries = function (setting, options, $attrs, data, settings) {
  return vs.ui.Setting.boundaries(setting, 'xField', options, $attrs, data, settings);
};

/**
 * @param {vs.ui.Setting} setting
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.yBoundaries = function (setting, options, $attrs, data, settings) {
  return vs.ui.Setting.boundaries(setting, 'yField', options, $attrs, data, settings);
};

/**
 * @param {vs.ui.Setting} setting
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.firstColsId = function (setting, options, $attrs, data, settings) {
  return data.length ? data[0]['id'] : null;
};

/**
 * @param {vs.ui.Setting} setting
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.firstRowsLabel = function (setting, options, $attrs, data, settings) {
  return data.length ? data[0]['rowMetadata'][0]['label'] : null;
};

/**
 * @param {vs.ui.Setting} setting
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.firstRowsLabelNumeric = function (setting, options, $attrs, data, settings) {
  var ret = null;
  for (var i = 0; i < data.length; ++i) {
    var m = data[i]['rowMetadata'];
    for (var j = 0; j < m.length; ++j) {
      if (vs.ui.Setting.metadataType(data, m[j]['label']) == vs.models.DataSource.FieldType['NUMBER']) {
        return m[j]['label'];
      }
    }
  }
  return null;
};

/**
 * @param {vs.ui.Setting} setting
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.xScale = function (setting, options, $attrs, data, settings) {
  var dependencies = setting['dependencies'];
  if (!settings) { throw new vs.ui.UiException('Settings not provided for "xScale", which depends on ' + JSON.stringify(dependencies)); }
  u.each(dependencies, function(key, dep) {
    if (!(dep in settings)) {
      throw new vs.ui.UiException('Missing dependency for "' + dep + '" in the "xScale" defaultValue function');
    }
  });

  var xBoundaries = /** @type {vs.models.Boundaries} */ (settings[dependencies['xBoundaries']].getValue(options, $attrs, data, settings));
  var width = /** @type {number} */ (settings[dependencies['width']].getValue(options, $attrs, data, settings));
  var margins = /** @type {vs.models.Margins} */ (settings[dependencies['margins']].getValue(options, $attrs, data, settings));

  return d3.scale.linear()
    .domain([xBoundaries['min'], xBoundaries['max']])
    .range([0, width - margins['left'] - margins['right']]);
};

/**
 * @param {vs.ui.Setting} setting
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.yScale = function (setting, options, $attrs, data, settings) {
  var dependencies = setting['dependencies'];
  if (!settings) { throw new vs.ui.UiException('Settings not provided for "' + setting['key'] + '", which depends on ' + JSON.stringify(dependencies)); }

  u.each(dependencies, function(key, dep) {
    if (!(dep in settings)) {
      throw new vs.ui.UiException('Missing dependency for "' + dep + '" in the "yScale" defaultValue function');
    }
  });

  var yBoundaries = /** @type {vs.models.Boundaries} */ (settings[dependencies['yBoundaries']].getValue(options, $attrs, data, settings));
  var height = /** @type {number} */ (settings[dependencies['height']].getValue(options, $attrs, data, settings));
  var margins = /** @type {vs.models.Margins} */ (settings[dependencies['margins']].getValue(options, $attrs, data, settings));
  return d3.scale.linear()
    .domain([yBoundaries['min'], yBoundaries['max']])
    .range([height - margins['top'] - margins['bottom'], 0]);
};

/**
 * @const {function(*):string}
 */
vs.ui.Setting.defaultPalette = d3.scale.category20();

/**
 * @param {vs.ui.Setting} setting
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {Array.<vs.models.DataSource>} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.mergeColsDefault = function (setting, options, $attrs, data, settings) {
  var deps = setting['dependencies'];
  if (!settings) { throw new vs.ui.UiException('Settings not provided for "' + setting['key'] + '", which depends on ' + JSON.stringify(deps)); }
  u.each(deps, function(key, dep) {
    if (!(dep in settings)) {
      throw new vs.ui.UiException('Missing dependency for "' + dep + '" in the "mergeCols" defaultValue function');
    }
  });

  return vs.ui.Setting.mergeCols;
};

/**
 * @param {string} xField
 * @param {Array.<vs.models.DataSource>} ds
 * @returns {vs.models.DataSource}
 */
vs.ui.Setting.mergeCols = function(xField, ds) {
  var ret = {
    'id': u.fast.map(ds, function(d) { return d['id']; }).join('-'),
    'label': u.fast.map(ds, function(d) { return d['label']; }).join(', '),
    'rowMetadata': u.array.unique(u.fast.concat(u.fast.map(ds, function(d) { return d['rowMetadata']; }))),
    'query': [],
    'metadata': {}
  };

  var map = {};
  var data = [];

  for (var i = 0; i < ds.length; ++i) {
    var d = ds[i]['d'];
    for (var j = 0; j < d.length; ++j) {
      var item = d[j];
      var key = item[xField];

      var merged = map[key];
      if (!merged) {
        merged = {};
        merged[xField] = key;
        map[key] = merged;
        data.push(merged);
      }
      merged[item['__d__']] = item;
    }
  }

  data.sort(function(it0, it1) {
    if (it0[xField] == it1[xField]) { return 0; }
    return (it0[xField] < it1[xField]) ? -1 : 1;
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

  'xField': new vs.ui.Setting({'key':'xField', 'type':vs.ui.Setting.Type['DATA_ROW_LABEL'], 'defaultValue':vs.ui.Setting.firstRowsLabelNumeric, 'label':'x values', 'template':'_categorical.html'}),
  'yField': new vs.ui.Setting({'key':'yField', 'type':vs.ui.Setting.Type['DATA_ROW_LABEL'], 'defaultValue':vs.ui.Setting.firstRowsLabelNumeric, 'label':'y values', 'template':'_categorical.html'}),
  'xBoundaries': new vs.ui.Setting({'key':'xBoundaries', 'type':'vs.models.Boundaries', 'defaultValue':vs.ui.Setting.xBoundaries, 'label':'x boundaries', 'dependencies': {'xField':'xField'}, 'template':'_boundaries.html'}),
  'yBoundaries': new vs.ui.Setting({'key':'yBoundaries', 'type':'vs.models.Boundaries', 'defaultValue':vs.ui.Setting.yBoundaries, 'label':'y boundaries', 'dependencies': {'yField':'yField'}, 'template':'_boundaries.html'}),

  // TODO: Margins + width and height could well go in a single template that looks pretty. For the future.
  'x': new vs.ui.Setting({'key':'x', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':0}),
  'y': new vs.ui.Setting({'key':'y', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':0}),
  'margins': new vs.ui.Setting({'key':'margins', 'type':'vs.models.Margins', 'defaultValue':function() { return new vs.models.Margins(0, 0, 0, 0); }}),
  'width': new vs.ui.Setting({'key':'width', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':300}),
  'height': new vs.ui.Setting({'key':'height', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':300}),

  'cols': new vs.ui.Setting({'key':'cols', 'type':vs.ui.Setting.Type['ARRAY'], 'defaultValue':function(setting, options, $attrs, data) { return u.fast.map(data, function(d) { return d['id']; }); }, 'label':'columns', 'template':'_multiselect-tbl.html',
    'possibleValues': function(options, $attrs, data, settings) { return u.fast.map(data, function(d) { return d['id']; }); }}),
  'xVals': new vs.ui.Setting({'key':'xVals', 'type':vs.ui.Setting.Type['ARRAY'], 'defaultValue':function(setting, options, $attrs, data) { return vs.models.DataSource.combinedArrayMetadata(data); }, 'label':'xs', 'template':'_multiselect-tbl.html'}),
  'yVals': new vs.ui.Setting({'key':'yVals', 'type':vs.ui.Setting.Type['ARRAY'], 'defaultValue':function(setting, options, $attrs, data) { return vs.models.DataSource.combinedArrayMetadata(data); }, 'label':'ys', 'template':'_multiselect-tbl.html'}),

  'rowsOrderBy': new vs.ui.Setting({'key':'rowsOrderBy', 'type':vs.ui.Setting.Type['DATA_ROW_LABEL'], 'defaultValue':vs.ui.Setting.firstRowsLabel, 'label':'order rows by', 'template':'_categorical.html'}),
  'rowsScale': new vs.ui.Setting({'key':'rowsScale', 'type':vs.ui.Setting.Type['BOOLEAN'], 'defaultValue':true, 'label':'scale rows axis', 'template':'_switch.html'}),

  'doubleBuffer': new vs.ui.Setting({'key':'doubleBuffer', 'type':vs.ui.Setting.Type['BOOLEAN'], 'defaultValue':true, 'label':'double buffer', 'template':'_switch.html'}),

  'xScale': new vs.ui.Setting({'key':'xScale', 'type':vs.ui.Setting.Type['FUNCTION'], 'defaultValue':vs.ui.Setting.xScale, 'dependencies': {'xBoundaries':'xBoundaries', 'width':'width', 'margins':'margins'}, 'hidden': true}),
  'yScale': new vs.ui.Setting({'key':'yScale', 'type':vs.ui.Setting.Type['FUNCTION'], 'defaultValue':vs.ui.Setting.yScale, 'dependencies': {'yBoundaries':'yBoundaries', 'height':'height', 'margins':'margins'}, 'hidden': true}),

  'fill': new vs.ui.Setting({'key':'fill', 'type':vs.ui.Setting.Type['STRING'], 'defaultValue':'rgba(30,96,212,0.3)', 'label':'object fill', 'template': '_color.html'}),
  'fills': new vs.ui.Setting({'key':'fills', 'type':vs.ui.Setting.Type['FUNCTION'], 'defaultValue': function() { return vs.ui.Setting.defaultPalette; }, 'label':'object fill'}),
  'fillOpacity': new vs.ui.Setting({'key':'fillOpacity', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':.3, 'label':'fill opacity'}),
  'stroke': new vs.ui.Setting({'key':'stroke', 'type':vs.ui.Setting.Type['STRING'], 'defaultValue':'rgba(30,96,212,1)', 'label':'object stroke', 'template': '_color.html'}),
  'strokes': new vs.ui.Setting({'key':'strokes', 'type':vs.ui.Setting.Type['FUNCTION'], 'defaultValue':function() { return vs.ui.Setting.defaultPalette; }, 'label':'object stroke'}),
  'strokeThickness': new vs.ui.Setting({'key':'strokeThickness', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':1, 'label':'stroke thickness', 'template': '_number.html'}),

  'selectFill': new vs.ui.Setting({'key':'selectFill', 'type':vs.ui.Setting.Type['STRING'], 'defaultValue':'#ff6520', 'label':'selected object fill', 'template': '_color.html'}),
  'selectStroke': new vs.ui.Setting({'key':'selectStroke', 'type':vs.ui.Setting.Type['STRING'], 'defaultValue':'#ffc600', 'label':'selected object stroke', 'template': '_color.html'}),
  'selectStrokeThickness': new vs.ui.Setting({'key':'selectStrokeThickness', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':2, 'label':'selected stroke thickness', 'template': '_number.html'}),

  'mergeCols': new vs.ui.Setting({'key': 'mergeCols', 'type': vs.ui.Setting.Type['FUNCTION'], 'defaultValue': vs.ui.Setting.mergeColsDefault, 'dependencies': {'xCol':'xCol'}, 'hidden': true})
};
//endregion
