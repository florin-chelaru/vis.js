/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/29/2015
 * Time: 1:10 PM
 */

goog.provide('bigwig.ChrTree');

/**
 * @param {bigwig.ChrTree.Node} root
 * @constructor
 */
bigwig.ChrTree = function(root) {
  /**
   * @type {bigwig.ChrTree.Node}
   */
  this.root = root;

  /**
   * @type {Object.<number, bigwig.ChrTree.Node>}
   * @private
   */
  this._leavesById = null;

  /**
   * @type {Object.<string, bigwig.ChrTree.Node>}
   * @private
   */
  this._leavesByKey = null;
};

/**
 * @param {{key: string=, chrId: number=, chrSize: number=, children: Array.<bigwig.ChrTree.Node>=}} node
 * @constructor
 */
bigwig.ChrTree.Node = function(node) {
  /**
   * @type {string}
   */
  this.key = node.key;

  /**
   * @type {number}
   */
  this.chrId = node.chrId;

  /**
   * @type {number}
   */
  this.chrSize = node.chrSize;

  /**
   * @type {Array.<bigwig.ChrTree.Node>}
   */
  this.children = node.children;
};

/**
 * @param {number|string} chrIdOrKey
 * @returns {bigwig.ChrTree.Node}
 */
bigwig.ChrTree.prototype.getLeaf = function (chrIdOrKey) {
  if (typeof chrIdOrKey == 'number') {
    if (!this._leavesById) {
      var leavesById = {};
      this.dfs(function (node) {
        if (!node.children) {
          leavesById[node.chrId] = node;
        }
      });
      this._leavesById = leavesById;
    }
    return this._leavesById[chrId];
  }

  // else typeof chrIdOrKey == 'string'
  if (!this._leavesByKey) {
    var leavesByKey = {};
    this.dfs(function (node) {
      if (!node.children) {
        leavesByKey[node.key] = node;
      }
    });
    this._leavesByKey = leavesByKey;
  }
  return this._leavesByKey[chrIdOrKey];
};

/**
 * @param {function(bigwig.ChrTree.Node)} iterate
 */
bigwig.ChrTree.prototype.dfs = function(iterate) {
  /**
   * @param {bigwig.ChrTree.Node} node
   */
  var dfs = function(node) {
    iterate.call(null, node);
    if (node.children && node.children.length) {
      node.children.forEach(dfs);
    }
  };

  dfs(this.root);
};
