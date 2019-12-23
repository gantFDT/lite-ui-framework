

export default {
    entry: './plugins/ui.plugin/ui/index.js',
    umd: {
        globals: {
            react: 'window.React',
            antd: 'window.antd'
        },
        name: 'gant-ui',
        minFile: false,
        file: '../plugins/ui.plugin/ui.umd'
    }
}