export default {
  // 基础
  '--font-family': [
    '--statistic-font-family'
  ],
  '--font-size-sm': [
    '--tag-font-size',
    '--badge-font-size',
    '--comment-font-size-sm',
  ],
  '--font-size-base': [
    '--btn-font-size-sm',
    '--empty-font-size',
    '--dropdown-font-size',
    '--menu-icon-size',
    '--menu-item-font-size',
    '--menu-icon-size',
    '--comment-font-size-base',
    '--tabs-title-font-size',
    '--tabs-title-font-size-sm',
    '--breadcrumb-font-size',
    '--breadcrumb-icon-font-size',
    '--statistic-title-font-size',
    {
      key: '--font-size-lg',
      rule: '(Number(key.slice(0,-2)) + 2)+"px"',
    },
    {
      key: '--btn-font-size-lg',
      rule: '(Number(key.slice(0,-2)) + 2)+"px"',
    },
    {
      key: '--menu-icon-size-lg',
      rule: '(Number(key.slice(0,-2)) + 2)+"px"',
    },
    {
      key: '--menu-icon-size-lg',
      rule: '(Number(key.slice(0,-2)) + 2)+"px"',
    },
    {
      key: '--tabs-title-font-size-lg',
      rule: '(Number(key.slice(0,-2)) + 2)+"px"',
    },
    {
      key: '--heading-1-size',
      rule: 'Math.ceil(Number(key.slice(0,-2)) * 2.71) + "px"',
    },
    {
      key: '--heading-2-size',
      rule: 'Math.ceil(Number(key.slice(0,-2)) * 2.14) + "px"',
    },
    {
      key: '--heading-3-size',
      rule: 'Math.ceil(Number(key.slice(0,-2)) * 1.71) + "px"',
    },
    {
      key: '--heading-4-size',
      rule: 'Math.ceil(Number(key.slice(0,-2)) * 1.42) + "px"',
    },
  ],
  '--primary-color': [
    '--antd-wave-shadow-color',
    '--primary-6',
    '--text-selection-bg',
    '--link-color',
    '--outline-color',
    // '--btn-primary-bg',
    '--btn-primary-color', // TODO 默认
    '--checkbox-color',
    '--dropdown-selected-color',
    '--radio-dot-color',
    '--menu-highlight-color',
    '--menu-dark-item-active-bg',
    '--tabs-card-active-color',
    '--tabs-ink-bar-color',
    '--tabs-highlight-color',
    '--switch-color',
    '--slider-handle-color-tooltip-open',
    '--tree-directory-selected-bg',
    '--timeline-dot-color',
    '--link-color',
    {
      keys: ['--fade-primary-color-20', '--slider-handle-color-focus-shadow'],
      rule: 'fade(key, .2)'
    },
    {
      key: '--fade-radio-dot-color-6',
      rule: 'fade(key, .06)'
    },
    {
      key: '--fade-radio-dot-color-8',
      rule: 'fade(key, .08)'
    },
    {
      key: '--slider-handle-color-focus',
      rule: 'tint(key, .2)'
    },
    {
      keys: ['--slider-dot-border-color-active', '--link-hover-color'],
      rule: 'tint(key, .5)'
    },
    {
      // keys: ['--primary-1', '--item-active-bg', '--item-hover-bg', '--table-row-hover-bg', '--select-item-active-bg', '--menu-item-active-bg', '--tree-node-hover-bg'],
      keys: ['--primary-1', '--item-active-bg', '--item-hover-bg', '--select-item-active-bg', '--tree-node-hover-bg'],
      rule: 'palette(key, 1)'
    },
    {
      keys: ['--primary-2', '--tree-node-selected-bg'],
      rule: 'palette(key, 2)'
    },
    {
      keys: ['--primary-3', '--slider-track-background-color', '--slider-handle-color'],
      rule: 'palette(key, 3)'
    },
    {
      keys: ['--primary-4', '--slider-track-background-color-hover', '--slider-handle-color-hover'],
      rule: 'palette(key, 4)'
    },
    {
      keys: ['--primary-5', '--btn-group-border', '--radio-button-hover-color', '--input-number-handler-hover-bg', '--input-hover-border-color', '--tabs-hover-color', '--breadcrumb-link-color-hover'],
      rule: 'palette(key, 5)'
    },
    {
      key: '--primary-6',
      rule: 'palette(key, 6)'
    },
    {
      keys: ['--primary-7', '--radio-button-active-color', '--tabs-active-color', '--link-active-color'],
      rule: 'palette(key, 7)'
    },
    {
      key: '--primary-8',
      rule: 'palette(key, 8)'
    },
    {
      key: '--primary-9',
      rule: 'palette(key, 9)'
    },
    {
      key: '--primary-10',
      rule: 'palette(key, 10)'
    },
  ],
  '--border-radius-base': [
    '--collapse-panel-border-radius',
    '--table-border-radius-base',
    '--avatar-border-radius',
    '--btn-border-radius-base',
    '--btn-border-radius-sm',
  ],
  '--border-radius-sm': [
    '--card-border-radius',
  ],
  '--text-color': [
    '--btn-default-color',
    '--layout-trigger-color-light',
    '--input-color',
    '--popover-color',
    '--progress-text-color',
    '--menu-item-color',
    '--tag-default-color',
    '--back-top-hover-bg',
    '--breadcrumb-last-item-color',
    '--radio-button-color'
  ],
  '--text-color-secondary': [
    '--menu-item-group-title-color',
    '--comment-author-name-color',
    '--comment-action-color',
    '--back-top-bg',
    '--breadcrumb-base-color',
    '--breadcrumb-link-color',
    '--breadcrumb-separator-color',
    {
      key: '--shade-text-color-secondary-40',
      rule: 'shade(key, .4)'
    },
  ],
  '--background-color-base': [
    '--disabled-bg',
    '--progress-remaining-color',
    '--table-header-sort-bg',
    '--time-picker-selected-bg',
    '--slider-rail-background-color'
  ],
  '--link-color': [
    {
      key: '--link-hover-color',
      rule: 'palette(key, 5)'
    },
    {
      key: '--link-active-color',
      rule: 'palette(key, 7)'
    },
  ],
  '--success-color': [
    '--alert-success-icon-color',
    {
      key: '--alert-success-bg-color',
      rule: 'palette(key, 1)'
    },
    {
      key: '--alert-success-border-color',
      rule: 'palette(key, 3)'
    },
  ],
  '--error-color': [
    '--alert-error-icon-color',
    {
      key: '--alert-error-bg-color',
      rule: 'palette(key, 1)'
    },
    {
      key: '--alert-error-border-color',
      rule: 'palette(key, 3)'
    },
    {
      keys: ['--btn-danger-bg', '--btn-danger-border'],
      rule: 'palette(key, 5)'
    },
  ],
  '--warning-color': [
    '--alert-warning-icon-color',
    {
      key: '--alert-warning-bg-color',
      rule: 'palette(key, 1)'
    },
    {
      key: '--alert-warning-border-color',
      rule: 'palette(key, 3)'
    },
  ],
  '--info-color': [
    '--alert-info-icon-color',
    {
      key: '--alert-info-bg-color',
      rule: 'palette(key, 1)'
    },
    {
      key: '--alert-info-border-color',
      rule: 'palette(key, 3)'
    },
  ],
  '--processing-color': [
    '--progress-default-color'
  ],
  '--highlight-color': [
    '--label-required-color'
  ],
  '--border-color-base': [
    '--btn-default-border',
    '--btn-disable-border',
    '--input-border-color',
    '--input-border-bottom-color',
    '--input-number-handler-border-color',
    '--select-border-color'
  ],
  '--border-color-split': [
    '--anchor-border-color',
    '--modal-footer-border-color-split',
    '--rate-star-bg',
    '--slider-dot-border-color',
    '--timeline-color'
  ],
  '--padding-sm': [
    '--control-padding-horizontal',
    '--list-item-meta-title-margin-bottom',
    {
      key: '--list-item-padding',
      rule: 'key + " 0"'
    },
    {
      keys: ['--input-padding-horizontal', '--input-padding-horizontal-base', '--input-padding-horizontal-lg'],
      rule: 'Number(key.slice(0,-2)) - 1 + "px"'
    },
  ],
  '--padding-md': [
    '--collapse-content-padding',
    '--list-empty-text-padding',
    '--list-item-meta-margin-bottom',
    '--list-item-meta-avatar-margin-right',
    {
      key: '--btn-padding-base',
      rule: '"0 " + (Number(key.slice(0,-2))-1) + "px"'
    }
  ],
  '--padding-xs': [
    '--control-padding-horizontal-sm',
    {
      key: '--btn-padding-sm',
      rule: '"0 " + (Number(key.slice(0,-2))-1) + "px"'
    },
    {
      key: '--breadcrumb-separator-margin',
      rule: '"0 " + key'
    },
    {
      key: '--input-padding-horizontal-sm',
      rule: 'Number(key.slice(0,-2)) - 1 + "px"'
    },
  ],
  '--component-background': [
    '--shadow-color-inverse',
    '--btn-default-bg',
    '--input-bg',
    '--input-number-handler-bg',
    '--select-dropdown-bg',
    '--popover-bg',
    '--modal-header-bg',
    '--menu-bg',
    '--menu-popup-bg',
    '--badge-text-color',
    '--card-background',
    '--pagination-item-bg-active',
    '--slider-handle-background-color',
    '--slider-disabled-background-color',
    '--collapse-content-bg',
    '--timeline-dot-bg',
    '--popover-arrow-color',
    '--popover-arrow-outer-color',
    '--form-warning-input-bg',
    '--form-error-input-bg',
  ],
  '--shadow-color': [
    {
      keys: ['--shadow-1-up', '--box-shadow-base'],
      rule: '"0 -2px 8px " + key'
    },
    {
      key: '--shadow-1-down',
      rule: '"0 2px 8px " + key'
    },
    {
      key: '--shadow-1-left',
      rule: '"-2px 0 8px " + key'
    },
    {
      key: '--shadow-1-right',
      rule: '"2px 0 8px " + key'
    },
    {
      key: '--shadow-2',
      rule: '"0 4px 12px " + key'
    },
  ],
  '--border-width-base': [
    '--btn-border-width',
    '--checkbox-border-width'
  ],
  '--border-style-base': [
    '--btn-border-style'
  ],
  '--disabled-color': [
    '--btn-disable-color',
    '--slider-disabled-color'
  ],
  '--disabled-bg': [
    '--btn-disable-bg',
    '--input-disabled-bg',
    '--transfer-disabled-bg',
    {
      key: '--darken-disabled-bg-10',
      rule: 'darken(key, .1)'
    }
  ],
  '--heading-color': [
    '--label-color',
    '--table-header-color',
    '--table-footer-color',
    '--card-head-color'
  ],
  '--background-color-light': [
    '--input-addon-bg',
    '--select-item-selected-bg',
    '--table-header-bg',
    '--table-footer-bg',
    '--tag-default-bg',
    '--card-actions-background',
    '--tabs-card-head-background',
    '--collapse-header-bg',
    {
      key: '--darken-table-header-bg-3',
      rule: 'darken(key, .03)'
    },
    {
      key: '--darken-table-header-bg-3-5',
      rule: 'darken(darken(key, .03), .05)'
    },
  ],
  // 组件
  '--layout-header-background': [
    '--layout-sider-background',
    '--menu-dark-bg',
    {
      key: '--tint-layout-sider-background-10',
      rule: 'tint(key, .1)'
    }
  ],
  '--layout-sider-background': [
    // '--menu-bg',
    // '--sider-menu-logo-background',
    {
      key: '--tint-layout-sider-background-10',
      rule: 'tint(key, .1)'
    }
  ],
  '--layout-sider-text-color':[
    '--sider-menu-logo-color',
    // '--menu-item-dark-color',
    // '--menu-item-color'
  ],
  '--layout-body-background': [
    '--layout-footer-background'
  ],
  '--switch-color': [
    {
      key: '--fade-switch-color-20',
      rule: 'fade(key, .2)'
    }
  ],
  '--popover-bg': [
    '--popover-arrow-color',
    '--popover-arrow-outer-color',
  ],
  '--tooltip-bg': [
    '--tooltip-arrow-color'
  ],
  '--btn-default-bg': [
    '--radio-button-bg',
    '--radio-button-checked-bg',
  ],
  '--btn-padding-base': [
    '--btn-circle-size',
    '--btn-square-size',
  ],
  '--btn-padding-lg': [
    '--btn-circle-size-lg',
    '--btn-square-size-lg',
  ],
  '--btn-padding-sm': [
    '--btn-circle-size-sm',
    '--btn-square-size-sm',
  ],
  '--btn-default-color': [
    '--radio-button-color'
  ],
  '--input-bg': [
    '--form-warning-input-bg',
    '--form-error-input-bg'
  ],
  '--control-padding-horizontal': [
    {
      keys: ['--input-padding-horizontal', '--input-padding-horizontal-base', '--input-padding-horizontal-lg'],
      rule: 'Number(key.slice(0,-2)) - 1 + "px"'
    },
  ],
  '--control-padding-horizontal-sm': [
    {
      key: '--input-padding-horizontal-sm',
      rule: 'Number(key.slice(0,-2)) - 1 + "px"'
    },
  ],
  '--item-active-bg': [
    '--select-item-active-bg',
    '--menu-item-active-bg'
  ],
  '--item-hover-bg': [
    '--tree-node-hover-bg'
  ],
  '--table-selected-row-bg': [
    '--table-body-selected-sort-bg',
    '--table-selected-row-hover-bg'
  ],
  '--text-color-secondary-dark': [
    '--menu-dark-color'
  ],
  '--tooltip-arrow-width': [
    {
      key: '--tooltip-distance',
      rule: 'Number(key.slice(0,-2)) - 1 + 4 + "px"'
    }
  ],
  '--popover-arrow-width': [
    {
      key: '--popover-distance',
      rule: 'Number(key.slice(0,-2)) + 4 + "px"'
    }
  ],
  '--time-picker-panel-column-width': [
    {
      key: '--time-picker-panel-width',
      rule: 'Number(key.slice(0,-2)) * 3 + "px"'
    }
  ],
  '--switch-sm-height': [
    {
      key: '--switch-sm-checked-margin-left',
      rule: '-(Number(key.slice(0,-2)) - 3) + "px"'
    }
  ],
  '--card-skeleton-bg': [
    {
      key: '--fade-card-skeleton-bg-20',
      rule: 'fade(key, .2)'
    },
    {
      key: '--fade-card-skeleton-bg-40',
      rule: 'fade(key, .4)'
    },
  ],
  '--skeleton-color': [
    {
      key: '--shade-skeleton-color-5',
      rule: 'shade(key, .05)'
    },
  ],
  '--table-header-bg': [
    {
      key: '--darken-table-header-bg-3',
      rule: 'darken(key, .03)'
    },
    {
      key: '--darken-table-header-bg-3-5',
      rule: 'darken(darken(key, .03), .05)'
    },
  ],
  '--tabs-horizontal-padding': [
    {
      key: '--tabs-horizontal-padding-extract-1',
      rule: 'extract(key, 1)'
    },
  ],
  '--tabs-horizontal-padding-lg': [
    {
      key: '--tabs-horizontal-padding-lg-extract-1',
      rule: 'extract(key, 1)'
    },
  ],
  '--tabs-horizontal-padding-sm': [
    {
      key: '--tabs-horizontal-padding-sm-extract-1',
      rule: 'extract(key, 1)'
    },
  ],
  '--global-header-text-color': [
    '--global-header-trigger-color'
  ],
  '--sider-menu-background': [
    {
      key: '--sider-menu-submenu-background',
      rule: 'darken(key, .01)'
    }
  ]
}