/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 7:43 PM
 */

goog.provide('vis.models.bigwig.BigwigFile');

/**
 * @constructor
 */
vis.models.bigwig.BigwigFile = function() {

};

vis.models.bigwig.BigwigFile.Format = {
  header: {
    type: 'object',
    value: {
      magic: 4,
      version: 2,
      zoomLevels: 2,
      chromosomeTreeOffset: 8,
      fullDataOffset: 8,
      fullIndexOffset: 8,
      fieldCount: 2,
      definedFieldCount: 2,
      autoSqlOffset: 8,
      totalSummaryOffset: 8,
      uncompressedBufSize: 4,
      reserved: 8
    }
  },

  zoomHeaders: {
    type: 'array',
    length: 'header.zoomLevels',
    items: {
      type: 'object',
      value: {
        reductionLevel: 4,
        reserved: 4,
        dataOffset: 8,
        indexOffset: 8
      }
    }
  },

  totalSummary: {
    type: 'object',
    value: {
      basesCovered: 8,
      minVal: -8,
      maxVal: -8,
      sumData: -8,
      sumSquares: -8
    }
  },

  chrTreeHeader: {
    offset: 'header.chomosomeTreeOffset',
    type: 'object',
    value: {
      magic: 4,
      blockSize: 4,
      keySize: 4,
      valSize: 4,
      itemCount: 8,
      reserved: 8
    }
  },

  chrTreeNodes: {
    type: 'array',
    length: 'chrTreeHeader.itemCount',
    items: {
      type: {
        isLeaf: 1,
        reserved: 1,
        count: 2,
        chrTreeNodeItems: {
          type: 'array',
          length: 'chrTreeNode.count',
          items: {
            //type:
          }
        }
      }
    }
  }
};
