import themes, { mix } from '@/themes';
import generate from '@ant-design/colors/lib/generate';
import { cssVar2camel, camel2cssVar } from '@/utils/utils';

const { dependencies, tinyColor } = themes;

const setCssVar = (styles: object) => {
  let cssStr = Object.entries(styles).map(([key, val]) => `${key}:${val}`).join(';');
  document.documentElement.setAttribute('style', cssStr);
};

const fade = (colorStr: string, alpha: number): string => tinyColor(colorStr).setAlpha(alpha).toRgbString();

const tint = (colorStr: string, weight?: number): string => mix('fff', colorStr, weight);

const darken = (colorStr: string, weight?: number): string => mix('000', colorStr, weight);

const extract = (cssStr: string, position: number): string => cssStr.split(' ')[position - 1];

let paletteColorsTemp = {};
const palette = (colorStr: string, weight?: number): string => {
  if (paletteColorsTemp[`${colorStr}-${weight}`]) {
    return paletteColorsTemp[`${colorStr}-${weight}`];
  }
  let colorPalettes = generate(colorStr);
  colorPalettes.forEach((color, i) => {
    paletteColorsTemp[`${colorStr}-${i + 1}`] = color;
  })

  return paletteColorsTemp[`${colorStr}-${weight}`];
}

const shade = darken;

let styles = {};

export default {
  generateCssVars(cssVars: object) {
    for (const stylePropName in cssVars) {
      const isFun = typeof cssVars[stylePropName] === 'function';

      const key = isFun ? cssVars[stylePropName](cssVars) : cssVars[stylePropName];

      styles[stylePropName] = key;
      if (dependencies[stylePropName]) {
        const dependence = dependencies[stylePropName];
        dependence.forEach(de => {
          if (typeof de === 'string') {
            styles[de] = key;
          } else {
            const ret = eval(de.rule);
            if (de.keys && de.keys.length) {
              de.keys.forEach(dk => {
                styles[dk] = ret;
              })
            } else {
              styles[de.key] = ret;
            }
          }
        })
      }
    }
  },
  changeSomeCssVars(cssVars: object) {
    this.generateCssVars(cssVars);
    setCssVar(styles);
  },
  changeTheme(themeName: string, otherConfig: object) {
    styles = {};
    let cssVars = themes[themeName];
    this.generateCssVars(cssVars);
    this.generateCssVars(otherConfig);
    setCssVar(styles);
  }
};