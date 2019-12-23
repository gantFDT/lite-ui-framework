/**
 * @fileOverview smooth edges
 * @author leungwensen@gmail.com
 * @reference https://lark.alipay.com/antv/blog/an-approach-to-draw-smooth-cubic-bezier-curves-in-graphs
 **/

import drawArrow from './arrow';
import drawLabel from './label';
import globalStyle from '../../common/globalStyle';
import drawActivedEdges from './activedEdge';
import G6 from '@antv/g6';

G6.registerEdge(
  'approve',
  {},
  'flow-edge'
);
