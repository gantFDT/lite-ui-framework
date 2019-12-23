import antdImg from '@/assets/images/theme/antd.png'
import classicImg from '@/assets/images/theme/classic.png'
import aliyunImg from '@/assets/images/theme/aliyun.png'
import materialImg from '@/assets/images/theme/material.png'
import blackImg from '@/assets/images/theme/black.png'
import githubImg from '@/assets/images/theme/github.png'
import { tr } from '@/components/common'


export interface UiConfig {
  MAIN_CONFIG?: {
    navTheme?: string,
    themeType?: string,
    layout?: string,
    contentWidth?: string,
  }
}
export interface Theme {
  value: string,
  name: string,
  intro: string,
  image: "*.png",
  uiConfig: UiConfig
}
export type Themes = Array<Theme>


export const JS_VAR_KEYS = [
  'primaryColor',
  'siderMenuBackground',
  'siderMenuTextColor',
  'siderMenuLogoBackground',
  'siderMenuLogoColor',
  'globalHeaderBackground',
  'globalHeaderTextColor',
];
export const themes: Themes = [{
  value: 'antd',
  name: tr('Antd 蚂蚁设计'),
  intro: tr('蚂蚁金服原生风格，关键词："Antd、蓝色"'),
  image: antdImg,
  uiConfig: {
    MAIN_CONFIG: {
      navTheme: 'dark',
    }
  }
}, {
  value: 'classic',
  name: tr('Classic 经典'),
  intro: tr('经典风格，默认风格、关键词："线条、镂空、圆角"'),
  image: classicImg,
  uiConfig: {}
}, {
  value: 'material',
  name: tr('Material 谷歌设计 '),
  intro: tr('Material风格，关键词："绿色、黄色、靛蓝、谷歌 Material"'),
  image: materialImg,
  uiConfig: {
    MAIN_CONFIG: {
      navTheme: 'dark'
    }
  }
}, {
  value: 'dark',
  name: tr('Black 黑暗'),
  intro: tr('暗色风格，关键词："背景暗色、文字白色、夜间模式"'),
  image: blackImg,
  uiConfig: {
    MAIN_CONFIG: {
      navTheme: 'dark',
      themeType: 'dark'
    }
  }
}, {
  value: 'aliyun',
  name: tr('Aliyun 阿里云'),
  intro: tr('阿里云风格，关键词：橙色、灰色、直角'),
  image: aliyunImg,
  uiConfig: {}
}, {
  value: 'github',
  name: 'GitHub',
  intro: tr('GitHub风格，关键词：灰色、绿色、顶部菜单、定宽'),
  image: githubImg,
  uiConfig: {
    MAIN_CONFIG: {
      navTheme: 'dark',
      layout: "topmenu",
      contentWidth: "Fixed"
    }
  }
}]

