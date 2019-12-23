/**
 * @fileOverview smooth edges
 * @author leungwensen@gmail.com
 * @reference https://lark.alipay.com/antv/blog/an-approach-to-draw-smooth-cubic-bezier-curves-in-graphs
 **/

import G6 from '@antv/g6';

G6.registerEdge(
  'reject',
  {
    afterDraw(model: any, group: any) {
      this.keyShape.attr({
        lineDash: [8, 5]
      })
    }
  },
  'flow-edge'
);
