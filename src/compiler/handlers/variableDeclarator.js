const t = require('@babel/types');

// ! opcodes
const {
  Opcodes
} = require('../../constants');
// ! opcodes

const callExpression = require('./callExpression');

module.exports =
  // path = VariableDeclaration path
  // node = VariableDeclarator node
  // index = current index in the byte code
  // returns the byte code for this operation and modifys existing uses of this variable
  (path, node, index, handler) => {
    let bytes = [];
    let order = [];

    // ! first we make sure it's something we can handle correctly
    // TODO: add support for everything else (including redirected definitions to other op codes)
    if (node.init?.type === 'CallExpression') {
      const [outOrder, outBytes] = callExpression(
        path.get('init'),
        node.init,
        index
      );
      bytes.push(...outBytes);
      order.push(...outOrder);
      console.log(node);
      console.log('unsupported init type:', node.init.type);
      exit(999);
    } else {
      bytes.push(Opcodes.PUSH);
      bytes.push(node.init?.value);
    }

    // ! now we need to replace all uses of this variable with an indicator that it's now on the stack at x position
    const binding = path.scope.getBinding(node.id.name);
    if (!binding) {
      console.log('No binding to ', JSON.stringify(node));
      exit(999);
    }
    const {
      referencePaths
    } = binding;
    for (let refPath of referencePaths) {
      refPath.replaceWith(t.stringLiteral('BYTECODE_' + index));
    }
    // ! return byte code :)
    return [order, bytes];
  };