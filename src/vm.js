// Taken from https://github.com/Kechinator/jsvm/blob/9d735425197a60fbd88eb009da085fb9540f0ff9/vm/vm.js#L16
const { Opcodes } = require('./constants');

class VirtualMachine {
  constructor(bytecode) {
    this.bytecode = bytecode; // raw bytecode
    this.instructionPointer = 0;
    this.stack = []; // our stack

    this.debug = false;
  }

  log(...a) {
    if (!this.debug) return;
    console.log('[DEBUG]', ...a);
  }

  handleOpcode(code) {
    var a, b;
    switch (code) {
      case Opcodes.ADD:
        b = this.stack.pop();
        a = this.stack.pop();
        this.stack.push(a + b);
        this.log(`ADD: ${a} + ${b} -> ${a + b}`);
        break;
      case Opcodes.SUB:
        b = this.stack.pop();
        a = this.stack.pop();
        this.stack.push(a - b);
        this.log(`SUB: ${a} - ${b} -> ${a - b}`);
        break;
      case Opcodes.MUL:
        b = this.stack.pop();
        a = this.stack.pop();
        this.stack.push(a * b);
        this.log(`MUL: ${a} * ${b} -> ${a * b}`);
        break;
      case Opcodes.DIV:
        b = this.stack.pop();
        a = this.stack.pop();
        this.stack.push(a / b);
        this.log(`DIV: ${a} / ${b} -> ${a / b}`);
        break;
      case Opcodes.MOD:
        b = this.stack.pop();
        a = this.stack.pop();
        this.stack.push(a % b);
        this.log(`MOD: ${a} % ${b} -> ${a % b}`);
        break;
      case Opcodes.NEG:
        break;
      case Opcodes.PUSH:
        const val = this.bytecode[this.instructionPointer++];
        this.stack.push(val);
        this.log(`PUSH: ${val}`);
        break;
      default:
        throw new Error(`No handler for opcode ${code}`);
    }
  }

  run() {
    // We assume that the first byte is an opcode
    for (;;) {
      if (this.instructionPointer >= this.bytecode.length) {
        this.log('Done!');
        break;
      }
      this.log('Stack:', this.stack);
      this.log('Instruction Pointer:', this.instructionPointer);
      const operation = this.bytecode[this.instructionPointer++];
      this.handleOpcode(operation);
      if (this.debug) console.log(' ');
    }
  }
}

module.exports = VirtualMachine;
