/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 11:24 AM
 */

goog.provide('bigwig.BigwigReader');

//goog.require('goog.async.Deferred');

goog.require('bigwig.Header');
goog.require('bigwig.ZoomHeader');
goog.require('bigwig.TotalSummary');
goog.require('bigwig.ChrTreeHeader');
goog.require('bigwig.ChrTreeNode');
goog.require('bigwig.ChrTreeNodeItem');
goog.require('bigwig.ChrTreeNodeLeaf');
goog.require('bigwig.SectionHeader');
goog.require('bigwig.RTreeHeader');
goog.require('bigwig.RTreeNode');
goog.require('bigwig.RTreeNodeItem');
goog.require('bigwig.RTreeNodeLeaf');
goog.require('bigwig.FixedStepRecord');
goog.require('bigwig.VariableStepRecord');
goog.require('bigwig.BedGraphRecord');

/**
 * @param {string} uri
 * @constructor
 */
bigwig.BigwigReader = function(uri) {
  /**
   * @type {string}
   * @private
   */
  this._uri = uri;
};

/**
 * @const {number}
 */
bigwig.BigwigReader.HEADER_SIZE = bigwig.BigwigStruct.sizeOf(bigwig.Header);

/**
 * @const {number}
 */
bigwig.BigwigReader.ZOOM_HEADER_SIZE = bigwig.BigwigStruct.sizeOf(bigwig.ZoomHeader);

/**
 * @const {number}
 */
bigwig.BigwigReader.TOTAL_SUMMARY_SIZE = bigwig.BigwigStruct.sizeOf(bigwig.TotalSummary);

/**
 * @const {number}
 */
bigwig.BigwigReader.CHR_TREE_HEADER_SIZE = bigwig.BigwigStruct.sizeOf(bigwig.ChrTreeHeader);

/**
 * @const {number}
 */
bigwig.BigwigReader.CHR_TREE_NODE_SIZE = bigwig.BigwigStruct.sizeOf(bigwig.ChrTreeNode);

/**
 * @const {number}
 */
bigwig.BigwigReader.R_TREE_HEADER_SIZE = bigwig.BigwigStruct.sizeOf(bigwig.RTreeHeader);

/**
 * @const {number}
 */
bigwig.BigwigReader.R_TREE_NODE_SIZE = bigwig.BigwigStruct.sizeOf(bigwig.RTreeNode);

/**
 * @const {number}
 */
bigwig.BigwigReader.R_TREE_NODE_ITEM_SIZE = bigwig.BigwigStruct.sizeOf(bigwig.RTreeNodeItem);

/**
 * @const {number}
 */
bigwig.BigwigReader.R_TREE_NODE_LEAF_SIZE = bigwig.BigwigStruct.sizeOf(bigwig.RTreeNodeLeaf);

/**
 * @const {number}
 */
bigwig.BigwigReader.SECTION_HEADER_SIZE = bigwig.BigwigStruct.sizeOf(bigwig.SectionHeader);

/**
 * @type {Object.<number, function(new: bigwig.Record)>}
 */
bigwig.BigwigReader.RECORD_TYPES = {
  1: bigwig.BedGraphRecord,
  2: bigwig.VariableStepRecord,
  3: bigwig.FixedStepRecord
};

/**
 * @param {number|goog.math.Long} start
 * @param {number|goog.math.Long} end
 * @param {function} callback
 */
