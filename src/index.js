const VirtualMachine = require('./vm');
const parser = require('./parser');

const program = parser(`
PUSH 0x07   ; Push 7 onto stack
PUSH 0x04   ; Push 4 onto stack 
ADD         ; Add last two together
`);
const vm = new VirtualMachine(program);
vm.debug = true;
vm.run();
console.log('Stack:', vm.stack);
