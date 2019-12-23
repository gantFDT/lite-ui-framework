{
  mode: 'production',
  externals: {
    '@antv/data-set': 'DataSet',
    '@antv/g6': 'G6',
    '@antv/g6/plugins': 'G6Plugins'
  },
  devtool: false,
  node: {
    setImmediate: false,
    process: 'mock',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  output: {
    path: '/Users/vvey/Desktop/gant/ui-framework/dist',
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].async.js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: info => {
      return (0, _path().relative)(opts.cwd, info.absoluteResourcePath).replace(/\\/g, '/');
    }
  },
  resolve: {
    symlinks: true,
    alias: {
      dva: '/Users/vvey/Desktop/gant/ui-framework/node_modules/dva',
      'dva-loading': '/Users/vvey/Desktop/gant/ui-framework/node_modules/dva-loading/dist/index.js',
      'path-to-regexp': '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-plugin-dva/node_modules/path-to-regexp/index.js',
      'object-assign': '/Users/vvey/Desktop/gant/ui-framework/node_modules/object-assign/index.js',
      'umi/locale': '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-plugin-locale/lib/locale.js',
      'react-intl': '/Users/vvey/Desktop/gant/ui-framework/node_modules/react-intl',
      react: '/Users/vvey/Desktop/gant/ui-framework/node_modules/react',
      'react-dom': '/Users/vvey/Desktop/gant/ui-framework/node_modules/react-dom',
      'react-router': '/Users/vvey/Desktop/gant/ui-framework/node_modules/react-router',
      'react-router-dom': '/Users/vvey/Desktop/gant/ui-framework/node_modules/react-router-dom',
      'react-router-config': '/Users/vvey/Desktop/gant/ui-framework/node_modules/react-router-config',
      history: '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-history',
      '@': '/Users/vvey/Desktop/gant/ui-framework/src/',
      '@tmp': '/Users/vvey/Desktop/gant/ui-framework/src/pages/.umi-production',
      umi: '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi',
      'regenerator-runtime': '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-build-dev/node_modules/regenerator-runtime',
      antd: '/Users/vvey/Desktop/gant/ui-framework/node_modules/antd',
      'antd-mobile': '/Users/vvey/Desktop/gant/ui-framework/node_modules/antd-mobile'
    },
    extensions: [
      '.web.js',
      '.wasm',
      '.mjs',
      '.js',
      '.web.jsx',
      '.jsx',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.json'
    ],
    mainFields: [
      'main',
      'module'
    ],
    modules: [
      'node_modules',
      '/Users/vvey/Desktop/gant/ui-framework/node_modules/af-webpack/node_modules',
      '/Users/vvey/Desktop/gant/ui-framework/node_modules/'
    ]
  },
  resolveLoader: {
    modules: [
      'node_modules',
      '/Users/vvey/Desktop/gant/ui-framework/node_modules/af-webpack/node_modules'
    ]
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://v5.ip2fw.gantcloud.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  module: {
    exprContextCritical: false,
    rules: [
      /* config.module.rule('exclude') */
      {
        exclude: [
          /\.json$/,
          /\.(js|jsx|ts|tsx|mjs|wasm)$/,
          /\.(graphql|gql)$/,
          /\.(css|less|scss|sass)$/
        ],
        use: [
          /* config.module.rule('exclude').use('url-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-url-pnp-loader/dist/cjs.js',
            options: {
              limit: 10000,
              name: 'static/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      /* config.module.rule('mjs-require') */
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
        include: [
          '/Users/vvey/Desktop/gant/ui-framework'
        ]
      },
      /* config.module.rule('mjs') */
      {
        test: /\.mjs$/,
        include: [
          '/Users/vvey/Desktop/gant/ui-framework'
        ],
        use: [
          /* config.module.rule('mjs').use('babel-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-loader/lib/index.js',
            options: {
              presets: [
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/index.js',
                  {
                    targets: {
                      chrome: 49,
                      firefox: 64,
                      safari: 10,
                      edge: 13,
                      ios: 10,
                      ie: 11
                    },
                    env: {
                      useBuiltIns: 'entry',
                      corejs: 2,
                      modules: false
                    }
                  }
                ]
              ],
              plugins: [
                '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-build-dev/lib/plugins/afwebpack-config/lockCoreJSVersionPlugin.js',
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd-mobile',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd-mobile'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'ant-design-pro',
                    libraryDirectory: 'lib',
                    style: true,
                    camel2DashComponentName: false
                  },
                  'ant-design-pro'
                ],
                'dynamic-import-node',
                [
                  'import',
                  {
                    libraryName: 'gantd',
                    camel2DashComponentName: false,
                    style: false,
                    customName: (name) => {
                        if (name === 'withAnchor') {
                            return 'gantd/lib/compose/anchor';
                        }
                        if (name === 'EditStatus' || name === 'SwitchStatus') {
                            return `gantd/lib/compose/${name.toLowerCase()}`;
                        }
                        if (name === 'RangePicker') {
                            return 'gantd/lib/datepicker/RangePicker'
                        }
                        if (name === "TextArea" || name === "Search" || name === "Password" || name === 'Group') {
                            return `gantd/lib/input/${name}`
                        }
                        return `gantd/lib/${name.toLowerCase()}`;
                    }
                  }
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-named-asset-import/index.js',
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '/Users/vvey/Desktop/gant/ui-framework/node_modules/af-webpack/lib/svgr.js?-prettier,-svgo![path]'
                      }
                    }
                  }
                ]
              ],
              sourceType: 'unambiguous',
              cacheDirectory: true,
              babelrc: false,
              customize: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/webpack-overrides.js'
            }
          }
        ]
      },
      /* config.module.rule('js') */
      {
        test: /\.js$/,
        include: [
          '/Users/vvey/Desktop/gant/ui-framework'
        ],
        exclude: [
          /node_modules/
        ],
        use: [
          /* config.module.rule('js').use('babel-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-loader/lib/index.js',
            options: {
              presets: [
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/index.js',
                  {
                    targets: {
                      chrome: 49,
                      firefox: 64,
                      safari: 10,
                      edge: 13,
                      ios: 10,
                      ie: 11
                    },
                    env: {
                      useBuiltIns: 'entry',
                      corejs: 2,
                      modules: false
                    }
                  }
                ]
              ],
              plugins: [
                '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-build-dev/lib/plugins/afwebpack-config/lockCoreJSVersionPlugin.js',
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd-mobile',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd-mobile'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'ant-design-pro',
                    libraryDirectory: 'lib',
                    style: true,
                    camel2DashComponentName: false
                  },
                  'ant-design-pro'
                ],
                'dynamic-import-node',
                [
                  'import',
                  {
                    libraryName: 'gantd',
                    camel2DashComponentName: false,
                    style: false,
                    customName: (name) => {
                        if (name === 'withAnchor') {
                            return 'gantd/lib/compose/anchor';
                        }
                        if (name === 'EditStatus' || name === 'SwitchStatus') {
                            return `gantd/lib/compose/${name.toLowerCase()}`;
                        }
                        if (name === 'RangePicker') {
                            return 'gantd/lib/datepicker/RangePicker'
                        }
                        if (name === "TextArea" || name === "Search" || name === "Password" || name === 'Group') {
                            return `gantd/lib/input/${name}`
                        }
                        return `gantd/lib/${name.toLowerCase()}`;
                    }
                  }
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-named-asset-import/index.js',
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '/Users/vvey/Desktop/gant/ui-framework/node_modules/af-webpack/lib/svgr.js?-prettier,-svgo![path]'
                      }
                    }
                  }
                ]
              ],
              sourceType: 'unambiguous',
              cacheDirectory: true,
              babelrc: false,
              customize: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/webpack-overrides.js'
            }
          }
        ]
      },
      /* config.module.rule('jsx') */
      {
        test: /\.jsx$/,
        include: [
          '/Users/vvey/Desktop/gant/ui-framework'
        ],
        use: [
          /* config.module.rule('jsx').use('babel-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-loader/lib/index.js',
            options: {
              presets: [
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/index.js',
                  {
                    targets: {
                      chrome: 49,
                      firefox: 64,
                      safari: 10,
                      edge: 13,
                      ios: 10,
                      ie: 11
                    },
                    env: {
                      useBuiltIns: 'entry',
                      corejs: 2,
                      modules: false
                    }
                  }
                ]
              ],
              plugins: [
                '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-build-dev/lib/plugins/afwebpack-config/lockCoreJSVersionPlugin.js',
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd-mobile',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd-mobile'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'ant-design-pro',
                    libraryDirectory: 'lib',
                    style: true,
                    camel2DashComponentName: false
                  },
                  'ant-design-pro'
                ],
                'dynamic-import-node',
                [
                  'import',
                  {
                    libraryName: 'gantd',
                    camel2DashComponentName: false,
                    style: false,
                    customName: (name) => {
                        if (name === 'withAnchor') {
                            return 'gantd/lib/compose/anchor';
                        }
                        if (name === 'EditStatus' || name === 'SwitchStatus') {
                            return `gantd/lib/compose/${name.toLowerCase()}`;
                        }
                        if (name === 'RangePicker') {
                            return 'gantd/lib/datepicker/RangePicker'
                        }
                        if (name === "TextArea" || name === "Search" || name === "Password" || name === 'Group') {
                            return `gantd/lib/input/${name}`
                        }
                        return `gantd/lib/${name.toLowerCase()}`;
                    }
                  }
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-named-asset-import/index.js',
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '/Users/vvey/Desktop/gant/ui-framework/node_modules/af-webpack/lib/svgr.js?-prettier,-svgo![path]'
                      }
                    }
                  }
                ]
              ],
              sourceType: 'unambiguous',
              cacheDirectory: true,
              babelrc: false,
              customize: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/webpack-overrides.js'
            }
          }
        ]
      },
      /* config.module.rule('extraBabelInclude_0') */
      {
        test: /\.jsx?$/,
        include: [
          '/Users/vvey/Desktop/gant/ui-prd'
        ],
        use: [
          /* config.module.rule('extraBabelInclude_0').use('babel-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-loader/lib/index.js',
            options: {
              presets: [
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/index.js',
                  {
                    targets: {
                      chrome: 49,
                      firefox: 64,
                      safari: 10,
                      edge: 13,
                      ios: 10,
                      ie: 11
                    },
                    env: {
                      useBuiltIns: 'entry',
                      corejs: 2,
                      modules: false
                    }
                  }
                ]
              ],
              plugins: [
                '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-build-dev/lib/plugins/afwebpack-config/lockCoreJSVersionPlugin.js',
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd-mobile',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd-mobile'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'ant-design-pro',
                    libraryDirectory: 'lib',
                    style: true,
                    camel2DashComponentName: false
                  },
                  'ant-design-pro'
                ],
                'dynamic-import-node',
                [
                  'import',
                  {
                    libraryName: 'gantd',
                    camel2DashComponentName: false,
                    style: false,
                    customName: (name) => {
                        if (name === 'withAnchor') {
                            return 'gantd/lib/compose/anchor';
                        }
                        if (name === 'EditStatus' || name === 'SwitchStatus') {
                            return `gantd/lib/compose/${name.toLowerCase()}`;
                        }
                        if (name === 'RangePicker') {
                            return 'gantd/lib/datepicker/RangePicker'
                        }
                        if (name === "TextArea" || name === "Search" || name === "Password" || name === 'Group') {
                            return `gantd/lib/input/${name}`
                        }
                        return `gantd/lib/${name.toLowerCase()}`;
                    }
                  }
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-named-asset-import/index.js',
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '/Users/vvey/Desktop/gant/ui-framework/node_modules/af-webpack/lib/svgr.js?-prettier,-svgo![path]'
                      }
                    }
                  }
                ]
              ],
              sourceType: 'unambiguous',
              cacheDirectory: true,
              babelrc: false,
              customize: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/webpack-overrides.js'
            }
          }
        ]
      },
      /* config.module.rule('extraBabelInclude_1') */
      {
        test: /\.jsx?$/,
        include: [
          '/Users/vvey/Desktop/gant/ui-prj'
        ],
        use: [
          /* config.module.rule('extraBabelInclude_1').use('babel-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-loader/lib/index.js',
            options: {
              presets: [
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/index.js',
                  {
                    targets: {
                      chrome: 49,
                      firefox: 64,
                      safari: 10,
                      edge: 13,
                      ios: 10,
                      ie: 11
                    },
                    env: {
                      useBuiltIns: 'entry',
                      corejs: 2,
                      modules: false
                    }
                  }
                ]
              ],
              plugins: [
                '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-build-dev/lib/plugins/afwebpack-config/lockCoreJSVersionPlugin.js',
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd-mobile',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd-mobile'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'ant-design-pro',
                    libraryDirectory: 'lib',
                    style: true,
                    camel2DashComponentName: false
                  },
                  'ant-design-pro'
                ],
                'dynamic-import-node',
                [
                  'import',
                  {
                    libraryName: 'gantd',
                    camel2DashComponentName: false,
                    style: false,
                    customName: (name) => {
                        if (name === 'withAnchor') {
                            return 'gantd/lib/compose/anchor';
                        }
                        if (name === 'EditStatus' || name === 'SwitchStatus') {
                            return `gantd/lib/compose/${name.toLowerCase()}`;
                        }
                        if (name === 'RangePicker') {
                            return 'gantd/lib/datepicker/RangePicker'
                        }
                        if (name === "TextArea" || name === "Search" || name === "Password" || name === 'Group') {
                            return `gantd/lib/input/${name}`
                        }
                        return `gantd/lib/${name.toLowerCase()}`;
                    }
                  }
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-named-asset-import/index.js',
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '/Users/vvey/Desktop/gant/ui-framework/node_modules/af-webpack/lib/svgr.js?-prettier,-svgo![path]'
                      }
                    }
                  }
                ]
              ],
              sourceType: 'unambiguous',
              cacheDirectory: true,
              babelrc: false,
              customize: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/webpack-overrides.js'
            }
          }
        ]
      },
      /* config.module.rule('extraBabelInclude_2') */
      {
        test: /\.jsx?$/,
        include: [
          function () { /* omitted long function */ }
        ],
        use: [
          /* config.module.rule('extraBabelInclude_2').use('babel-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-loader/lib/index.js',
            options: {
              presets: [
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/index.js',
                  {
                    targets: {
                      chrome: 49,
                      firefox: 64,
                      safari: 10,
                      edge: 13,
                      ios: 10,
                      ie: 11
                    },
                    env: {
                      useBuiltIns: 'entry',
                      corejs: 2,
                      modules: false
                    }
                  }
                ]
              ],
              plugins: [
                '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-build-dev/lib/plugins/afwebpack-config/lockCoreJSVersionPlugin.js',
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd-mobile',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd-mobile'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'ant-design-pro',
                    libraryDirectory: 'lib',
                    style: true,
                    camel2DashComponentName: false
                  },
                  'ant-design-pro'
                ],
                'dynamic-import-node',
                [
                  'import',
                  {
                    libraryName: 'gantd',
                    camel2DashComponentName: false,
                    style: false,
                    customName: (name) => {
                        if (name === 'withAnchor') {
                            return 'gantd/lib/compose/anchor';
                        }
                        if (name === 'EditStatus' || name === 'SwitchStatus') {
                            return `gantd/lib/compose/${name.toLowerCase()}`;
                        }
                        if (name === 'RangePicker') {
                            return 'gantd/lib/datepicker/RangePicker'
                        }
                        if (name === "TextArea" || name === "Search" || name === "Password" || name === 'Group') {
                            return `gantd/lib/input/${name}`
                        }
                        return `gantd/lib/${name.toLowerCase()}`;
                    }
                  }
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-named-asset-import/index.js',
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '/Users/vvey/Desktop/gant/ui-framework/node_modules/af-webpack/lib/svgr.js?-prettier,-svgo![path]'
                      }
                    }
                  }
                ]
              ],
              sourceType: 'unambiguous',
              cacheDirectory: true,
              babelrc: false,
              customize: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/webpack-overrides.js'
            }
          }
        ]
      },
      /* config.module.rule('extraBabelInclude_3') */
      {
        test: /\.jsx?$/,
        include: [
          function () { /* omitted long function */ }
        ],
        use: [
          /* config.module.rule('extraBabelInclude_3').use('babel-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-loader/lib/index.js',
            options: {
              presets: [
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/index.js',
                  {
                    targets: {
                      chrome: 49,
                      firefox: 64,
                      safari: 10,
                      edge: 13,
                      ios: 10,
                      ie: 11
                    },
                    env: {
                      useBuiltIns: 'entry',
                      corejs: 2,
                      modules: false
                    }
                  }
                ]
              ],
              plugins: [
                '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-build-dev/lib/plugins/afwebpack-config/lockCoreJSVersionPlugin.js',
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd-mobile',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd-mobile'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'ant-design-pro',
                    libraryDirectory: 'lib',
                    style: true,
                    camel2DashComponentName: false
                  },
                  'ant-design-pro'
                ],
                'dynamic-import-node',
                [
                  'import',
                  {
                    libraryName: 'gantd',
                    camel2DashComponentName: false,
                    style: false,
                    customName: (name) => {
                        if (name === 'withAnchor') {
                            return 'gantd/lib/compose/anchor';
                        }
                        if (name === 'EditStatus' || name === 'SwitchStatus') {
                            return `gantd/lib/compose/${name.toLowerCase()}`;
                        }
                        if (name === 'RangePicker') {
                            return 'gantd/lib/datepicker/RangePicker'
                        }
                        if (name === "TextArea" || name === "Search" || name === "Password" || name === 'Group') {
                            return `gantd/lib/input/${name}`
                        }
                        return `gantd/lib/${name.toLowerCase()}`;
                    }
                  }
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-named-asset-import/index.js',
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '/Users/vvey/Desktop/gant/ui-framework/node_modules/af-webpack/lib/svgr.js?-prettier,-svgo![path]'
                      }
                    }
                  }
                ]
              ],
              sourceType: 'unambiguous',
              cacheDirectory: true,
              babelrc: false,
              customize: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/webpack-overrides.js'
            }
          }
        ]
      },
      /* config.module.rule('ts') */
      {
        test: /\.tsx?$/,
        use: [
          /* config.module.rule('ts').use('babel-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-loader/lib/index.js',
            options: {
              presets: [
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/index.js',
                  {
                    targets: {
                      chrome: 49,
                      firefox: 64,
                      safari: 10,
                      edge: 13,
                      ios: 10,
                      ie: 11
                    },
                    env: {
                      useBuiltIns: 'entry',
                      corejs: 2,
                      modules: false
                    }
                  }
                ]
              ],
              plugins: [
                '/Users/vvey/Desktop/gant/ui-framework/node_modules/umi-build-dev/lib/plugins/afwebpack-config/lockCoreJSVersionPlugin.js',
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'antd-mobile',
                    libraryDirectory: 'es',
                    style: true
                  },
                  'antd-mobile'
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-import/lib/index.js',
                  {
                    libraryName: 'ant-design-pro',
                    libraryDirectory: 'lib',
                    style: true,
                    camel2DashComponentName: false
                  },
                  'ant-design-pro'
                ],
                'dynamic-import-node',
                [
                  'import',
                  {
                    libraryName: 'gantd',
                    camel2DashComponentName: false,
                    style: false,
                    customName: (name) => {
                        if (name === 'withAnchor') {
                            return 'gantd/lib/compose/anchor';
                        }
                        if (name === 'EditStatus' || name === 'SwitchStatus') {
                            return `gantd/lib/compose/${name.toLowerCase()}`;
                        }
                        if (name === 'RangePicker') {
                            return 'gantd/lib/datepicker/RangePicker'
                        }
                        if (name === "TextArea" || name === "Search" || name === "Password" || name === 'Group') {
                            return `gantd/lib/input/${name}`
                        }
                        return `gantd/lib/${name.toLowerCase()}`;
                    }
                  }
                ],
                [
                  '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-plugin-named-asset-import/index.js',
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '/Users/vvey/Desktop/gant/ui-framework/node_modules/af-webpack/lib/svgr.js?-prettier,-svgo![path]'
                      }
                    }
                  }
                ]
              ],
              sourceType: 'unambiguous',
              cacheDirectory: true,
              babelrc: false,
              customize: '/Users/vvey/Desktop/gant/ui-framework/node_modules/babel-preset-umi/lib/webpack-overrides.js'
            }
          },
          /* config.module.rule('ts').use('ts-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/ts-loader/index.js',
            options: {
              configFile: '/Users/vvey/Desktop/gant/ui-framework/tsconfig.json',
              transpileOnly: true,
              errorFormatter(error, colors) {
                const messageColor = error.severity === 'warning' ? colors.bold.yellow : colors.bold.red;
                return colors.grey('[tsl] ') + messageColor(error.severity.toUpperCase()) + (error.file === '' ? '' : messageColor(' in ') + colors.bold.cyan(`${(0, _path().relative)(cwd, (0, _path().join)(error.context, error.file))}(${error.line},${error.character})`)) + _os().EOL + messageColor(`      TS${error.code}: ${error.content}`);
              }
            }
          }
        ]
      },
      /* config.module.rule('graphql') */
      {
        test: /\.(graphql|gql)$/,
        exclude: [
          /node_modules/
        ],
        use: [
          /* config.module.rule('graphql').use('graphql-tag-loader') */
          {
            loader: 'graphql-tag/loader'
          }
        ]
      },
      /* config.module.rule('cssModulesExcludes_0') */
      {
        test: filePath => {
          if (exclude instanceof RegExp) {
            return exclude.test(filePath);
          } else {
            return filePath.indexOf(exclude) > -1;
          }
        },
        use: [
          /* config.module.rule('cssModulesExcludes_0').use('extract-css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/mini-css-extract-plugin/dist/loader.js',
            options: {
              publicPath: undefined,
              hmr: false
            }
          },
          /* config.module.rule('cssModulesExcludes_0').use('css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/css-loader-1/index.js',
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: true,
              getLocalIdent: (context, localIdentName, localName) => {
                    if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('ant.design.pro.less') || context.resourcePath.includes('global.less')) {
                      return localName;
                    }
              
                    const match = context.resourcePath.match(/src(.*)/);
              
                    if (match && match[1]) {
                      const antdProPath = match[1].replace('.less', '');
                      const arr = (0, _slash.default)(antdProPath).split('/').map(a => a.replace(/([A-Z])/g, '-$1')).map(a => a.toLowerCase());
                      return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
                    }
              
                    return localName;
                  }
            }
          },
          /* config.module.rule('cssModulesExcludes_0').use('postcss-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/postcss-loader/src/index.js',
            options: {
              ident: 'postcss',
              plugins: () => [require('postcss-flexbugs-fixes'), // eslint-disable-line
              (0, _autoprefixer().default)(_objectSpread({
                overrideBrowserslist: opts.browserslist || DEFAULT_BROWSERS,
                flexbox: 'no-2009'
              }, opts.autoprefixer || {})), ...(opts.extraPostCSSPlugins ? opts.extraPostCSSPlugins : []), ...(isDev || process.env.CSS_COMPRESS === 'none' || process.env.COMPRESS === 'none' || process.env.NO_COMPRESS ? [] : [require('cssnano')({
                preset: ['default', opts.cssnano || {
                  mergeRules: false,
                  // ref: https://github.com/umijs/umi/issues/955
                  normalizeUrl: false
                }]
              })])]
            }
          }
        ]
      },
      /* config.module.rule('cssModulesExcludes_1') */
      {
        test: filePath => {
          if (exclude instanceof RegExp) {
            return exclude.test(filePath);
          } else {
            return filePath.indexOf(exclude) > -1;
          }
        },
        use: [
          /* config.module.rule('cssModulesExcludes_1').use('extract-css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/mini-css-extract-plugin/dist/loader.js',
            options: {
              publicPath: undefined,
              hmr: false
            }
          },
          /* config.module.rule('cssModulesExcludes_1').use('css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/css-loader-1/index.js',
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: true,
              getLocalIdent: (context, localIdentName, localName) => {
                    if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('ant.design.pro.less') || context.resourcePath.includes('global.less')) {
                      return localName;
                    }
              
                    const match = context.resourcePath.match(/src(.*)/);
              
                    if (match && match[1]) {
                      const antdProPath = match[1].replace('.less', '');
                      const arr = (0, _slash.default)(antdProPath).split('/').map(a => a.replace(/([A-Z])/g, '-$1')).map(a => a.toLowerCase());
                      return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
                    }
              
                    return localName;
                  }
            }
          },
          /* config.module.rule('cssModulesExcludes_1').use('postcss-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/postcss-loader/src/index.js',
            options: {
              ident: 'postcss',
              plugins: () => [require('postcss-flexbugs-fixes'), // eslint-disable-line
              (0, _autoprefixer().default)(_objectSpread({
                overrideBrowserslist: opts.browserslist || DEFAULT_BROWSERS,
                flexbox: 'no-2009'
              }, opts.autoprefixer || {})), ...(opts.extraPostCSSPlugins ? opts.extraPostCSSPlugins : []), ...(isDev || process.env.CSS_COMPRESS === 'none' || process.env.COMPRESS === 'none' || process.env.NO_COMPRESS ? [] : [require('cssnano')({
                preset: ['default', opts.cssnano || {
                  mergeRules: false,
                  // ref: https://github.com/umijs/umi/issues/955
                  normalizeUrl: false
                }]
              })])]
            }
          }
        ]
      },
      /* config.module.rule('cssModulesExcludes_2') */
      {
        test: filePath => {
          if (exclude instanceof RegExp) {
            return exclude.test(filePath);
          } else {
            return filePath.indexOf(exclude) > -1;
          }
        },
        use: [
          /* config.module.rule('cssModulesExcludes_2').use('extract-css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/mini-css-extract-plugin/dist/loader.js',
            options: {
              publicPath: undefined,
              hmr: false
            }
          },
          /* config.module.rule('cssModulesExcludes_2').use('css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/css-loader-1/index.js',
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: true,
              getLocalIdent: (context, localIdentName, localName) => {
                    if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('ant.design.pro.less') || context.resourcePath.includes('global.less')) {
                      return localName;
                    }
              
                    const match = context.resourcePath.match(/src(.*)/);
              
                    if (match && match[1]) {
                      const antdProPath = match[1].replace('.less', '');
                      const arr = (0, _slash.default)(antdProPath).split('/').map(a => a.replace(/([A-Z])/g, '-$1')).map(a => a.toLowerCase());
                      return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
                    }
              
                    return localName;
                  }
            }
          },
          /* config.module.rule('cssModulesExcludes_2').use('postcss-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/postcss-loader/src/index.js',
            options: {
              ident: 'postcss',
              plugins: () => [require('postcss-flexbugs-fixes'), // eslint-disable-line
              (0, _autoprefixer().default)(_objectSpread({
                overrideBrowserslist: opts.browserslist || DEFAULT_BROWSERS,
                flexbox: 'no-2009'
              }, opts.autoprefixer || {})), ...(opts.extraPostCSSPlugins ? opts.extraPostCSSPlugins : []), ...(isDev || process.env.CSS_COMPRESS === 'none' || process.env.COMPRESS === 'none' || process.env.NO_COMPRESS ? [] : [require('cssnano')({
                preset: ['default', opts.cssnano || {
                  mergeRules: false,
                  // ref: https://github.com/umijs/umi/issues/955
                  normalizeUrl: false
                }]
              })])]
            }
          },
          /* config.module.rule('cssModulesExcludes_2').use('less-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/less-loader/dist/cjs.js',
            options: {
              modifyVars: {
                'primary-color': '#1890FF'
              },
              javascriptEnabled: true
            }
          }
        ]
      },
      /* config.module.rule('cssModulesExcludes_3') */
      {
        test: filePath => {
          if (exclude instanceof RegExp) {
            return exclude.test(filePath);
          } else {
            return filePath.indexOf(exclude) > -1;
          }
        },
        use: [
          /* config.module.rule('cssModulesExcludes_3').use('extract-css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/mini-css-extract-plugin/dist/loader.js',
            options: {
              publicPath: undefined,
              hmr: false
            }
          },
          /* config.module.rule('cssModulesExcludes_3').use('css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/css-loader-1/index.js',
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: true,
              getLocalIdent: (context, localIdentName, localName) => {
                    if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('ant.design.pro.less') || context.resourcePath.includes('global.less')) {
                      return localName;
                    }
              
                    const match = context.resourcePath.match(/src(.*)/);
              
                    if (match && match[1]) {
                      const antdProPath = match[1].replace('.less', '');
                      const arr = (0, _slash.default)(antdProPath).split('/').map(a => a.replace(/([A-Z])/g, '-$1')).map(a => a.toLowerCase());
                      return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
                    }
              
                    return localName;
                  }
            }
          },
          /* config.module.rule('cssModulesExcludes_3').use('postcss-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/postcss-loader/src/index.js',
            options: {
              ident: 'postcss',
              plugins: () => [require('postcss-flexbugs-fixes'), // eslint-disable-line
              (0, _autoprefixer().default)(_objectSpread({
                overrideBrowserslist: opts.browserslist || DEFAULT_BROWSERS,
                flexbox: 'no-2009'
              }, opts.autoprefixer || {})), ...(opts.extraPostCSSPlugins ? opts.extraPostCSSPlugins : []), ...(isDev || process.env.CSS_COMPRESS === 'none' || process.env.COMPRESS === 'none' || process.env.NO_COMPRESS ? [] : [require('cssnano')({
                preset: ['default', opts.cssnano || {
                  mergeRules: false,
                  // ref: https://github.com/umijs/umi/issues/955
                  normalizeUrl: false
                }]
              })])]
            }
          }
        ]
      },
      /* config.module.rule('css') */
      {
        test: /\.css$/,
        exclude: [
          function () { /* omitted long function */ }
        ],
        use: [
          /* config.module.rule('css').use('extract-css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/mini-css-extract-plugin/dist/loader.js',
            options: {
              publicPath: undefined,
              hmr: false
            }
          },
          /* config.module.rule('css').use('css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/css-loader-1/index.js',
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: true,
              getLocalIdent: (context, localIdentName, localName) => {
                    if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('ant.design.pro.less') || context.resourcePath.includes('global.less')) {
                      return localName;
                    }
              
                    const match = context.resourcePath.match(/src(.*)/);
              
                    if (match && match[1]) {
                      const antdProPath = match[1].replace('.less', '');
                      const arr = (0, _slash.default)(antdProPath).split('/').map(a => a.replace(/([A-Z])/g, '-$1')).map(a => a.toLowerCase());
                      return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
                    }
              
                    return localName;
                  },
              localIdentName: '[local]___[hash:base64:5]'
            }
          },
          /* config.module.rule('css').use('postcss-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/postcss-loader/src/index.js',
            options: {
              ident: 'postcss',
              plugins: () => [require('postcss-flexbugs-fixes'), // eslint-disable-line
              (0, _autoprefixer().default)(_objectSpread({
                overrideBrowserslist: opts.browserslist || DEFAULT_BROWSERS,
                flexbox: 'no-2009'
              }, opts.autoprefixer || {})), ...(opts.extraPostCSSPlugins ? opts.extraPostCSSPlugins : []), ...(isDev || process.env.CSS_COMPRESS === 'none' || process.env.COMPRESS === 'none' || process.env.NO_COMPRESS ? [] : [require('cssnano')({
                preset: ['default', opts.cssnano || {
                  mergeRules: false,
                  // ref: https://github.com/umijs/umi/issues/955
                  normalizeUrl: false
                }]
              })])]
            }
          }
        ]
      },
      /* config.module.rule('css-in-node_modules') */
      {
        test: /\.css$/,
        include: [
          /node_modules/
        ],
        use: [
          /* config.module.rule('css-in-node_modules').use('extract-css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/mini-css-extract-plugin/dist/loader.js',
            options: {
              publicPath: undefined,
              hmr: false
            }
          },
          /* config.module.rule('css-in-node_modules').use('css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/css-loader-1/index.js',
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: true,
              getLocalIdent: (context, localIdentName, localName) => {
                    if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('ant.design.pro.less') || context.resourcePath.includes('global.less')) {
                      return localName;
                    }
              
                    const match = context.resourcePath.match(/src(.*)/);
              
                    if (match && match[1]) {
                      const antdProPath = match[1].replace('.less', '');
                      const arr = (0, _slash.default)(antdProPath).split('/').map(a => a.replace(/([A-Z])/g, '-$1')).map(a => a.toLowerCase());
                      return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
                    }
              
                    return localName;
                  }
            }
          },
          /* config.module.rule('css-in-node_modules').use('postcss-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/postcss-loader/src/index.js',
            options: {
              ident: 'postcss',
              plugins: () => [require('postcss-flexbugs-fixes'), // eslint-disable-line
              (0, _autoprefixer().default)(_objectSpread({
                overrideBrowserslist: opts.browserslist || DEFAULT_BROWSERS,
                flexbox: 'no-2009'
              }, opts.autoprefixer || {})), ...(opts.extraPostCSSPlugins ? opts.extraPostCSSPlugins : []), ...(isDev || process.env.CSS_COMPRESS === 'none' || process.env.COMPRESS === 'none' || process.env.NO_COMPRESS ? [] : [require('cssnano')({
                preset: ['default', opts.cssnano || {
                  mergeRules: false,
                  // ref: https://github.com/umijs/umi/issues/955
                  normalizeUrl: false
                }]
              })])]
            }
          }
        ]
      },
      /* config.module.rule('less') */
      {
        test: /\.less$/,
        exclude: [
          function () { /* omitted long function */ }
        ],
        use: [
          /* config.module.rule('less').use('extract-css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/mini-css-extract-plugin/dist/loader.js',
            options: {
              publicPath: undefined,
              hmr: false
            }
          },
          /* config.module.rule('less').use('css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/css-loader-1/index.js',
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: true,
              getLocalIdent: (context, localIdentName, localName) => {
                    if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('ant.design.pro.less') || context.resourcePath.includes('global.less')) {
                      return localName;
                    }
              
                    const match = context.resourcePath.match(/src(.*)/);
              
                    if (match && match[1]) {
                      const antdProPath = match[1].replace('.less', '');
                      const arr = (0, _slash.default)(antdProPath).split('/').map(a => a.replace(/([A-Z])/g, '-$1')).map(a => a.toLowerCase());
                      return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
                    }
              
                    return localName;
                  },
              localIdentName: '[local]___[hash:base64:5]'
            }
          },
          /* config.module.rule('less').use('postcss-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/postcss-loader/src/index.js',
            options: {
              ident: 'postcss',
              plugins: () => [require('postcss-flexbugs-fixes'), // eslint-disable-line
              (0, _autoprefixer().default)(_objectSpread({
                overrideBrowserslist: opts.browserslist || DEFAULT_BROWSERS,
                flexbox: 'no-2009'
              }, opts.autoprefixer || {})), ...(opts.extraPostCSSPlugins ? opts.extraPostCSSPlugins : []), ...(isDev || process.env.CSS_COMPRESS === 'none' || process.env.COMPRESS === 'none' || process.env.NO_COMPRESS ? [] : [require('cssnano')({
                preset: ['default', opts.cssnano || {
                  mergeRules: false,
                  // ref: https://github.com/umijs/umi/issues/955
                  normalizeUrl: false
                }]
              })])]
            }
          },
          /* config.module.rule('less').use('less-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/less-loader/dist/cjs.js',
            options: {
              modifyVars: {
                'primary-color': '#1890FF'
              },
              javascriptEnabled: true
            }
          }
        ]
      },
      /* config.module.rule('less-in-node_modules') */
      {
        test: /\.less$/,
        include: [
          /node_modules/
        ],
        use: [
          /* config.module.rule('less-in-node_modules').use('extract-css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/mini-css-extract-plugin/dist/loader.js',
            options: {
              publicPath: undefined,
              hmr: false
            }
          },
          /* config.module.rule('less-in-node_modules').use('css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/css-loader-1/index.js',
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: true,
              getLocalIdent: (context, localIdentName, localName) => {
                    if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('ant.design.pro.less') || context.resourcePath.includes('global.less')) {
                      return localName;
                    }
              
                    const match = context.resourcePath.match(/src(.*)/);
              
                    if (match && match[1]) {
                      const antdProPath = match[1].replace('.less', '');
                      const arr = (0, _slash.default)(antdProPath).split('/').map(a => a.replace(/([A-Z])/g, '-$1')).map(a => a.toLowerCase());
                      return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
                    }
              
                    return localName;
                  }
            }
          },
          /* config.module.rule('less-in-node_modules').use('postcss-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/postcss-loader/src/index.js',
            options: {
              ident: 'postcss',
              plugins: () => [require('postcss-flexbugs-fixes'), // eslint-disable-line
              (0, _autoprefixer().default)(_objectSpread({
                overrideBrowserslist: opts.browserslist || DEFAULT_BROWSERS,
                flexbox: 'no-2009'
              }, opts.autoprefixer || {})), ...(opts.extraPostCSSPlugins ? opts.extraPostCSSPlugins : []), ...(isDev || process.env.CSS_COMPRESS === 'none' || process.env.COMPRESS === 'none' || process.env.NO_COMPRESS ? [] : [require('cssnano')({
                preset: ['default', opts.cssnano || {
                  mergeRules: false,
                  // ref: https://github.com/umijs/umi/issues/955
                  normalizeUrl: false
                }]
              })])]
            }
          },
          /* config.module.rule('less-in-node_modules').use('less-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/less-loader/dist/cjs.js',
            options: {
              modifyVars: {
                'primary-color': '#1890FF'
              },
              javascriptEnabled: true
            }
          }
        ]
      },
      /* config.module.rule('sass') */
      {
        test: /\.(sass|scss)$/,
        exclude: [
          function () { /* omitted long function */ }
        ],
        use: [
          /* config.module.rule('sass').use('extract-css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/mini-css-extract-plugin/dist/loader.js',
            options: {
              publicPath: undefined,
              hmr: false
            }
          },
          /* config.module.rule('sass').use('css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/css-loader-1/index.js',
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: true,
              getLocalIdent: (context, localIdentName, localName) => {
                    if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('ant.design.pro.less') || context.resourcePath.includes('global.less')) {
                      return localName;
                    }
              
                    const match = context.resourcePath.match(/src(.*)/);
              
                    if (match && match[1]) {
                      const antdProPath = match[1].replace('.less', '');
                      const arr = (0, _slash.default)(antdProPath).split('/').map(a => a.replace(/([A-Z])/g, '-$1')).map(a => a.toLowerCase());
                      return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
                    }
              
                    return localName;
                  },
              localIdentName: '[local]___[hash:base64:5]'
            }
          },
          /* config.module.rule('sass').use('postcss-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/postcss-loader/src/index.js',
            options: {
              ident: 'postcss',
              plugins: () => [require('postcss-flexbugs-fixes'), // eslint-disable-line
              (0, _autoprefixer().default)(_objectSpread({
                overrideBrowserslist: opts.browserslist || DEFAULT_BROWSERS,
                flexbox: 'no-2009'
              }, opts.autoprefixer || {})), ...(opts.extraPostCSSPlugins ? opts.extraPostCSSPlugins : []), ...(isDev || process.env.CSS_COMPRESS === 'none' || process.env.COMPRESS === 'none' || process.env.NO_COMPRESS ? [] : [require('cssnano')({
                preset: ['default', opts.cssnano || {
                  mergeRules: false,
                  // ref: https://github.com/umijs/umi/issues/955
                  normalizeUrl: false
                }]
              })])]
            }
          }
        ]
      },
      /* config.module.rule('sass-in-node_modules') */
      {
        test: /\.(sass|scss)$/,
        include: [
          /node_modules/
        ],
        use: [
          /* config.module.rule('sass-in-node_modules').use('extract-css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/mini-css-extract-plugin/dist/loader.js',
            options: {
              publicPath: undefined,
              hmr: false
            }
          },
          /* config.module.rule('sass-in-node_modules').use('css-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/css-loader-1/index.js',
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: true,
              getLocalIdent: (context, localIdentName, localName) => {
                    if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('ant.design.pro.less') || context.resourcePath.includes('global.less')) {
                      return localName;
                    }
              
                    const match = context.resourcePath.match(/src(.*)/);
              
                    if (match && match[1]) {
                      const antdProPath = match[1].replace('.less', '');
                      const arr = (0, _slash.default)(antdProPath).split('/').map(a => a.replace(/([A-Z])/g, '-$1')).map(a => a.toLowerCase());
                      return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
                    }
              
                    return localName;
                  }
            }
          },
          /* config.module.rule('sass-in-node_modules').use('postcss-loader') */
          {
            loader: '/Users/vvey/Desktop/gant/ui-framework/node_modules/postcss-loader/src/index.js',
            options: {
              ident: 'postcss',
              plugins: () => [require('postcss-flexbugs-fixes'), // eslint-disable-line
              (0, _autoprefixer().default)(_objectSpread({
                overrideBrowserslist: opts.browserslist || DEFAULT_BROWSERS,
                flexbox: 'no-2009'
              }, opts.autoprefixer || {})), ...(opts.extraPostCSSPlugins ? opts.extraPostCSSPlugins : []), ...(isDev || process.env.CSS_COMPRESS === 'none' || process.env.COMPRESS === 'none' || process.env.NO_COMPRESS ? [] : [require('cssnano')({
                preset: ['default', opts.cssnano || {
                  mergeRules: false,
                  // ref: https://github.com/umijs/umi/issues/955
                  normalizeUrl: false
                }]
              })])]
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: module => {
                    const packageName = getModulePackageName(module);
          
                    if (packageName) {
                      return ['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0;
                    }
          
                    return false;
                  },
          name(module) {
                    const packageName = getModulePackageName(module);
          
                    if (packageName) {
                      if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
                        return 'viz'; // visualization package
                      }
                    }
          
                    return 'misc';
                  }
        },
        'default': {
          automaticNamePrefix: '',
          reuseExistingChunk: true,
          minChunks: 2,
          priority: -20
        }
      },
      hidePathInfo: true,
      minChunks: 1,
      maxAsyncRequests: 5,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 109
    },
    runtimeChunk: false,
    noEmitOnErrors: true,
    minimizer: [
      /* config.optimization.minimizer('uglifyjs') */
      new UglifyJsPlugin(
        {
          uglifyOptions: {
            compress: {
              drop_console: true,
              pure_funcs: [
                'console.error'
              ]
            }
          },
          sourceMap: false,
          cache: true,
          parallel: true
        }
      )
    ]
  },
  plugins: [
    /* config.plugin('extract-css') */
    new MiniCssExtractPlugin(
      {
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].chunk.css'
      }
    ),
    /* config.plugin('define') */
    new DefinePlugin(
      {
        'process.env': {
          NODE_ENV: '"production"'
        },
        'process.env.BASE_URL': '"/"',
        __IS_BROWSER: 'true',
        __UMI_BIGFISH_COMPAT: undefined,
        __UMI_HTML_SUFFIX: 'false',
        BASE_CONFIG: '{"favicon":"assets/images/logo.png","logoImage":"assets/images/logo.png","logoImageWhite":"assets/images/logo_white.png","logoName":"甘棠软件","appTitle":"甘棠软件前端开发框架","slogan":"本框架基于React技术栈,采用了Umi、Antd、Gantd等框架或UI库来封装构建，支持产品、项目分模块开发。","logoNameEn":"Gant Software","appTitleEn":"Gant Software UI-Framework","sloganEn":"This framework is based on the React technology stack, which uses Umi, Antd, Gantd and other frameworks or UI libraries to package and build, and supports product and project sub-module development","copyright":"©2019 Gantsotware All Right Reserved"}',
        LOGIN_CONFIG: '{"loginAlign":"left","loginFormStyle":null,"loginFormShowLogo":false,"loginFormShowName":true,"headerTheme":"dark","backgroundColor":"#fff","backgroundImage":"assets/images/login-background.png","backgroundBlur":"","customHeader":null,"customFooter":null,"langulageIconColor":"#fff","copyrightAlign":"center"}',
        MAIN_CONFIG: '{"primaryColor":"#1890FF","siderMenuBackground":"#fff","siderMenuTextColor":"#000","siderMenuLogoBackground":"#fff","siderMenuLogoColor":"#000","globalHeaderBackground":"#fff","globalHeaderTextColor":"rgba(0,0,0,0.8)","theme":"classic","themeType":"light","navTheme":"light","layout":"sidemenu","contentWidth":"Fluid","fixedHeader":true,"autoHideHeader":false,"fixSiderbar":true,"showTaskBar":false,"showBreadcrumb":true,"headerHeight":40,"slideWidth":220,"slideCollapsedWidth":40,"searchTableFilterDisplay":"drawer","searchTableCellResizable":true,"showNavBackgroundImage":false,"navBackgroundImages":[],"navBackgroundOpacity":1,"showGlobalSearch":true,"globalSearchPath":"/framework/globalsearch"}',
        order: '1',
        routes: '[{"path":"/","exact":true,"redirect":"/home"},{"path":"/home","exact":true,"component":"./common/dashboard"},{"path":"/common","icon":"icon-jichushuju","routes":[{"path":"/common/user","name":"员工详情","nameEn":"Employee","routes":[{"path":"/common/user/:id?","icon":"icon-gongyingshang","name":"员工详情","nameEn":"Employee","hideInMenu":true,"component":"./common/user"}]}]}]',
        DATA_ACL_CONFIG: '{"registerTarget":[{"code":"FW_ORGANIZATION_TARGET","label":"指定组织","view":"@/component/specific/userselector"},{"code":"FW_USER_TARGET","label":"指定用户","view":"@/component/specific/userselector"},{"code":"FW_ROLE_TARGET","label":"指定角色","view":"@/component/specific/userselector"},{"code":"FW_GROUP_TARGET","label":"指定用户组","view":"@/component/specific/userselector"},{"code":"FW_CREATOR_TARGET","label":"记录创建人","view":"@/component/specific/userselector"},{"code":"FW_ORGANIZATION_TARGET","label":"责任人","view":"@/component/specific/userselector"},{"code":"FW_USER_TARGET","label":"责任人上级","view":"@/component/specific/userselector"},{"code":"FW_ROLE_TARGET","label":"公司总经理","view":"@/component/specific/userselector"},{"code":"FW_GROUP_TARGET","label":"公司HR主管","view":"@/component/specific/userselector"},{"code":"FW_CREATOR_TARGET","label":"直属部门主管","view":"@/component/specific/userselector"},{"code":"FW_USER_TARGET","label":"责任部门","view":"@/component/specific/userselector"},{"code":"FW_ROLE_TARGET","label":"责任部门上级","view":"@/component/specific/userselector"},{"code":"FW_GROUP_TARGET","label":"责任部门下级","view":"@/component/specific/userselector"},{"code":"FW_CREATOR_TARGET","label":"查看部门","view":"@/component/specific/userselector"},{"code":"FW_GROUP_TARGET","label":"查看部门上级","view":"@/component/specific/userselector"},{"code":"FW_CREATOR_TARGET","label":"查看部门下级","view":"@/component/specific/userselector"}],"registerFilter":[{"code":"FW_ALL_DATA_FILTER","label":"全部数据","view":""},{"code":"DEMO_01_FILTER","label":"记录创建人类型","view":""},{"code":"TEST_02_FILTER","label":"测试过滤器","view":""}],"registerAction":[{"code":"READ","label":"读"},{"code":"WRITE","label":"写"},{"code":"DELETE","label":"删除"},{"code":"AUTHORIZE","label":"授权"},{"code":"ALLOW","label":"允许"},{"code":"DENY","label":"拒绝"},{"code":"UNKNOWN","label":"未知"},{"code":"DA01","label":"指定责任人"},{"code":"DA02","label":"删除记录"},{"code":"DA03","label":"新增记录"},{"code":"DA04","label":"查看内容"},{"code":"DA05","label":"编辑内容"}],"registerDomain":[{"code":"DEMO_00_DOMAIN","label":"数据级权限DEMO_0","icon":""},{"code":"DEMO_01_DOMAIN","label":"数据级权限DEMO_1","icon":""},{"code":"DEMO_02_DOMAIN","label":"数据级权限DEMO_2","icon":""},{"code":"test02DomainAclHandle","label":"测试业务对象02","icon":"icon-houtairenwuguanli"}]}',
        dirName: '"sysmgmt"',
        proxyTarget: '"http://v5.ip2fw.gantcloud.com"',
        ROUTE_MAP: '{"#gantang.sysmgmt.workflow.process.controller.CurrentProcessController":"/sysmgmt/accountcenter/currentprocess","#gantang.sysmgmt.workflow.process.controller.CurrentProcessController?{countKey:\'FW_CURRENT_TASK_COUNT_SUMMARY\'}":"/sysmgmt/accountcenter/currentprocess","#gantang.sysmgmt.workflow.process.controller.HistoryProcessController":"/sysmgmt/accountcenter/historyprocess","#gantang.sysmgmt.workflow.process.controller.MyStartProcessController":"/sysmgmt/accountcenter/mystartprocess","#gantang.sysmgmt.account.delegation.controller.AcctUserDelegationController":"/sysmgmt/accountcenter/userdelegation","#gantang.sysmgmt.notification.controller.NotificationController":"/sysmgmt/accountcenter/nitificationmanage","#gantang.sysmgmt.workflow.template.controller.WorkflowTemplateController":"/sysmgmt/workflow/workflowtemplatemanage","#gantang.sysmgmt.workflow.process.controller.ProcessManagerController":"/sysmgmt/workflow/processemanage","#gantang.sysmgmt.workflow.designer.G6EditorController":"/sysmgmt/workflow/g6editormanage","#gantang.sysmgmt.demo.ajaxTip.controller.AjaxTipDemoController":"/sysmgmt/demo/ajax","#gantang.sysmgmt.demo.visualJson.controller.VisualJsonController":"/sysmgmt/demo/visualjson","#gantang.sysmgmt.demo.featureFamily.controller.featureFamilyController":"/sysmgmt/demo/featurefamily","#gantang.sysmgmt.gmeta.fieldMgmt.FieldMgmtController":"/sysmgmt/demo/fieldmgmt","#gantang.sysmgmt.gmeta.entryprop.controller.EntryPropController":"/sysmgmt/demo/entryprop","#gantang.sysmgmt.gmeta.uiMgmt.controller.UiMgmtController":"/sysmgmt/demo/uimgmt","#gantang.sysmgmt.gmeta.functionMgmt.FunctionMgmtController":"/sysmgmt/demo/functionmgmt","#gantang.sysmgmt.queryBuilder.controller.QueryBuilderController":"/sysmgmt/demo/customize","#gantang.sysmgmt.measureunit.controller.MeasureUnitController":"/sysmgmt/demo/measureunit","#gantang.sysmgmt.gmetatest.controller.GmetaTestController":"/sysmgmt/demo/gmetatest","#gantang.sysmgmt.portal.PortalController":"/sysmgmt/demo/protal","#gantang.sysmgmt.demo.measurementinput.controller.MeasurementInputDemoController":"/sysmgmt/demo/measurement","#gantang.sysmgmt.demo.uploadfilepanel.controller.UploadFilePanelController":"/sysmgmt/demo/upload","#gantang.custom.dataacl.controller.DataAclDemo00Controller":"/custom/demo/dataacl00","#gantang.custom.dataacl.controller.DataAclDemo01Controller":"/custom/demo/dataacl01","#gantang.custom.dataacl.controller.DataAclTreeController":"/custom/demo/dataacl02","##gantang.sysmgmt.gmeta.entryprop.controller.EntryPropController":"/sysmgmt/demo/entryprop","#gantang.sysmgmt.commonFile.controller.commonFileController":"/sysmgmt/demo/commonfilemanage","#gantang.sysmgmt.gmeta.menuBuilder.controller.GmetaMenuController?{entryName:\'entry_1560480023197128\'}":"/sysmgmt/demo/gmetamenu1","#gantang.sysmgmt.gmeta.menuBuilder.controller.GmetaMenuController?{entryName:\'entry_1561443263337973\'}":"/sysmgmt/demo/gmetamenu2","#gantang.sysmgmt.demo.pictureupload.controller.PictureUploadDemoController":"/sysmgmt/demo/123","#gantang.sysmgmt.mail.controller.MailTemplateController":"/sysmgmt/othermodulemanage/mailtemplate","#gantang.sysmgmt.helpdoc.globalhelpdoc.HelpDocController":"/sysmgmt/help/globalhelpdoc","#gantang.sysmgmt.helpdoc.helpdocmgt.HelpDocController":"/sysmgmt/help/helpdoc","#gantang.sysmgmt.task.controller.TaskController":"/sysmgmt/servertaskmanage/taskmanage","#gantang.sysmgmt.task.controller.AsynTaskLogController":"/sysmgmt/servertaskmanage/asynctasklogmanage","#gantang.sysmgmt.integration.controller.EndpointController":"/sysmgmt/sysintegramanage/endpointmanage","#gantang.sysmgmt.integration.controller.ServerLogController":"/sysmgmt/sysintegramanage/serverlogmanage","#gantang.sysmgmt.integration.controller.ClientLogController":"/sysmgmt/sysintegramanage/clientlogmanage","#gantang.sysmgmt.comment.controller.CommentController":"/sysmgmt/servertaskmanage/taskmanage","#gantang.sysmgmt.comment.controller.CommentPanelController":"/sysmgmt/demo/commentmanagepanel","#gantang.sysmgmt.upload.controller.UploadController":"/sysmgmt/upload/upload","#gantang.sysmgmt.account.importdata.controller.ImportOrgController":"/sysmgmt/import/importorg","#gantang.sysmgmt.account.importdata.controller.ImportUserController":"/sysmgmt/import/importuser","#gantang.sysmgmt.gmetacost.GmetaCostModelController":"/sysmgmt/gmetacost"}',
        IP2_ROUTE_MAP: '{"#gantang.sysmgmt.mail.controller.MailTemplateController":"/sysmgmt/othermodulemanage/mailtemplate","#gantang.sysmgmt.workflow.template.controller.WorkflowTemplateController":"/sysmgmt/workflow/workflowtemplatemanage","#gantang.sysmgmt.workflow.process.controller.ProcessManagerController":"/sysmgmt/workflow/processemanage","#gantang.sysmgmt.workflow.designer.G6EditorController":"/sysmgmt/workflow/g6editormanage"}',
        ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: '""'
      }
    ),
    /* config.plugin('progress') */
    new WebpackBarPlugin(
      {
        color: 'green',
        reporters: [
          'fancy'
        ]
      }
    ),
    /* config.plugin('ignore-moment-locale') */
    new IgnorePlugin(
      /^\.\/locale$/,
      /moment$/
    ),
    /* config.plugin('copy-public') */
    new CopyPlugin(
      [
        {
          from: '/Users/vvey/Desktop/gant/ui-framework/public',
          to: '/Users/vvey/Desktop/gant/ui-framework/dist',
          toType: 'dir'
        }
      ]
    ),
    /* config.plugin('filter-css-conflicting-warnings') */
    new FilterCSSConflictingWarning(),
    /* config.plugin('friendly-errors') */
    new FriendlyErrorsWebpackPlugin(
      {
        clearConsole: false
      }
    ),
    /* config.plugin('manifest') */
    new ManifestPlugin(
      {
        fileName: 'asset-manifest.json',
        basePath: '/'
      }
    ),
    /* config.plugin('hash-module-ids') */
    new HashedModuleIdsPlugin()
  ],
  performance: {
    hints: false
  },
  entry: {
    umi: [
      '/Users/vvey/Desktop/gant/ui-framework/src/pages/.umi-production/umi.js'
    ]
  }
}