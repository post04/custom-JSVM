const VirtualMachine = require('./vm');
const parser = require('./parser');

const { program, labelMap } = parser(`
PUSH_ARRAY
PUSH 0x10
PUSH_TO_ARRAY
PUSH 0x10
PUSH_TO_ARRAY
`);
console.log(program, labelMap);
const vm = new VirtualMachine(program, labelMap, [0, 1, 2, 3, 4]);
vm.debug = true;
vm.run();
console.log('Stack:', vm.stack);
