import MergeLessPlugin from 'antd-pro-merge-less';
import path from 'path';
import fs from 'fs';

// import ThemeColorReplacer from 'webpack-theme-color-replacer';

function getModulePackageName(module) {
  if (!module.context) return null;
  const nodeModulesPath = path.join(__dirname, '../node_modules/');

  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName = moduleDirName; // handle tree shaking

  if (packageName && packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)[1];
  }

  return packageName;
}

export default config => {
  config.optimization
    .runtimeChunk(false) // share the same chunks across different modules
    .splitChunks({
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
          },
        },
      },
    });

  config.merge({
    resolve: {
      mainFields: ['main', 'module']
    },
    module: {
      exprContextCritical: false
    },
    watchOptions: {
      ignored: [/node_modules/, /config\.js$/, /config\.json$/, 'pages/**/config.js', 'app.js']
    }
  })

  // console.log(config.get("resolve"))

};
