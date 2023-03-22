const Compiler = require('./compiler');
const VirtualMachine = require('./vm');

const { bytecode, order } = new Compiler().compileFromFile(
  './compiler/samples/3.js'
);

const vm = new VirtualMachine(bytecode, [], order);
vm.debug = true;
vm.run();
