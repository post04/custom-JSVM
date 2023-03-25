module.exports = (path, node, index, handler) => {
    return handler(path, node.expression, index, handler)
}