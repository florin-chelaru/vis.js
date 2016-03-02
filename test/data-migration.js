/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 2/29/2016
 * Time: 4:57 PM
 */

var d = {
  "nrows": 51,
  "ncols": 2,
  "rows": [
  { "label": "snpid", "d": ["rs114551744", "rs10752752", "rs186333629", "rs12567310", "rs192416686", "rs183897471", "rs145193745", "rs186202256", "rs186081217", "rs192275158", "rs72751993", "rs1294299", "rs1294287", "rs183137223", "rs190017470", "rs114235520", "rs149955012", "rs1294266", "rs142045052", "rs75917843", "rs77516196", "rs192643817", "rs148457912", "rs77061983", "rs12566188", "rs190201031", "rs192453879", "rs183717127", "rs148650720", "rs962786", "rs185014438", "chr1:233490543", "rs143728354", "rs58507994", "rs192456647", "rs4649305", "rs188603098", "rs12093733", "rs183414162", "rs147666657", "rs185545182", "rs187596032", "rs140818495", "rs6669125", "rs12046622", "rs191178764", "rs142593417", "rs12021569", "rs1294244", "rs145593563", "rs1294240"] },
  { "label": "chr", "d": ["chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1", "chr1"] },
  { "label": "start", "boundaries": {"min": 233430449, "max": 233517394}, "d": [233430449, 233430787, 233434167, 233440166, 233445488, 233451557, 233451592, 233454543, 233458743, 233460369, 233468388, 233468950, 233471626, 233472817, 233474525, 233475563, 233476091, 233476263, 233476611, 233477990, 233479122, 233479411, 233480171, 233482035, 233482794, 233485458, 233485758, 233485785, 233488494, 233489054, 233490356, 233490543, 233490874, 233491638, 233491660, 233491811, 233493514, 233494747, 233498953, 233500924, 233502622, 233504063, 233508441, 233509349, 233510220, 233514010, 233515209, 233516041, 233516495, 233516539, 233517394] },
  { "label": "end", "boundaries": {"min": 233430449, "max": 233517394}, "d": [233430449, 233430787, 233434167, 233440166, 233445488, 233451557, 233451592, 233454543, 233458743, 233460369, 233468388, 233468950, 233471626, 233472817, 233474525, 233475563, 233476091, 233476263, 233476611, 233477990, 233479122, 233479411, 233480171, 233482035, 233482794, 233485458, 233485758, 233485785, 233488494, 233489054, 233490356, 233490543, 233490874, 233491638, 233491660, 233491811, 233493514, 233494747, 233498953, 233500924, 233502622, 233504063, 233508441, 233509349, 233510220, 233514010, 233515209, 233516041, 233516495, 233516539, 233517394] }
],
  "cols": [
  { "label": "name", "d": ["disease1","disease2"] },
  { "label": "id", "d": [1,2] }
],
  "vals": [
  {
    "label": "gwasPval",
    "d": [
      // disease1
      0.404408372, 0.803992066, 0.507903609, 0.547426622, 0.871425707, 0.485113325, 0.942985046, 0.80968252, 0.59025104, 0.446705793, 0.367949548, 0.837335724, 0.149008212, 0.815750721, 0.093113352, 0.760738683, 0.930361486, 0.865139848, 0.287298789, 0.345222337, 0.265686873, 0.326640821, 0.780148806, 0.760738683, 0.188583291, 0.545830368, 0.660700041, 0.683667077, 0.568244947, 0.931031203, 0.264302602, 0.272114888, 0.385857376, 0.184553922, 0.931031203, 0.545830368, 0.371864446, 0.345417064, 0.257295141, 0.747021106, 0.156752567, 0.896914644, 0.861281252, 0.039224306, 0.737350595, 0.814257925, 0.47957881, 0.49590813, 0.463224669, 0.468325228, 0.411346765,
      // disease2
      0.882708277, 0.382179127, 0.004464214, 0.956819961, 0.63578401, 0.006068026, 0.011369486, 0.849105131, 0.045518979, 0.073306556, 0.355315744, 0.836675429, 0.247715838, 0.878707621, 0.17187381, 0.975673874, 0.040117816, 0.814716033, 0.252212106, 0.250706362, 0.240120589, 0.213638592, 0.950169885, 0.975673874, 0.02665442, 0.732943237, 0.835452127, 0.292697145, 0.803356351, 0.570762048, 0.25849114, 0.389962194, 0.677604718, 0.135996401, 0.570762048, 0.732943237, 0.206626417, 0.746734601, 0.140132017, 0.417547526, 0.991532188, 0.690396282, 0.179808891, 0.99351707, 0.588622432, 0.032090482, 0.478861261, 0.441972278, 0.402009328, 0.502378328, 0.289511637
    ],
    "t": true, // transpose
    "boundaries": { "min": 0, "max": 1 }
  }
],
  "query": [
  {"target": "rows", "targetLabel": "chr", "test": "==", "testArgs": "chr1"},
  {"target": "rows", "targetLabel": "start", "test": "<", "testArgs": "233517394"},
  {"target": "rows", "targetLabel": "end", "test": ">=", "testArgs": "233430449"}
]
};



