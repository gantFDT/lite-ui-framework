import drawArrow from './arrow';
import drawLabel from './label';
import globalStyle from '../../common/globalStyle';
import drawActivedEdges from './activedEdge';
import { handleAnchor } from './anchor';
import { isEmpty } from 'lodash';
import G6 from '@antv/g6';

const { edgeStyle } = globalStyle;

function getPolygon(points: any[]) {
  const [ start ] = points;
  const M = ['M', start.x, start.y];
  const path = [M];
  points.forEach((point: any, idx: number) => idx && path.push(['L', point.x, point.y]));
  return path;
}

function getCrossPoint (origin: any, target: any, node: any) {
  if(!node) return origin;

  const shape = node.getKeyShape().baseType;
  const { size: [width, height] } = node.getModel();
  const a = width / 2;
  const b = height / 2;

  let { x: x0, y: y0 } = origin;
  let { x: x1, y: y1 } = target;

  x1 = x1 - x0;
  y1 = y1 - y0;

  let crossPoint = {...origin};

  if(shape === '_type_step'){
    const k = x1 ? y1 / x1 : 0;

    if(k === 0) {
      crossPoint = { x: x0 + (x1 ? (x1 > 0 ? a : -a) : 0), y: y0 + (y1 ? (y1 > 0 ? b : -b) : 0)}
    } else if(k >= b / a || k <= -b / a) {
      crossPoint = { x: x0 + (x1 * k > 0 ? b : -b) * x1 / y1, y: y0 + (y1 > 0 ? b : -b)}
    } else {
      crossPoint = { x: x0 + (x1 > 0 ? a : -a), y: y0 + (y1 * k > 0 ? a : -a) * y1 / x1}
    }
  }else if(shape === '_type_start' || shape === '_type_end'){
    const a2 = Math.pow(a, 2);
    const b2 = Math.pow(b, 2);
    const x12 = Math.pow(x1, 2)
    const y12 = Math.pow(y1, 2)
    const k = x1 ? y1 / x1 : 0;

    let diffX = Math.sqrt( a2 * b2 * x12 / ( b2 * x12 + a2 * y12 ) );
    diffX = x1 > 0 ? diffX : -diffX;
    crossPoint.x = x0 + diffX;
    crossPoint.y = y0 + k * diffX;
  }else if(shape === '_type_split' || shape === '_type_join'){
    if(x1>=0 && y1>=0){
      const k = x1 ? y1 / x1 : 0;
      let diffX = a * b * x1 / ( a * y1 + b * x1 );
      
      crossPoint.x = x0 + diffX;
      crossPoint.y = y0 + k * diffX;
    }else if(x1>0 && y1<0){
      const k = y1 / -x1;
      let diffX = a * b * x1 / ( a * y1 - b * x1 );
      
      crossPoint.x = x0 - diffX;
      crossPoint.y = y0 + k * diffX;
    }else if(x1<=0 && y1<=0){
      const k = x1 ? y1 / -x1 : 0;
      let diffX = a * b * x1 / ( a * y1 + b * x1 );
      
      crossPoint.x = x0 - diffX;
      crossPoint.y = y0 + k * diffX;
    }else{
      const k = x1 ? y1 / x1 : 0;
      let diffX = a * b * x1 / ( a * y1 - b * x1 );
      
      crossPoint.x = x0 + diffX;
      crossPoint.y = y0 + k * diffX;
    }
  }
  return crossPoint;
}

G6.registerEdge('flow-edge', {
  draw(item: any, group: any) {
    const path = this.getPath(item);
    // 绘制线条
    const keyShape = group.addShape('path', {
      attrs: {
        path,
        ...edgeStyle,
        ...(
          item.isLast ? {
            lineWidth: 2,
            stroke: '#cf1322',
          } :
          item.isHandled ? {
            lineWidth: 2,
            stroke: '#389e0d',
          } : {}
        )
      },
    });
    // 绘上箭头
    keyShape.endArrow = drawArrow(item, group, keyShape, path);
    drawLabel(item, group, keyShape);
    this.keyShape = keyShape;
    return keyShape;
  },
  getStartAndEndCrossPoint(item: any) {
    const { startPoint, endPoint, controlPoints, sourceNode, targetNode } = item;

    const startCrossPoint = getCrossPoint(startPoint, isEmpty(controlPoints) ? endPoint : controlPoints[0], sourceNode);
    const endCrossPoint = getCrossPoint(endPoint, isEmpty(controlPoints) ? startPoint : controlPoints[controlPoints.length - 1], targetNode);

    return [ startCrossPoint, endCrossPoint ]
  },
  getPath(item: any) {
    const [ startCrossPoint, endCrossPoint ] = this.getStartAndEndCrossPoint(item);
    const points = [startCrossPoint];
    if(item.controlPoints && item.controlPoints.length) {
      item.controlPoints.forEach((P: {x: number, y: number})=>{
        points.push(P);
      })
    }
    points.push(endCrossPoint)

    item.startCrossPoint = startCrossPoint;
    item.endCrossPoint = endCrossPoint;

    return getPolygon(points);
  },
  setState(name: string, value: boolean, item: any) {
    // 线条激活状态
    drawActivedEdges.call(this, name, value, item);
    handleAnchor.call(this, name, value, item);
  },
});
