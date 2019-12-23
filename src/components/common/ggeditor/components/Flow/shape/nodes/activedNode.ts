import globalStyle from '../../common/globalStyle';
import { getDiamondPath } from '../../../../utils';
const { nodeStyle, nodeActivedStyle, nodeSelectedStyle, startNodeStyle, splitNodeStyle } = globalStyle;

// 选中时改变边框颜色
export function drawActivedNode(name: string, value: boolean, item: any) {
  const revertStyle = () => {
    const { size: [width, height] } = item.getModel();
    const shape = item.getKeyShape().baseType;
    // 恢复原本样式
    if (shape == '_type_start' || shape == '_type_end') item.get('keyShape').attr({
      ...startNodeStyle,
      rx: width / 2,
      ry: height / 2
    });
    else if (shape == '_type_split' || shape == '_type_join') item.get('keyShape').attr({
      ...splitNodeStyle,
      path: getDiamondPath(width, height),
      width,
      height
    });
    else item.get('keyShape').attr({
      ...nodeStyle,
      x: -width / 2,
      y: -height / 2,
      width,
      height
    });
  };

  // 选中时且鼠标停留时显示样式
  if ((name === 'selected' || name === 'active' || name === 'activeAnchor') && value)
    item.get('keyShape').attr({ ...nodeActivedStyle });

  // 选中时加阴影
  if (name === 'selected' && value) item.get('keyShape').attr({ ...nodeSelectedStyle });

  // 取消选中复原
  if (name === 'selected' && !value) revertStyle();

  // 添加线后复原
  if (name === 'addingSource' && !value) revertStyle();

  // 离开节点且为非选中状态、非拖拽状态
  if (name === 'active' && !value && !item.hasState('selected') && !item.hasState('addingSource')) revertStyle();
}
