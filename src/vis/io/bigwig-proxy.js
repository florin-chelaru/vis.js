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
goog.require('vis.models.bigwig.ChrTreeNode');
goog.require('vis.models.bigwig.ChrTreeNodeItem');
goog.require('vis.models.bigwig.ChrTreeNodeLeaf');
goog.require('vis.models.bigwig.DataRecord');

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
vis.io.BigwigProxy.CHR_TREE_HEADER_SIZE = vis.models.bigwig.BigwigBase.sizeOf(vis.models.bigwig.ChrTreeHeader);

/**
 * @const {number}
 */
vis.io.BigwigProxy.CHR_TREE_NODE_SIZE = vis.models.bigwig.BigwigBase.sizeOf(vis.models.bigwig.ChrTreeNode);

/**
 * @param {number|goog.math.Long} start
 * @param {number|goog.math.Long} end
 * @param {function} callback
 */
vis.io.BigwigProxy.prototype.get = function(start, end, callback) {
  if (start instanceof goog.math.Long) { start = start.toString(); }
  if (end instanceof goog.math.Long) { end = end.toString(); }

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
 * TODO: Another method that reads all zoom headers
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
  /** @type {goog.math.Long} */
  var offset = header.chromosomeTreeOffset;
  this.get(offset, offset.add(goog.math.Long.fromNumber(vis.io.BigwigProxy.CHR_TREE_HEADER_SIZE)), function(e) {
    var buf = e.target.response;
    var ret = vis.models.bigwig.ChrTreeHeader.fromArrayBuffer(buf, header.littleEndian);
    deferred.callback(ret);
  });

  return deferred;
};

/**
 * @param {vis.models.bigwig.Header} header
 * @param {goog.math.Long} offset
 * @returns {goog.async.Deferred.<vis.models.bigwig.ChrTreeNode>}
 */
vis.io.BigwigProxy.prototype.readChrTreeNode = function(header, offset) {
  var deferred = new goog.async.Deferred();
  this.get(offset, offset.add(goog.math.Long.fromNumber(vis.io.BigwigProxy.CHR_TREE_NODE_SIZE)), function(e) {
    var buf = e.target.response;
    var ret = vis.models.bigwig.ChrTreeNode.fromArrayBuffer(buf, header.littleEndian);
    deferred.callback(ret);
  });

  return deferred;
};

/**
 * TODO: Expand once we find a bigwig file with more than one level in the tree
 * @param {vis.models.bigwig.Header} header
 * @param {vis.models.bigwig.ChrTreeHeader} treeHeader
 * @param {goog.math.Long} offset
 * @returns {goog.async.Deferred.<{node: vis.models.bigwig.ChrTreeNode, items: Array.<vis.models.bigwig.ChrTreeNodeItem|vis.models.bigwig.ChrTreeNodeLeaf>}>}
 */
vis.io.BigwigProxy.prototype.readChrTreeBranch = function(header, treeHeader, offset) {
  var self = this;
  var deferred = new goog.async.Deferred();

  var itemSize = treeHeader.keySize + 8;
  var nodeSize = vis.io.BigwigProxy.CHR_TREE_NODE_SIZE;
  var end = offset.add(goog.math.Long.fromNumber(nodeSize + treeHeader.blockSize * itemSize));
  self.get(offset, end, function(e) {
    var buf = e.target.response;
    var node = vis.models.bigwig.ChrTreeNode.fromDataView(new DataView(buf, 0, nodeSize), header.littleEndian);
    var items = [];
    for (var i = 0; i < node.count; ++i) {
      items.push(
        node.isLeaf ?
          vis.models.bigwig.ChrTreeNodeLeaf.fromDataView(new DataView(buf, nodeSize + i * itemSize, itemSize), treeHeader.keySize, header.littleEndian) :
          vis.models.bigwig.ChrTreeNodeItem.fromDataView(new DataView(buf, nodeSize + i * itemSize, itemSize), treeHeader.keySize, header.littleEndian)
      );
    }
    deferred.callback({node: node, items: items});
  });

  return deferred;
};

/**
 * @param {vis.models.bigwig.Header} header
 * @returns {goog.async.Deferred}
 */
vis.io.BigwigProxy.prototype.readDataCount = function(header) {
  var deferred = new goog.async.Deferred();
  var offset = header.fullDataOffset;
  this.get(offset, offset.add(goog.math.Long.fromNumber(4)), function(e) {
    var buf = e.target.response;
    var view = new DataView(buf);
    deferred.callback(view.getUint32(0, header.littleEndian));
  });
  return deferred;
};

/**
 * @param {vis.models.bigwig.Header} header
 * @param {goog.math.Long} offset
 * @returns {goog.async.Deferred}
 */
vis.io.BigwigProxy.prototype.readDataRecord = function(header, offset) {
  var deferred = new goog.async.Deferred();
  this.get(offset, offset.add(goog.math.Long.fromNumber(24)), function(e) {
    var buf = e.target.response;
    var view = new DataView(buf);

    var record = vis.models.bigwig.DataRecord.fromArrayBuffer(buf, header.littleEndian);

    deferred.callback(record);
  });
  return deferred;
};

/**
 * @param {vis.models.bigwig.Header} header
 * @returns {goog.async.Deferred}
 */
vis.io.BigwigProxy.prototype.readDataRecords = function(header) {
  var deferred = new goog.async.Deferred();
  var self = this;
  var offset = header.fullDataOffset.add(goog.math.Long.fromNumber(4));
  var records = [];
  this.readDataCount(header)
    .then(function(dataCount) {
      self.readDataRecord(header, offset)
        .then(function(record) {
          records.push(record);
          return self.readDataRecord(header, offset.add(goog.math.Long.fromNumber(24)));
        })
        .then(function(record) {
          records.push(record);
          deferred.callback(records);
        })
    });

  return deferred;
};
