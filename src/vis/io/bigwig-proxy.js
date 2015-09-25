/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 11:24 AM
 */

goog.provide('vis.io.BigwigProxy');

goog.require('vis.models.ModelsException');
goog.require('goog.async.Deferred');

goog.require('vis.models.bigwig.Header');
goog.require('vis.models.bigwig.ZoomHeader');
goog.require('vis.models.bigwig.TotalSummary');
goog.require('vis.models.bigwig.ChrTreeHeader');

/**
 * @param {string} uri
 * @constructor
 */
vis.io.BigwigProxy = function(uri) {
  /**
   * @type {string}
   * @private
   */
  this._uri = uri;
};

/**
 * @const {number}
 */
vis.io.BigwigProxy.HEADER_SIZE = vis.models.bigwig.BigwigBase.sizeOf(vis.models.bigwig.Header);

/**
 * @const {number}
 */
vis.io.BigwigProxy.ZOOM_HEADER_SIZE = vis.models.bigwig.BigwigBase.sizeOf(vis.models.bigwig.ZoomHeader);

/**
 * @const {number}
 */
vis.io.BigwigProxy.TOTAL_SUMMARY_SIZE = vis.models.bigwig.BigwigBase.sizeOf(vis.models.bigwig.TotalSummary);

/**
 * @const {number}
 */
vis.io.BigwigProxy.CHR_B_TREE_HEADER_SIZE = vis.models.bigwig.BigwigBase.sizeOf(vis.models.bigwig.ChrTreeHeader);

/**
 * @param {number} start
 * @param {number} end
 * @param {function} callback
 */
vis.io.BigwigProxy.prototype.get = function(start, end, callback) {
  var req = new XMLHttpRequest();
  req.open('GET', this._uri, true);
  req.setRequestHeader('Range', goog.string.format('bytes=%s-%s', start, end - 1));
  req.responseType = 'arraybuffer';
  req.onload = callback;
  req.send();
};

/**
 * @returns {goog.async.Deferred.<vis.models.bigwig.Header>}
 */
vis.io.BigwigProxy.prototype.readHeader = function() {
  var deferred = new goog.async.Deferred();
  this.get(0, vis.io.BigwigProxy.HEADER_SIZE, function(e) {
    var buf = e.target.response;
    var header = vis.models.bigwig.Header.fromArrayBuffer(buf);
    deferred.callback(header);
  });
  return deferred;
};

/**
 * @param {vis.models.bigwig.Header} header
 * @param {number} index
 * @returns {goog.async.Deferred.<vis.models.bigwig.ZoomHeader>}
 */
vis.io.BigwigProxy.prototype.readZoomHeader = function(header, index) {
  if (index >= header.zoomLevels || index < 0) { throw new vis.models.ModelsException('Bigwig: invalid zoom index'); }
  var deferred = new goog.async.Deferred();
  var offset = vis.io.BigwigProxy.HEADER_SIZE;
  var zoomHeaderSize = vis.io.BigwigProxy.ZOOM_HEADER_SIZE;
  this.get(offset + index * zoomHeaderSize, offset + (index + 1) * zoomHeaderSize, function(e) {
    var buf = e.target.response;
    var ret = vis.models.bigwig.ZoomHeader.fromArrayBuffer(buf, header.littleEndian);
    deferred.callback(ret);
  });

  return deferred;
};

/**
 * @param {vis.models.bigwig.Header} header
 * @returns {goog.async.Deferred.<vis.models.bigwig.ZoomHeader>}
 */
vis.io.BigwigProxy.prototype.readTotalSummary = function(header) {
  var deferred = new goog.async.Deferred();
  var offset =
    vis.io.BigwigProxy.HEADER_SIZE +
    vis.io.BigwigProxy.ZOOM_HEADER_SIZE * header.zoomLevels;
  this.get(offset, offset + vis.io.BigwigProxy.TOTAL_SUMMARY_SIZE, function(e) {
    var buf = e.target.response;
    var ret = vis.models.bigwig.TotalSummary.fromArrayBuffer(buf, header.littleEndian);
    deferred.callback(ret);
  });

  return deferred;
};

/**
 * @param {vis.models.bigwig.Header} header
 * @returns {goog.async.Deferred.<vis.models.bigwig.ZoomHeader>}
 */
vis.io.BigwigProxy.prototype.readChrTreeHeader = function(header) {
  var deferred = new goog.async.Deferred();
  var offset = header.chromosomeTreeOffset.toString();
  this.get(offset, offset + vis.io.BigwigProxy.CHR_B_TREE_HEADER_SIZE, function(e) {
    var buf = e.target.response;
    var ret = vis.models.bigwig.ChrTreeHeader.fromArrayBuffer(buf, header.littleEndian);
    deferred.callback(ret);
  });

  return deferred;
};
