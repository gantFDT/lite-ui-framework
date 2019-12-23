const fs = require('fs')
const path = require('path')


module.exports = (api, payload, { success }) => {
    const templatesPath = path.resolve(api.paths.cwd, 'src/templates')
    let templates = []
    try {
        templates = fs.readdirSync(templatesPath)
    }
    catch{
        fs.mkdirSync(templatesPath)
    }
    const templatesConfig = templates.map(pathName => {
        const snapshot = path.resolve(templatesPath, pathName, 'snapshot.png')
        let snapshotContent
        try {
            snapshotContent = fs.readFileSync(snapshot, 'base64')
        }
        catch{
            // catch error
        }
        return {
            path: pathName,
            snapshot: snapshotContent
        }
    })
    success(templatesConfig)
}