/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/29/2015
 * Time: 12:56 PM
 */

goog.provide('bigwig.BigwigFile');

goog.require('bigwig.BigwigReader');
goog.require('bigwig.Header');

/**
 * @param {string} uri
 * @constructor
 */
bigwig.BigwigFile = function(uri) {
  /**
   * @type {bigwig.BigwigReader}
   * @private
   */
  this._reader = new bigwig.BigwigReader(uri);

  /**
   * @type {bigwig.Header}
   * @private
   */
  this._header = null;

  /**
   * @type {bigwig.ChrTree}
   * @private
   */
  this._chrTree = null;

  /**
   * @type {bigwig.IndexTree}
   * @private
   */
  this._indexTree = null;
};


bigwig.BigwigFile.prototype.query = function(chr, start, end) {
  var self = this;
  var deferred = new goog.async.Deferred();

  if (!this._header) {
    this._reader.readHeader()
      .then(function(header) {
        self._header = header;
        self.query(chr, start, end).chainDeferred(deferred);
      });
  }

  if (!this._chrTree) {
    this._reader.readChrTree(this._header)
      .then(function(chrTree) {
        self._chrTree = chrTree;
        self.query(chr, start, end).chainDeferred(deferred);
      });
  }

  /**
   * @type {bigwig.ChrTree.Node}
   */
  var chrNode = this._chrTree.getLeaf(chr);

  return deferred;
};
