import globalStyle from '../../common/globalStyle';

const {
  edgeAnchorPointStyle,
  edgeAnchorPointHoverStyle,
  edgeCenterAnchorPointStyle,
  edgeCenterAnchorPointHoverStyle,
  zIndex,
} = globalStyle;

function handleAnchor(name: string, value: boolean, item: any) {
  const model = item.getModel();
  // 拿到 group
  const group = item.getContainer();
  // 拿到所有的锚点
  const anchors = group.get('children').filter(e => e.get('className') === 'edge-anchor' || e.get('className') === 'edge-center-anchor' || e.get('className') === 'edge-control-anchor');

  // 取消选中复原
  if (name === 'selected')
    value ? drawAnchor(model, group) : anchors.forEach(a => a.remove());
  // 拖动状态
  if (name === 'drag')
    value ? anchors.forEach(a => a.remove()) : drawAnchor(model, group);
}

function drawAnchor(model: any, group: any) {
  const anchorPoints = [model.startCrossPoint, ...(model.controlPoints || []), model.endCrossPoint];
  // 为每个 控制点 添加标记
  return anchorPoints.reduce((T, P, I) => {
    const isFirst = I === 0;
    const isLast = I === anchorPoints.length - 1;

    const shape = group.addShape('marker', {
      className: isFirst || isLast ? 'edge-anchor' : 'edge-control-anchor',
      attrs: {
        symbol: 'circle',
        x: P.x,
        y: P.y,
        ...edgeAnchorPointStyle
      },
      index: I,
      zIndex: zIndex.edgeAnchorPoint,
    });

    shape.setActived = () => shape.attr(edgeAnchorPointHoverStyle);

    shape.clearActived = () => shape.attr(edgeAnchorPointStyle);

    const TL = T.length;
    if(TL){
      const centerPoint = {x: (P.x - T[TL - 1].x) / 2 + T[TL - 1].x, y: (P.y - T[TL - 1].y) / 2 + T[TL - 1].y};

      const centerShape = group.addShape('marker', {
        className: 'edge-center-anchor',
        attrs: {
          symbol: 'circle',
          x: centerPoint.x,
          y: centerPoint.y,
          ...edgeCenterAnchorPointStyle
        },
        index: I,
        zIndex: zIndex.edgeAnchorPoint,
      });

      centerShape.setActived = () => shape.attr(edgeCenterAnchorPointHoverStyle);

      centerShape.clearActived = () => shape.attr(edgeCenterAnchorPointStyle);
    }

    return [...T, P];
  }, []);
}

export { handleAnchor };
