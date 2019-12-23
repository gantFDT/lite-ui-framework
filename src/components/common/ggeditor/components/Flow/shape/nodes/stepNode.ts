import G6 from '@antv/g6';
import { drawActivedNode } from './activedNode';
import { handleAnchor } from './anchor';
import { NODE_MAX_TEXT_LINE_WIDTH, StepNodeIcon, ApprovalOnlyIcon, MultipleInstancesIcon, ShapeClassName } from '../../../../common/constants';
import globalStyle from '../../common/globalStyle';
import Util from '../../../Graph/shape/nodes/util';
import { NodeModel, Group } from '../../../../common/interface';
const { nodeStyle, nodeSelectedStyle, nodeActivedStyle, nodeLabelStyle, logoIconStyle, stateIconStyle } = globalStyle;
G6.registerNode(
  '_type_step',
  {
    draw(model: NodeModel, group: Group) {
      const { size: [width, height], isCurrent } = model;
      // 矩形
      this.keyShape = group.addShape('rect', {
        className: ShapeClassName.KeyShape,
        attrs: {
          ...nodeStyle,
          ...(isCurrent ? nodeSelectedStyle : {}),
          ...(isCurrent ? nodeActivedStyle : {}),
          x: -width / 2,
          y: -height / 2,
          width,
          height
        },
      });
      this.keyShape.baseType = '_type_step';
      this.drawLabel(model, group);
      this.drawLogoIcon(model, group);
      this.drawStateIcon(model, group);
      return this.keyShape;
    },
    drawLabel(model: any, group: any) {
      this.label = group.addShape('text', {
        className: ShapeClassName.Label,
        attrs: {
          ...nodeLabelStyle,
          x: 0,
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
          img: StepNodeIcon,
          x: x || lableX - w - offset,
          y: y || -h / 2,
          width: w,
          height: h
        }
      });
    },
    drawStateIcon(model: any, group: any) {
      const { approvalOnly, multipleInstances } = model;

      const { width: w, height: h, x, y, offset } = stateIconStyle;

      const lableMaxX = this.label.getBBox().maxX;
      this.approvalOnlyIcon = group.addShape('image', {
        className: ShapeClassName.ApprovaStateIcon,
        attrs: {
          ...stateIconStyle,
          img: ApprovalOnlyIcon,
          x: x || lableMaxX + offset,
          y: y || -h / 2,
          width: w,
          height: h
        },
      });
      this.approvalOnlyIcon.set('capture', false);
      this.multipleInstancesIcon = group.addShape('image', {
        className: ShapeClassName.MultipleStateIcon,
        attrs: {
          ...stateIconStyle,
          img: MultipleInstancesIcon,
          x: x || (approvalOnly ? (w + offset) : 0) + lableMaxX + offset,
          y: y || -h / 2,
          width: w,
          height: h
        },
      });
      this.multipleInstancesIcon.set('capture', false);

      !approvalOnly && this.approvalOnlyIcon.hide();
      !multipleInstances && this.multipleInstancesIcon.hide();
    },
    update(model: any, item: any) {
      const group = item.getContainer();
      const { size: [width, height], approvalOnly, multipleInstances } = model;
      // keyShape
      const keyShape = group.findByClassName(ShapeClassName.KeyShape)
      keyShape.attr({
        x: -width / 2,
        y: -height / 2,
        width,
        height,
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
      // 单独审批Icon
      let approvalOnlyIcon = group.findByClassName(ShapeClassName.ApprovaStateIcon);
      if(approvalOnly) approvalOnlyIcon.show();
      else approvalOnlyIcon.hide();
      // 多实例Icon
      let multipleInstancesIcon = group.findByClassName(ShapeClassName.MultipleStateIcon);
      multipleInstancesIcon.attr({
        x: x || (approvalOnly ? (w + offset) : 0) + -lableX + offset
      })
      if(multipleInstances) multipleInstancesIcon.show();
      else multipleInstancesIcon.hide();
    },
    setState(name: string, value: boolean, item: any) {
      drawActivedNode.call(this, name, value, item);
      handleAnchor.call(this, name, value, item);
    },
    getAnchorPoints() {
      return [[0.5, 0.5]];
    },
  }
);