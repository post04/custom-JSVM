const { readFileSync, writeFileSync } = require('fs');
const src = readFileSync('./samples/3.js', 'utf-8');

// ! babel
const t = require('@babel/types');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
// ! babel

// ! opcodes
const { Opcodes } = require('../constants');
// ! opcodes

// ! handles
const handleVariableDeclarator = require('./handlers/variableDeclarator');
const handleCallExpression = require('./handlers/callExpression');
// ! handles

const AST = parser.parse(src, {});
let bytecode = [];
let order = [];

const handleStringLiterals = {
    StringLiteral(path) {
        if(path.parentPath.node.type != "VariableDeclarator") {
            var cache = path.node.value
            path.node.value = "BYTECODE_" + bytecode.length
            // path.replaceWith(t.stringLiteral("BYTECODE_" + bytecode.length))
            bytecode.push(...[Opcodes["PUSH"], cache])
        }
    }
}

const handleProgram = {
  Program(path) {
    let { node } = path;
    node.body.forEach((node) => {
      console.log(node.type);
      switch (node.type) {
        case 'VariableDeclaration':
          node.declarations.forEach((node) => {
            [o, bytes] = handleVariableDeclarator(path, node, bytecode.length);
            order.push(...o);
            bytecode.push(...bytes);
          });
          break;
        case 'ExpressionStatement':
          // ! validation
          if (node.expression.type != 'CallExpression') {
            console.log('unsupported expression:', node.expression.type);
            exit(999);
          }
          [o, bytes] = handleCallExpression(
            path,
            node.expression,
            bytecode.length
          );
          order.push(...o);
          bytecode.push(...bytes);
          break;
        default:
          console.log(node.type);
          break;
      }
    });
  },
};

traverse(AST, handleStringLiterals);
console.log("Done transforming string literals.")
traverse(AST, handleProgram);
console.log('Bytecode:', bytecode);
console.log('Order:', order);

// ! VM
const VirtualMachine = require('../vm');
// ! VM
const vm = new VirtualMachine(bytecode, [], order);
vm.debug = true;
vm.run();

// ! debug
writeFileSync(
  './debug_output/test.js',
  generate(AST, {
    comments: true,
    minified: false,
    concise: false,
  }).code
);
