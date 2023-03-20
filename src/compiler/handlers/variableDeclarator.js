const t = require('@babel/types');

// ! opcodes
const {Opcodes} = require("../../constants")
// ! opcodes

module.exports = {
    // path = VariableDeclaration path
    // node = VariableDeclarator node
    // index = current index in the byte code
    // returns the byte code for this operation and modifys existing uses of this variable
    createBytecode(path, node, index) {
        // ! first we make sure it's something we can handle correctly
        // TODO: add support for everything else (including redirected definitions to other op codes)
        if(!node.init || (node.init.type != "StringLiteral" && node.init.type != "NumericLiteral")) {
            console.log("unsupported init type:", node.init.type)
            exit(999)
        }
        // ! now we need to use op code PUSH to the stack
        var byte = [Opcodes["PUSH"], node.init.value]
        // ! now we need to replace all uses of this variable with an indicator that it's now on the stack at x position
        const binding = path.scope.getBinding(node.id.name)
        if(!binding) {
            console.log("No binding to ", JSON.stringify(node))
            exit(999)
        }
        const {referencePaths} = binding
        for(let refPath of referencePaths) {
            refPath.replaceWith(t.stringLiteral("BYTECODE_" + index))
        }
        // ! return byte code :)
        return [[], byte]
    }
}