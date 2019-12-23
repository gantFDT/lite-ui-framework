import G6 from '@antv/g6';
import { drawActivedNode } from './activedNode';
import { handleAnchor } from './anchor';
import { NODE_MAX_TEXT_LINE_WIDTH, EndNodeIcon, ShapeClassName } from '../../../../common/constants';
import globalStyle from '../../common/globalStyle';
import Util from '../../../Graph/shape/nodes/util';
const { startNodeStyle, nodeLabelStyle, logoIconStyle } = globalStyle;
G6.registerNode('_type_end', {
  draw(model: any, group: any) {
    const { size: [width, height] } = model;
    // 椭圆
    this.keyShape = group.addShape('ellipse', {
      className: ShapeClassName.KeyShape,
      attrs: {
        ...startNodeStyle,
        rx: width / 2,
        ry: height / 2,
      },
    });
    this.keyShape.baseType = '_type_end';
    this.drawLabel(model, group);
    this.drawLogoIcon(model, group);
    return this.keyShape;
  },
  drawLabel(model: any, group: any) {
    this.label = group.addShape('text', {
      className: ShapeClassName.Label,
      attrs: {
        ...nodeLabelStyle,
        text: model.label
      },
    });
    const { text, fontWeight, fontFamily, fontSize, fontStyle, fontVariant } = this.label.attr();
    const font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px ${fontFamily}`;
    this.label.attr('text', Util.optimizeMultilineText(text, font, NODE_MAX_TEXT_LINE_WIDTH));
    return this.label;
  },
  drawLogoIcon(model: any, group: any) {
    const { width: w, height: h, x, y, offset } = logoIconStyle;

    const lableX = this.label.getBBox().x;
    this.logoIcon = group.addShape('image', {
      className: ShapeClassName.LogoIcon,
      attrs: {
        ...logoIconStyle,
        img: EndNodeIcon,
        x: x || lableX - w - offset,
        y: y || -h / 2,
        width: w,
        height: h
      }
    });
  },
  update(model: any, item: any) {
    const { size: [width, height] } = model;
    const group = item.getContainer();
    // keyShape
    const keyShape = group.findByClassName(ShapeClassName.KeyShape)
    keyShape.attr({
      rx: width / 2,
      ry: height / 2,
    })
    // label
    let labelShape = group.findByClassName(ShapeClassName.Label);
    labelShape.remove();
    labelShape = this.drawLabel(model, group);
    // logoIcon
    const { width: w, x, offset } = logoIconStyle;
    const lableX = labelShape.getBBox().x;
    let logoIcon = group.findByClassName(ShapeClassName.LogoIcon);
    logoIcon.attr({
      x: x || lableX - w - offset,
    });
  },
  setState(name: string, value: boolean, item: any) {
    drawActivedNode.call(this, name, value, item);
    handleAnchor.call(this, name, value, item);
  },
  getAnchorPoints() {
    return [[0.5, 0.5]];
  },
});