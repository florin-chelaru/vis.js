/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 10:44 AM
 */

goog.provide('vis.io.RandomAccessFileReader');

/**
 * @param {string} uri
 * @constructor
 */
vis.io.RandomAccessFileReader = function(uri) {
  /**
   * @type {string}
   * @private
   */
  this._uri = uri;
};

/**
 * @param {number} pos
 */
vis.io.RandomAccessFileReader.prototype.seek = function(pos) {

};

/**
 * Read 32 bit integer from file
 * @returns {int}
 */
vis.io.RandomAccessFileReader.prototype.readInt = function() {

};

/**
 * Read 64 bit integer from file
 * @returns {int}
 */
vis.io.RandomAccessFileReader.prototype.readLong = function() {

};

/**
 * Read 16 bit integer from file
 * @returns {int}
 */
vis.io.RandomAccessFileReader.prototype.readShort = function() {

};

/**
 * Read 8 bit integer from file
 * @returns {int}
 */
vis.io.RandomAccessFileReader.prototype.readByte = function() {

};

/**
 * Read 32 bit unsigned integer from file
 * @returns {int}
 */
vis.io.RandomAccessFileReader.prototype.readUInt = function() {

};

/**
 * Read 64 bit unsigned integer from file
 * @returns {int}
 */
vis.io.RandomAccessFileReader.prototype.readULong = function() {

};

/**
 * Read 16 bit unsignedinteger from file
 * @returns {int}
 */
vis.io.RandomAccessFileReader.prototype.readUShort = function() {

};

/**
 * Read 8 bit unsigned integer from file
 * @returns {int}
 */
vis.io.RandomAccessFileReader.prototype.readUByte = function() {

};
