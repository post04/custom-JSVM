const t = require('@babel/types');

// ! opcodes
const { Opcodes } = require('../../constants');
// ! opcodes

// function checkDefined(type, path, node) {
//     if(type == "MemberExpression") {
//         return !!path.scope.getBinding(node.callee.object.name)
//     }
//     if(type == "Identifier") {
//         return !!path.scope.getBinding(node.callee.name)
//     }
//     console.log("????????")
//     exit("999")
// }

module.exports =
  // path = ExpressionStatement path
  // node = CallExpression node
  // index = current index in the byte code
  // returns the byte code for this operation
  (path, node, index) => {
    var bytes = [];
    var order = [];

    if (node.callee.type == 'MemberExpression') {
      // TODO: support recursiveness? Could be really annoying cause of all the edge cases.
      if (node.callee.property.type != 'Identifier') {
        console.log('unsupported callee property:', node.callee.property.type);
        exit(999);
        return;
      }
      // TODO: check if it's a defined function or not, if it is, we need to point to push the vm object?
      // ! push the THIS object
      bytes.push(...[Opcodes['PUSH_THIS']]);
      order.push(index++);
      // ! push the object
      bytes.push(...[Opcodes['PUSH'], node.callee.object.name]);
      order.push(index++);
      order.push(index++);
      // ! push the MEMBER_EXPRESSION op code
      bytes.push(...[Opcodes['MEMBER_EXPRESSION']]);
      order.push(index++);
      // ! push the identifier
      bytes.push(...[Opcodes['PUSH'], node.callee.property.name]);
      order.push(index++);
      order.push(index++);
      // ! recap: this, object, member_expression, property
    }

    if (node.callee.type == 'Identifier') {
      // TODO: check if it's a defined function or not, if it is, we need to point to push the vm object?
      // ! push the THIS object
      bytes.push(...[Opcodes['PUSH_THIS']]);
      order.push(index++);
      // ! push the function identifier name
      bytes.push(...[Opcodes['PUSH'], node.callee.name]);
      order.push(index++);
      order.push(index++);
    }

    // ! push the MEMBER_EXPRESSION op code
    bytes.push(...[Opcodes['MEMBER_EXPRESSION']]);
    order.push(index++);

    // ! at this point, we assume the argument(s) supplied in the function are already in the byte code

    // ! we need to return the instruction to execute for the param
    // ! Push empty array (for args)
    bytes.push(Opcodes.PUSH_ARRAY);
    order.push(index++);
    node.arguments.forEach((arg) => {
      console.log(arg);
      const isBytecodeExpression =
        arg.type === 'StringLiteral' && arg.value.startsWith('BYTECODE_');

      if (isBytecodeExpression) {
        const bytecodePos = parseInt(arg.value.split('_')[1]);
        order.push(bytecodePos);
        order.push(order[order.length - 1] + 1);
      } else {
        bytes.push(Opcodes.PUSH);
        order.push(index++);
        bytes.push(arg.value);
        order.push(index++);
      }

      bytes.push(Opcodes.PUSH_TO_ARRAY);
      order.push(index++);
    });

    // ! now we tell it to run the function
    bytes.push(...[Opcodes['EXECUTE_FUNCTION']]);
    order.push(index++);
    return [order, bytes];
  };
