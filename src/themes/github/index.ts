import { darken, lighten } from '../index'

const primaryColor = '#2DB94D';
export default {
  '--primary-color': primaryColor,
  '--primary-1': lighten(primaryColor, 0.45),
  '--primary-2': lighten(primaryColor, 0.40),
  '--primary-3': lighten(primaryColor, 0.30),
  '--primary-4': lighten(primaryColor, 0.20),
  '--primary-5': lighten(primaryColor, 0.10),
  '--primary-6': primaryColor,
  '--primary-7': darken(primaryColor, 0.10),
  '--primary-8': darken(primaryColor, 0.20),
  '--primary-9': darken(primaryColor, 0.30),
  '--primary-10': darken(primaryColor, 0.40),


  '--global-header-background': '#24292E',
  '--global-header-box-border-bottom': 'none',
  '--global-header-text-color': '#fff',
  '--global-header-box-shadow': '0 1px 1px rgba(0, 0, 0, 0)',
  '--global-header-action-border-right': '1px solid rgba(255, 255, 255, 0.3)',
  '--global-header-trigger-background': 'transparent',
  '--global-header-trigger-color': '#fff',
  '--layout-header-height':'40px',
  
  '--header-hover-background': 'rgb(0,0,0,0.1)',
  '--header-hover-color': '#fff',

  '--layout-sider-background': '#24292E',
  '--sider-menu-logo-box-shadow': '0 1px 1px rgba(0, 0, 0, 0)',
  '--sider-menu-border-bottom': '1px solid rgba(0,0,0,0.1)',

  '--menu-dark-bg': '#4c555c',
  '--menu-dark-submenu-bg': '#262c2f',
  '--menu-dark-item-active-bg': '#353B3E',
  '--menu-item-active-bg': '#353B3E',
  '--menu-item-dark-color': 'rgba(255,255,255,1)',


  '--btn-primary-color': primaryColor,
  '--btn-border-radius-base': '4px',
  '--btn-border-radius-sm': '4px',
  '--btn-shadow': '0 1px 2px rgba(0, 0, 0, 0)',
  '--btn-primary-shadow': '0 1px 2px rgba(0, 0, 0, 0)',
  '--btn-group-border': darken(primaryColor, 0.10),
  '--btn-text-shadow': 'none',

  '--text-selection-bg': '#3EB79C',

  '--checkbox-color': darken(primaryColor, 0.10),
  '--dropdown-selected-color': darken(primaryColor, 0.10),

  '--radio-dot-color': darken(primaryColor, 0.10),
  '--radio-button-hover-color': darken(primaryColor, 0.10),
  '--radio-button-active-color': darken(primaryColor, 0.20),

  '--input-border-hover-color': darken(primaryColor, 0.10),
  '--input-border-focus-color': darken(primaryColor, 0.10),
  '--input-number-handler-hover-bg': darken(primaryColor, 0.10),
  '--input-hover-border-color': darken(primaryColor, 0.10),
  '--input-border-radius': '4px',

  '--tabs-card-active-color': darken(primaryColor, 0.10),
  '--tabs-ink-bar-color': darken(primaryColor, 0.10),
  '--tabs-highlight-color': darken(primaryColor, 0.10),
  '--tabs-hover-color': darken(primaryColor, 0.10),
  '--tabs-active-color': darken(primaryColor, 0.10),

  '--switch-color': darken(primaryColor, 0.10),
  '--table-row-hover-bg': lighten(primaryColor, 0.45),

  '--card-box-shadow': '0 0 5px rgba(0, 0, 0, 0)',
  '--card-border-radius': '4px',
  '--card-border': 'none',

  '--table-header-bg': '#24292E',
  '--table-header-color': '#fff',

  '--modal-header-bg': '#38485D',
  '--modal-header-color': '#fff',
  '--modal-header-hover-color': 'rgba(255,255,255,1)',

  '--background-color-light': 'rgba(255,255,255,0.9)'
}