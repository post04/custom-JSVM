const {
  readFileSync,
  writeFileSync
} = require('node:fs');
// ! babel
const t = require('@babel/types');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const handleNode = require("./handlers")

const log = (...a) => {
  // if (!this.debug) return;
  console.log('[DEBUG | COMP]', ...a);
};

// ! opcodes
const {
  Opcodes
} = require('../constants');
// ! opcodes


const handleProgram = (ast) => {
  let order = [];
  let bytecode = [];
  traverse(ast, {
    Program(path) {
      let {
        node
      } = path;
      node.body.forEach((node) => {
        log(`Compiling ${node.type}...`)
        const [newOrder, newBytes] = handleNode(path, node, bytecode.length)
        log(`Done! Order: ${order}, Bytes: ${newBytes}`)
        order.push(...newOrder);
        bytecode.push(...newBytes);
      });
    },
  });
  console.log("order:", order, "bytes:", bytecode)
  return {
    order,
    bytecode
  };
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
  constructor() {
    this.log = log;
  }

  compileFromString(src) {
    const AST = parser.parse(src, {});
    let {
      bytecode,
      order
    } = handleProgram(AST);
    bytecode = handleStringLiterals(AST, bytecode);
    this.bytecode = bytecode;
    this.order = order;
    return {
      bytecode,
      order
    };
  }
  compileFromFile(srcPath) {
    const src = readFileSync(srcPath, 'utf-8');
    return this.compileFromString(src);
  }
  compileFromBase64(src) {
    const str = Buffer.from(src, 'base64').toString('utf-8');
    const p = JSON.parse(str);
    return {
      bytecode: p[0],
      order: p[1]
    };
  }
  base64() {
    if (!this.bytecode || !this.order)
      throw new Error('Compile some code first!');

    const str = JSON.stringify([this.bytecode, this.order]);
    return Buffer.from(str, 'utf-8').toString('base64');
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