const VirtualMachine = require('./vm');
const parser = require('./parser');

const program = parser(`
PUSH 12   
PUSH 3   
DIV     
PUSH 10
ADD
`);
const vm = new VirtualMachine(program);
vm.debug = true;
vm.run();
console.log('Stack:', vm.stack);
