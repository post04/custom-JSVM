const Compiler = require('./compiler');
const VirtualMachine = require('./vm');

const code = `
let a = "Hello"
console.log(a, 'PianoMan');
1+2
`;

const compiler = new Compiler();

// const { bytecode, order } = new Compiler().compileFromFile(
//   './compiler/samples/3.js'
// );
const {
    bytecode,
    order
} = compiler.compileFromString(code);
// console.log(compiler.base64());
// console.log(compiler.compileFromBase64(compiler.base64()));
console.log(bytecode, order);
const vm = new VirtualMachine(bytecode, [], order);
vm.debug = true;
vm.run();