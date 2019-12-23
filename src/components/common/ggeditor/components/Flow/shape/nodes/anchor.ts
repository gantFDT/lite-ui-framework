import globalStyle from '../../common/globalStyle';

const {
  anchorPointStyle,
  anchorPointHoverStyle,
  anchorHotsoptActivedStyle,
  anchorHotsoptStyle,
  banFlagStyle,
  zIndex,
} = globalStyle;

function handleAnchor(name, value, item) {
  const model = item.getModel();
  // 拿到 group
  const group = item.getContainer();
  // 拿到所有的锚点
  const anchors = group.get('children').filter(e => e.get('className') === 'anchor');
  // console.log(`| ${model.id.padEnd(8)} | ${name.padEnd(12)} | ${!!value} | ${!!this.addingEdge} |`)

  // 进入添加线条状态
  if (name === 'addingEdge'){
    if (value) {
      this.addingEdge = true;
      const anchors = drawAnchor.call(this, model, group);
      // 拖拽状态下显示 hotspost
      anchors.forEach(a => a.showHotspot());
    } else {
      // 结束拖拽时清除所有锚点
      anchors.forEach(a => a.remove());
      this.addingEdge = false;
    }
  }

  // 删除起点的锚点
  if (name === 'addingSource'){
    if(value) drawAnchor.call(this, model, group)
    else anchors.forEach(a => a.remove())
  }

  // 非添加线条状态
  if (!this.addingEdge && !item.hasState('addingSource') && !item.hasState('disabled')) {
    // 进入锚点激活锚点, value 为目标锚点
    // 离开锚点则清除所有锚点激活样式
    if (name === 'activeAnchor')
      value ? value.setActived && value.setActived() : anchors.forEach(a => a.clearActived && a.clearActived());
    // 进入节点状态和选中状态显示所有锚点
    // 离开节点隐藏所有锚点
    if (name === 'active')
      value ? drawAnchor.call(this, model, group) : !item.hasState('selected') && anchors.forEach(a => a.remove());

    if (name === 'selected' && !value) anchors.forEach(a => a.remove());
  } else {
    // 拖拽状态下激活锚点则激活 hotspost 样式
    if (name === 'activeAnchor')
      value
        ? value.setHotspotActived && value.setHotspotActived(true)
        : anchors.forEach(a => a.setHotspotActived && a.setHotspotActived(false));
  }
}

function drawAnchor(model, group) {
  const anchorPoints = this.getAnchorPoints();
  // 为每个点添加标记
  return anchorPoints.map((p, index) => {
    const keyShape = group.get('item').getKeyShape();
    const width = keyShape.attr('width') || keyShape.attr('rx') * 2;
    const height = keyShape.attr('height') || keyShape.attr('ry') * 2;
    const [x, y] = [p[0], p[1]];
    let hotspot;
    const attrs = {
      '_type_step': { x: width * x + keyShape.attr('x'), y: height * y + keyShape.attr('y') },
      '_type_split': { x: width * x - width / 2, y: height * y - height / 2 },
      '_type_join': { x: width * x - width / 2, y: height * y - height / 2 },
      '_type_start': { x: width * x - width / 2, y: height * y - height / 2 },
      '_type_end': { x: width * x - width / 2, y: height * y - height / 2 },
    };
    const shape = group.addShape('marker', {
      className: 'anchor',
      attrs: {
        symbol: 'circle',
        ...anchorPointStyle,
        ...(attrs[keyShape.baseType] || attrs['_type_step']),
      },
      index,
      zIndex: zIndex.anchorPoint,
    });
    shape.showHotspot = () => {
      hotspot = group.addShape('marker', {
        className: 'anchor',
        attrs: {
          symbol: 'circle',
          ...anchorHotsoptStyle,
          ...(attrs[keyShape.baseType] || attrs['_type_step']),
        },
        index,
        zIndex: zIndex.anchorHotsopt,
      });

      // 让 hotspot 显示在更上层的图层
      hotspot.toFront();
      shape.toFront();
    };
    shape.setActived = () => shape.attr(anchorPointHoverStyle);

    shape.clearActived = () => shape.attr(anchorPointStyle);

    shape.setHotspotActived = bool => {
      if (hotspot) {
        if (bool) hotspot.attr(anchorHotsoptActivedStyle);
        else hotspot.attr(anchorHotsoptStyle);
      }
    };
    return shape;
  });
}

export { handleAnchor };