bigwig.BigwigReader.prototype.get = function(start, end, callback) {
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
 * @returns {goog.async.Deferred.<bigwig.Header>}
 */
bigwig.BigwigReader.prototype.readHeader = function() {
  var deferred = new goog.async.Deferred();
  this.get(0, bigwig.BigwigReader.HEADER_SIZE, function(e) {
    var buf = e.target.response;
    var header = bigwig.Header.fromArrayBuffer(buf);
    deferred.callback(header);
  });
  return deferred;
};

/**
 * TODO: Another method that reads all zoom headers
 * @param {bigwig.Header} header
 * @param {number} index
 * @returns {goog.async.Deferred.<bigwig.ZoomHeader>}
 */
bigwig.BigwigReader.prototype.readZoomHeader = function(header, index) {
  if (index >= header.zoomLevels || index < 0) { throw new bigwig.Exception('Bigwig: invalid zoom index'); }
  var deferred = new goog.async.Deferred();
  var offset = bigwig.BigwigReader.HEADER_SIZE;
  var zoomHeaderSize = bigwig.BigwigReader.ZOOM_HEADER_SIZE;
  this.get(offset + index * zoomHeaderSize, offset + (index + 1) * zoomHeaderSize, function(e) {
    var buf = e.target.response;
    var ret = bigwig.ZoomHeader.fromArrayBuffer(buf, header.littleEndian);
    deferred.callback(ret);
  });

  return deferred;
};

/**
 * @param {bigwig.Header} header
 * @returns {goog.async.Deferred.<bigwig.ZoomHeader>}
 */
bigwig.BigwigReader.prototype.readTotalSummary = function(header) {
  var deferred = new goog.async.Deferred();
  var offset =
    bigwig.BigwigReader.HEADER_SIZE +
    bigwig.BigwigReader.ZOOM_HEADER_SIZE * header.zoomLevels;
  this.get(offset, offset + bigwig.BigwigReader.TOTAL_SUMMARY_SIZE, function(e) {
    var buf = e.target.response;
    var ret = bigwig.TotalSummary.fromArrayBuffer(buf, header.littleEndian);
    deferred.callback(ret);
  });

  return deferred;
};

/**
 * @param {bigwig.Header} header
 * @returns {goog.async.Deferred.<bigwig.ChrTreeHeader>}
 */
bigwig.BigwigReader.prototype.readChrTreeHeader = function(header) {
  var deferred = new goog.async.Deferred();
  /** @type {goog.math.Long} */
  var offset = header.chromosomeTreeOffset;
  this.get(offset, offset.add(goog.math.Long.fromNumber(bigwig.BigwigReader.CHR_TREE_HEADER_SIZE)), function(e) {
    var buf = e.target.response;
    var ret = bigwig.ChrTreeHeader.fromArrayBuffer(buf, header.littleEndian);
    deferred.callback(ret);
  });

  return deferred;
};

/**
 * @param {bigwig.Header} header
 * @param {goog.math.Long} offset
 * @returns {goog.async.Deferred.<bigwig.ChrTreeNode>}
 */
bigwig.BigwigReader.prototype.readChrTreeNode = function(header, offset) {
  var deferred = new goog.async.Deferred();
  this.get(offset, offset.add(goog.math.Long.fromNumber(bigwig.BigwigReader.CHR_TREE_NODE_SIZE)), function(e) {
    var buf = e.target.response;
    var ret = bigwig.ChrTreeNode.fromArrayBuffer(buf, header.littleEndian);
    deferred.callback(ret);
  });

  return deferred;
};

/**
 * TODO: Expand once we find a bigwig file with more than one level in the tree
 * @param {bigwig.Header} header
 * @param {bigwig.ChrTreeHeader} treeHeader
 * @param {goog.math.Long} offset
 * @returns {goog.async.Deferred.<{node: bigwig.ChrTreeNode, items: Array.<bigwig.ChrTreeNodeItem|bigwig.ChrTreeNodeLeaf>}>}
 */
bigwig.BigwigReader.prototype.readChrTreeBranch = function(header, treeHeader, offset) {
  var self = this;
  var deferred = new goog.async.Deferred();

  var itemSize = treeHeader.keySize + 8;
  var nodeSize = bigwig.BigwigReader.CHR_TREE_NODE_SIZE;
  // TODO: There may be a bug here: treeHeader.blockSize may not always have the exact number of items!
  var end = offset.add(goog.math.Long.fromNumber(nodeSize + treeHeader.blockSize * itemSize));
  self.get(offset, end, function(e) {
    var buf = e.target.response;
    var node = bigwig.ChrTreeNode.fromDataView(new DataView(buf, 0, nodeSize), header.littleEndian);
    var items = [];
    for (var i = 0; i < node.count; ++i) {
      items.push(
        node.isLeaf ?
          bigwig.ChrTreeNodeLeaf.fromDataView(new DataView(buf, nodeSize + i * itemSize, itemSize), treeHeader.keySize, header.littleEndian) :
          bigwig.ChrTreeNodeItem.fromDataView(new DataView(buf, nodeSize + i * itemSize, itemSize), treeHeader.keySize, header.littleEndian)
      );
    }
    deferred.callback({node: node, items: items});
  });

  return deferred;
};

/**
 * @param {bigwig.Header} header
 * @returns {goog.async.Deferred}
 */
bigwig.BigwigReader.prototype.readDataCount = function(header) {
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
 * @param {bigwig.Header} header
 * @param {goog.math.Long} offset
 * @returns {goog.async.Deferred}
 */
/*bigwig.BigwigReader.prototype.readDataRecord = function(header, offset) {
  var deferred = new goog.async.Deferred();
  this.get(offset, offset.add(goog.math.Long.fromNumber(24)), function(e) {
    var buf = e.target.response;
    var view = new DataView(buf);

    var record = bigwig.SectionHeader.fromArrayBuffer(buf, header.littleEndian);

    deferred.callback(record);
  });
  return deferred;
};*/

/**
 * @param {bigwig.Header} header
 * @returns {goog.async.Deferred}
 */
/*bigwig.BigwigReader.prototype.readDataRecords = function(header) {
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
};*/

/**
 * @param {bigwig.Header} header
 * @returns {goog.async.Deferred.<bigwig.RTreeHeader>}
 */
bigwig.BigwigReader.prototype.readRTreeHeader = function(header) {
  var deferred = new goog.async.Deferred();
  /** @type {goog.math.Long} */
  var offset = header.fullIndexOffset;
  this.get(offset, offset.add(goog.math.Long.fromNumber(bigwig.BigwigReader.R_TREE_HEADER_SIZE)), function(e) {
    var buf = e.target.response;
    var ret = bigwig.RTreeHeader.fromArrayBuffer(buf, header.littleEndian);
    deferred.callback(ret);
  });

  return deferred;
};

/**
 * @param {bigwig.Header} header
 * @param {goog.math.Long} offset
 * @returns {goog.async.Deferred.<bigwig.RTreeHeader>}
 */
bigwig.BigwigReader.prototype.readRTreeNode = function(header, offset) {
  var deferred = new goog.async.Deferred();
  this.get(offset, offset.add(goog.math.Long.fromNumber(bigwig.BigwigReader.R_TREE_NODE_SIZE)), function(e) {
    var buf = e.target.response;
    var ret = bigwig.RTreeNode.fromArrayBuffer(buf, header.littleEndian);
    deferred.callback(ret);
  });

  return deferred;
};

/**
 * TODO: Expand once we find a bigwig file with more than one level in the tree
 * @param {bigwig.Header} header
 * @param {bigwig.RTreeHeader} treeHeader
 * @param {goog.math.Long} offset
 * @returns {goog.async.Deferred.<{node: bigwig.ChrTreeNode, items: Array.<bigwig.ChrTreeNodeItem|bigwig.ChrTreeNodeLeaf>}>}
 */
bigwig.BigwigReader.prototype.readRTreeNodeItems = function(header, treeHeader, offset) {
  var self = this;
  var deferred = new goog.async.Deferred();

  this.readRTreeNode(header, offset)
    .then(function(node) {
      var itemsOffset = offset.add(goog.math.Long.fromNumber(bigwig.BigwigReader.R_TREE_NODE_SIZE));
      var itemSize = node.isLeaf ? bigwig.BigwigReader.R_TREE_NODE_LEAF_SIZE : bigwig.BigwigReader.R_TREE_NODE_ITEM_SIZE;
      var end = itemsOffset.add(goog.math.Long.fromNumber(node.count * itemSize));
      self.get(itemsOffset, end, function(e) {
        var buf = e.target.response;
        var items = [];
        for (var i = 0; i < node.count; ++i) {
          items.push(
            node.isLeaf ?
              bigwig.RTreeNodeLeaf.fromDataView(new DataView(buf, i * itemSize, itemSize), header.littleEndian) :
              bigwig.RTreeNodeItem.fromDataView(new DataView(buf, i * itemSize, itemSize), header.littleEndian)
          );
        }
        deferred.callback({node: node, items: items});
      });
    });

  return deferred;
};

/**
 * @param {bigwig.Header} header
 * @returns {goog.async.Deferred.<{}>}
 */
bigwig.BigwigReader.prototype.readRTree = function(header) {
  var self = this;
  var deferred = new goog.async.Deferred();

  var tree = {nodes:[]};
  //var nodes = [];

  var rTreeHeader;
  self.readRTreeHeader(header)
    .then(function(d) {
      rTreeHeader = d;
      tree.header = d;
      //tree.branches = [];


      /** @type {goog.math.Long} */
      var offset = header.fullIndexOffset.add(goog.math.Long.fromNumber(bigwig.BigwigReader.R_TREE_HEADER_SIZE));
      var seq = [new goog.async.Deferred()];
      for (var i = 0; i < rTreeHeader.itemCount; ++i) {
        seq.push(new goog.async.Deferred());
        seq[i].then(function(j) {
          //self.readRTreeNodeItems(header, rTreeHeader, offset)
          self.readRTreeNode(header, offset)
            .then(function(d) {
              //tree.branches.push(d);
              tree.nodes.push(d);
              offset = offset.add(goog.math.Long.fromNumber(
                bigwig.BigwigReader.R_TREE_NODE_SIZE +
                //d.node.count * (d.node.isLeaf ? bigwig.BigwigReader.R_TREE_NODE_LEAF_SIZE : bigwig.BigwigReader.R_TREE_NODE_ITEM_SIZE)
                d.count * (d.isLeaf ? bigwig.BigwigReader.R_TREE_NODE_LEAF_SIZE : bigwig.BigwigReader.R_TREE_NODE_ITEM_SIZE)
              ));
              seq[j].callback(j+1);
            });
        });
      }
      seq[rTreeHeader.itemCount].then(function() {
        deferred.callback(tree);
      });
      seq[0].callback(1);
    });

  return deferred;
};

bigwig.BigwigReader.prototype.readRTreeBranch = function(header) {
  var self = this;
  var deferred = new goog.async.Deferred();

  var tree = {nodes:[]};

  var rTreeHeader;
  self.readRTreeHeader(header)
    .then(function(d) {
      rTreeHeader = d;
      tree.header = d;

      /** @type {goog.math.Long} */
      var offset = header.fullIndexOffset.add(goog.math.Long.fromNumber(bigwig.BigwigReader.R_TREE_HEADER_SIZE));
      var iterate = function() {
        self.readRTreeNodeItems(header, undefined, offset)
          .then(function(d) {
            tree.nodes.push(d);
            if (!d.node.isLeaf) {
              offset = d.items[0].dataOffset;
              iterate();
            } else {
              deferred.callback(tree);
            }
          });
      };
      iterate();
    });

  return deferred;
};

/**
 * @param {bigwig.Header} header
 * @param {bigwig.RTreeNodeLeaf} leaf
 * @returns {goog.async.Deferred.<{sectionHeader: bigwig.SectionHeader, records: Array.<bigwig.Record>}>}
 */
bigwig.BigwigReader.prototype.readData = function(header, leaf) {
  var self = this;
  var deferred = new goog.async.Deferred();
  this.get(leaf.dataOffset, leaf.dataOffset.add(leaf.dataSize), function(e) {
    var buf = e.target.response;
    // TODO: Check whether it is compressed or not
    var compressed = new Uint8Array(buf);
    var inflate = new Zlib.Inflate(compressed);
    var plain = inflate.decompress();

    var sectionHeader = bigwig.SectionHeader.fromDataView(new DataView(plain.buffer, 0, bigwig.BigwigReader.SECTION_HEADER_SIZE), header.littleEndian);
    var records = [];

    var recordType = bigwig.BigwigReader.RECORD_TYPES[sectionHeader.type];
    var recordSize = bigwig.BigwigStruct.sizeOf(recordType);
    for (var i = 0; i < sectionHeader.itemCount; ++i) {
      records[i] = recordType.fromDataView(new DataView(plain.buffer, bigwig.BigwigReader.SECTION_HEADER_SIZE + recordSize * i, recordSize), header.littleEndian);
    }

    deferred.callback({sectionHeader: sectionHeader, records: records});
  });

  return deferred;
};