var migrateData = function(d) {
  return {
    rows: {
      metadata: d.rows.map(function(row, i) {
        if (Object.keys(row).length == 2) {
          return row.label;
        }
        var record = {};
        for (var k in row) {
          if (row.hasOwnProperty(k) && k != 'd') { record[k] = row[k]; }
        }

        if (('boundaries' in row)) {
          record['type'] = 'number';
        }

        return record;
      }),
      d: d.rows[0].d.map(function(it, i) {
        var record = {};
        d.rows.forEach(function(c, j) {
          record[c.label] = d.rows[j].d[i];
        });
        return record;
      })
    },
    cols: {
      metadata: d.cols.map(function(row, i) {
        if (Object.keys(row).length == 2) {
          return row.label;
        }
        var record = {};
        for (var k in row) {
          if (row.hasOwnProperty(k) && k != 'd') { record[k] = row[k]; }
        }

        if (('boundaries' in row)) {
          record['type'] = 'number';
        }

        return record;
      }),
      d: d.cols[0].d.map(function(it, i) {
        var record = {};
        d.cols.forEach(function(c, j) {
          record[c.label] = d.cols[j].d[i];
        });
        return record;
      })
    },
    vals: {
      metadata: d.vals.map(function(row, i) {
        if (Object.keys(row).length == 2) {
          return row.label;
        }
        var record = {};
        for (var k in row) {
          if (row.hasOwnProperty(k) && k != 'd') { record[k] = row[k]; }
        }

        if (('boundaries' in row)) {
          record['type'] = 'number';
        }

        return record;
      })[0],
      d: d.cols[0].d.map(function(it, i) {
        return d.vals[0].d.slice(i * d.nrows, (i+1) * d.nrows);
      })
    },
    query: d.query
  };
};

var migrateData2 = function(d) {
  return d.cols[0].d.map(function(col, j) {
    var id = u.generatePseudoGUID(6);
    var data = {
      id: id,
      state: 'static',
      label: d.cols[0].d[j],
      rowMetadata: d.rows.map(function(row, i) {
        /*if (Object.keys(row).length == 2) {
          return row.label;
        }*/
        var record = {};
        for (var k in row) {
          if (row.hasOwnProperty(k) && k != 'd') { record[k] = row[k]; }
        }

        if (('boundaries' in row)) {
          record['type'] = 'number';
        }

        return record;
      }),
      d: d.rows[0].d.map(function(row, i) {
        var ret = {};
        d.rows.forEach(function(r) {
          ret[r.label] = r.d[i];
        });
        ret[d.vals[0].label] = d.vals[0].d[j * d.nrows + i];
        ret['__d__'] = id;
        return ret;
      }),
      query: d.query.map(function(q) {
        return {
          target: q.targetLabel,
          test: q.test,
          testArgs: q.testArgs,
          negate: q.negate
        };
      }) ,
      metadata: {}
    };

    d.cols.forEach(function(c, i) {
      data.metadata[c.label] = c.d[j];
    });

    data.rowMetadata.push({'label': d.vals[0].label, type: 'number', boundaries: d.vals[0].boundaries});

    return data;
  });
};
