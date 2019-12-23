

exports.pathToArray = function pathToArray(path) {
    const arr = path.match(/\/\w+/g)
    return arr.reduce((result, p, index) => {
        const parent = result[index]
        if (p.startsWith(parent)) {
            result.push(p)
        } else {
            result.push((result[index]) + p)
        }
        return result
    }, ['/'])
}