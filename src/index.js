const VirtualMachine = require('./vm');

const bytecode = [0x00, 0x00, 0x00, 0x00];
console.log(VirtualMachine);
const vm = new VirtualMachine(bytecode);

console.log(vm);
