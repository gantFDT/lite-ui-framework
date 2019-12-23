/**
 * @fileOverview smooth edges
 * @author leungwensen@gmail.com
 * @reference https://lark.alipay.com/antv/blog/an-approach-to-draw-smooth-cubic-bezier-curves-in-graphs
 **/

import G6 from '@antv/g6';

G6.registerEdge(
  'cancel',
  {
    afterDraw(model: any, group: any) {
      this.keyShape.attr({
        stroke: "rgba(213, 38, 18, 0.8)",
        lineWidth: 2,
        lineDash: [2, 5]
      })
    }
  },
  'flow-edge'
);
