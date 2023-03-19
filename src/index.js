const VirtualMachine = require('./vm');
const parser = require('./parser');

const { program, labelMap } = parser(`
PUSH 12   
PUSH 3   
DIV     ; 12 / 3 -> 4
PUSH 10
MUL     ; 4 * 10 -> 40
PUSH 39
JMP Label1
HLT
@Label1
GREATER_THAN ; 40 > 39 -> true 
JMP_IF Label2
HLT
@Label2
`);
console.log(program, labelMap);
const vm = new VirtualMachine(program, labelMap);
vm.debug = true;
vm.run();
console.log('Stack:', vm.stack);
