import globalStyle from '../../common/globalStyle';
const { edgeActivedStyle, edgeStyle, edgeDragStyle } = globalStyle;

// 选中时改变边框颜色
export default function drawActivedEdges(name: string, value: boolean, item: any) {
  const keyShape = item.getKeyShape();
  const revertStyle = () => {
    const model = item.getModel();

    let specialStyle: any = {};
    if(model.shape === 'reject'){
      specialStyle = {
        lineDash: [8, 5]
      }
    }else if(model.shape === 'cancel'){
      specialStyle = {
        stroke: "rgba(213, 38, 18, 0.8)",
        lineWidth: 2,
        lineDash: [2, 5]
      }
    }

    keyShape.attr({ ...edgeStyle, ...specialStyle });
    keyShape.endArrow && keyShape.endArrow.attr({ fill: specialStyle.stroke ? specialStyle.stroke : edgeStyle.stroke });
  };
  // 选中时且鼠标停留时显示样式
  if ((name === 'selected' || name === 'active') && value) {
    if (keyShape.endArrow) keyShape.endArrow.attr({ fill: edgeActivedStyle.stroke });
    keyShape.attr({ ...edgeActivedStyle, ...(name === 'selected' ? { lineWidth: 2 } : {}) });
  }

  // 取消选中复原
  if (name === 'selected' && !value) revertStyle();

  // 离开节点且为非选中状态、非拖拽状态
  if (name === 'active' && !value && !item.hasState('selected') && !item.hasState('drag')) revertStyle();

  // 线条拖拽过程中问题
  if (name === 'drag' && value) {
    keyShape.attr({ ...edgeDragStyle });
    keyShape.endArrow && keyShape.endArrow.attr({ fill: edgeDragStyle.stroke });
  }
  if (name === 'onAnchor' && value) revertStyle();
  if (name === 'onAnchor' && !value) keyShape.attr({ ...edgeDragStyle });
  if (name === 'drag' && !value) revertStyle();
}
