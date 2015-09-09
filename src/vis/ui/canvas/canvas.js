/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 5:51 PM
 */

goog.provide('vis.ui.canvas');

/**
 * @param {CanvasRenderingContext2D} context
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 * @param {string} [fill]
 * @param {string} [stroke]
 */
vis.ui.canvas.circle = function(context, cx, cy, r, fill, stroke) {
  context.beginPath();
  context.arc(cx, cy, r, 0, 2*Math.PI);

  if (stroke) {
    context.strokeStyle = stroke;
    context.stroke();
  }

  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }

  context.closePath();
};
