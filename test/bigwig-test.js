/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/21/2015
 * Time: 6:03 PM
 */

QUnit.test('vs.plugins.ui.BigwigDataContext', function(assert) {
  assert.ok(vs.plugins.ui.BigwigDataContext);
});

QUnit.test('vs.plugins.ui.BigwigDataContext.prototype.name', function(assert) {
  var dc = new vs.plugins.ui.BigwigDataContext('genetic variants', {});
  assert.ok(dc);
  assert.equal(dc.name, 'genetic variants');
});
