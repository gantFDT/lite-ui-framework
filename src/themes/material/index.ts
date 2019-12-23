import { darken, lighten } from '../index'

const primaryColor = '#428e72';//靛蓝 #00BFBF
const greenColor = '#428e72';//墨绿 #50B849 #27a51e #428e72
const darkBlueColor = '#4c555c';//深蓝
const orangeColor = '#EE9611';//橘色 #FAAB18 #efa510 
const menuColor = '#4c555c';//深灰

const darken10primaryColor = ({ '--primary-color': pColor }) => darken(pColor, .1);

const darken20primaryColor = ({ '--primary-color': pColor }) => darken(pColor, .2);

export default {
  '--primary-color': primaryColor,

  '--global-header-background': greenColor,
  '--global-header-text-color': '#fff',

  '--sider-menu-logo-background': greenColor,
  '--sider-menu-logo-color': '#fff',

  '--sider-menu-background': menuColor,
  '--sider-menu-text-color': '#fff',
  '--component-background': '#fff',

  '--global-header-box-border-bottom': 'none',
  '--global-header-box-shadow': '0 1px 1px rgba(0, 0, 0, 0.2)',
  '--global-header-trigger-background': 'transparent',
  '--global-header-trigger-color': '#fff',

  '--header-hover-background': 'rgb(0,0,0,0.1)',
  '--header-hover-color': '#fff',

  '--layout-sider-background': greenColor,
  '--sider-menu-logo-box-shadow': '0 1px 1px rgba(0, 0, 0, 0.2)',
  '--sider-menu-border-bottom': '1px solid rgba(0,0,0,0.1)',
  '--sider-border-right': '1px solid rgba(255,255,255,.1)',

  '--menu-dark-bg': menuColor,
  '--menu-dark-submenu-bg': '#262c2f',
  '--menu-dark-item-active-bg': '#353B3E',
  '--menu-item-active-bg': '#353B3E',
  '--menu-item-dark-color': 'rgba(255,255,255,1)',


  '--btn-primary-color': primaryColor,
  '--btn-warning-color': orangeColor,
  '--warning-color': orangeColor,
  '--btn-border-radius-base': '20px',
  '--btn-border-radius-sm': '12px',
  '--btn-shadow': '0 1px 2px rgba(0, 0, 0, 0.1)',
  '--btn-primary-shadow': '0 1px 2px rgba(0, 0, 0, 0.1)',
  '--btn-group-border': darken10primaryColor,
  '--btn-text-shadow': 'none',
  '--text-selection-bg': '#3EB79C',


  '--checkbox-color': darken10primaryColor,
  '--dropdown-selected-color': darken10primaryColor,

  '--radio-dot-color': darken10primaryColor,
  '--radio-button-hover-color': darken10primaryColor,
  '--radio-button-active-color': darken20primaryColor,

  '--input-border-hover-color': darken10primaryColor,
  '--input-border-focus-color': darken10primaryColor,
  '--input-number-handler-hover-bg': darken10primaryColor,
  '--input-hover-border-color': darken10primaryColor,
  '--input-border-radius': '4px',

  '--tabs-card-active-color': darken10primaryColor,
  '--tabs-ink-bar-color': darken10primaryColor,
  '--tabs-highlight-color': darken10primaryColor,
  '--tabs-hover-color': darken10primaryColor,
  '--tabs-active-color': darken10primaryColor,

  '--switch-color': darken10primaryColor,

  '--card-box-shadow': '0 0 5px rgba(0, 0, 0, 0.1)',
  '--card-border-radius': '0px',
  '--card-border': 'none',

  '--background-color-light': 'rgba(255,255,255,0.9)',
  '--table-header-bg': greenColor,
  '--table-header-color': '#fff',
  '--table-row-hover-bg': lighten(greenColor, 0.8),

  '--modal-header-bg': darkBlueColor,
  '--modal-header-color': '#fff',
  '--modal-footer-reset-color': darkBlueColor,

  '--table-border-radius-base': '0px',

  '--upload-bg': '#fff',
}