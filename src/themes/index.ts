import tinyColor from 'tinycolor2';
import generate from '@ant-design/colors/lib/generate';
import aliyun from './aliyun';
import dark from './dark';
import classic from './classic';
import antd from './default';
import material from './material';
import github from './github';
import dependencies from './dependencies';

function pad2(num: number): string {
  var t = num.toString(16);
  if (t.length === 1) t = '0' + t;
  return t
}

export function darken(colorStr: string, weight?: number): string {
  return mix('000', colorStr, weight)
}

export function mix(color1: string, color2: string, weight1?: number, alpha1?: number, alpha2?: number): string {
  color1 = color1.replace('#', '');
  color2 = color2.replace('#', '');
  if (weight1 === undefined) weight1 = 0.5;
  if (alpha1 === undefined) alpha1 = 1;
  if (alpha2 === undefined) alpha2 = 1;

  var w = 2 * weight1 - 1;
  var alphaDelta = alpha1 - alpha2;
  var w1 = (((w * alphaDelta === -1) ? w : (w + alphaDelta) / (1 + w * alphaDelta)) + 1) / 2;
  var w2 = 1 - w1;

  var nums1 = toNum3(color1);
  var nums2 = toNum3(color2);
  var r = Math.round(w1 * nums1[0] + w2 * nums2[0]);
  var g = Math.round(w1 * nums1[1] + w2 * nums2[1]);
  var b = Math.round(w1 * nums1[2] + w2 * nums2[2]);
  return '#' + pad2(r) + pad2(g) + pad2(b)
}

function toNum3(colorStr: string): number[] {
  if (colorStr.length === 3) {
      colorStr = colorStr[0] + colorStr[0] + colorStr[1] + colorStr[1] + colorStr[2] + colorStr[2]
  }
  var r = parseInt(colorStr.slice(0, 2), 16)
  var g = parseInt(colorStr.slice(2, 4), 16)
  var b = parseInt(colorStr.slice(4, 6), 16);
  return [r, g, b]
}

export function lighten(colorStr: string, weight?: number): string {
  return mix('fff', colorStr, weight)
}

export function fade(colorStr: string, alpha: number) {
  return tinyColor(colorStr).setAlpha(alpha).toRgbString()
}

export const extract = (cssStr: string, position: number): string => cssStr.split(' ')[position - 1];

let paletteColorsTemp = {};
export const palette = (colorStr: string, weight?: number): string => {
  if(paletteColorsTemp[`${colorStr}-${weight}`]){
    return paletteColorsTemp[`${colorStr}-${weight}`];
  }
  let colorPalettes = generate(colorStr);
  colorPalettes.forEach((color, i)=>{
    paletteColorsTemp[`${colorStr}-${i + 1}`] = color;
  })

  return paletteColorsTemp[`${colorStr}-${weight}`];
}

export const shade = darken;

export const tint = lighten;

export default {
  dependencies,
  tinyColor,
  aliyun,
  dark,
  antd,
  material,
  classic,
  github
}