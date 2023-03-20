const {readFileSync, writeFileSync} = require("fs")
const src = readFileSync("./samples/3.js", "utf-8")

// ! babel
const t = require('@babel/types');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
// ! babel

// ! opcodes
const {Opcodes} = require("../constants")
// ! opcodes

// ! handles
const variableDeclarator = require("./handlers/variableDeclarator")
const callExpression = require("./handlers/callExpression")
// ! handles

const AST = parser.parse(src, {})
let bytecode = []
let order = []

const handleProgram = {
    Program(path) {
        let {node} = path
        node.body.forEach(node => {
            console.log(node.type)
            switch(node.type) {
                case "VariableDeclaration":
                    node.declarations.forEach(node => {
                        [o, bytes] = variableDeclarator.createBytecode(path, node, bytecode.length)
                        order.push(...o)
                        bytecode.push(...bytes)
                    })
                break;
                case "ExpressionStatement":
                    // ! validation
                    if(node.expression.type != "CallExpression") {
                        console.log("unsupported expression:", node.expression.type)
                        exit(999)
                    }
                    [o, bytes] = callExpression.createBytecode(path, node.expression, bytecode.length)
                    order.push(...o)
                    bytecode.push(...bytes)
                break;
                default:
                    console.log(node.type)
                break;
            }
        })
    }
}

traverse(AST, handleProgram);
console.log(bytecode)
console.log(order)

// ! VM
const VirtualMachine = require('../vm');
// ! VM
// this["console"]["log"]("test")
const vm = new VirtualMachine(bytecode, [], order);
vm.debug = true;
vm.run();

// ! debug
writeFileSync('./debug_output/test.js', generate(AST, {
    comments: true,
    minified: false,
    concise: false,
}).code);