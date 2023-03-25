module.exports = (path, node, index, handler) => {
    let bytes = []
    let order = []

    node.declarations.forEach(declarationNode => {
        const res = handler(path, declarationNode, index, handler)
        order.push(...res[0])
        bytes.push(...res[1])
    })

    return [order, bytes]
}