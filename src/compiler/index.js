const { readFileSync, writeFileSync } = require('node:fs');

// ! babel
const t = require('@babel/types');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// ! opcodes
const { Opcodes } = require('../constants');
// ! opcodes

// ! handles
const handleVariableDeclarator = require('./handlers/variableDeclarator');
const handleCallExpression = require('./handlers/callExpression');
// ! handles

const handleProgram = (ast) => {
  let order = [];
  let bytecode = [];
  traverse(ast, {
    Program(path) {
      let { node } = path;
      node.body.forEach((node) => {
        console.log(node.type);
        switch (node.type) {
          case 'VariableDeclaration':
            node.declarations.forEach((node) => {
              [o, bytes] = handleVariableDeclarator(
                path,
                node,
                bytecode.length
              );
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
            console.log(node);
            throw new Error(`Unsupported AST node: ${node.type}`);
            break;
        }
      });
    },
  });
  return { order, bytecode };
};

const handleStringLiterals = (ast, bytecode) => {
  traverse(ast, {
    StringLiteral(path) {
      if (path.parentPath.node.type != 'VariableDeclarator') {
        var cache = path.node.value;
        path.node.value = 'BYTECODE_' + bytecode.length;
        // path.replaceWith(t.stringLiteral("BYTECODE_" + bytecode.length))
        bytecode.push(...[Opcodes['PUSH'], cache]);
      }
    },
  });
  return bytecode;
};

module.exports = class Compiler {
  constructor() {}

  compileFromString(src) {
    const AST = parser.parse(src, {});
    let { bytecode, order } = handleProgram(AST);
    bytecode = handleStringLiterals(AST, bytecode);
    return { bytecode, order };
  }
  compileFromFile(srcPath) {
    const src = readFileSync(srcPath, 'utf-8');
    return this.compileFromString(src);
  }

  writeDebugFile(output = './debug_output/test.js') {
    writeFileSync(
      output,
      generate(AST, {
        comments: true,
        minified: false,
        concise: false,
      }).code
    );
  }
};
