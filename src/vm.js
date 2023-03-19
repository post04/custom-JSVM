// Taken from https://github.com/Kechinator/jsvm/blob/9d735425197a60fbd88eb009da085fb9540f0ff9/vm/vm.js#L16
const { Opcodes } = require('./constants');

class VirtualMachine {
  constructor(bytecode, labelMap) {
    this.bytecode = bytecode; // raw bytecode
    this.instructionPointer = 0;
    this.stack = []; // our stack
    this.labelMap = labelMap; // mapping of label -> position

    this.debug = false;
  }

  log(...a) {
    if (!this.debug) return;
    console.log('[DEBUG]', ...a);
  }

  handleOpcode(code) {
    const getTwo = () => {
      return [this.stack.pop(), this.stack.pop()];
    };

    var a, b, val, label, condition, pos;

    switch (code) {
      // Simple arithmitic
      case Opcodes.ADD:
        [b, a] = getTwo();
        this.stack.push(a + b);
        this.log(`ADD: ${a} + ${b} -> ${a + b}`);
        break;
      case Opcodes.SUB:
        [b, a] = getTwo();
        this.stack.push(a - b);
        this.log(`SUB: ${a} - ${b} -> ${a - b}`);
        break;
      case Opcodes.MUL:
        [b, a] = getTwo();
        this.stack.push(a * b);
        this.log(`MUL: ${a} * ${b} -> ${a * b}`);
        break;
      case Opcodes.DIV:
        [b, a] = getTwo();
        this.stack.push(a / b);
        this.log(`DIV: ${a} / ${b} -> ${a / b}`);
        break;
      case Opcodes.MOD:
        [b, a] = getTwo();
        this.stack.push(a % b);
        this.log(`MOD: ${a} % ${b} -> ${a % b}`);
        break;
      case Opcodes.NEG:
        a = this.stack.pop();
        this.stack.push(!a);
        this.log(`NEG: !${a} -> ${!a}`);
        break;

      // Logical
      case Opcodes.EQUAL:
        [b, a] = getTwo();
        this.stack.push(a == b);
        this.log(`EQUAL: ${a} == ${b} -> ${a == b}`);
        break;
      case Opcodes.NOT_EQUAL:
        [b, a] = getTwo();
        this.stack.push(a != b);
        this.log(`NOT_EQUAL: ${a} != ${b} -> ${a != b}`);
        break;
      case Opcodes.STRICT_EQUAL:
        [b, a] = getTwo();
        this.stack.push(a === b);
        this.log(`STRICT_EQUAL: ${a} === ${b} -> ${a === b}`);
        break;
      case Opcodes.STRICT_NOT_EQUAL:
        [b, a] = getTwo();
        this.stack.push(a !== b);
        this.log(`STRICT_NOT_EQUAL: ${a} !== ${b} -> ${a !== b}`);
        break;
      case Opcodes.GREATER_THAN:
        [b, a] = getTwo();
        this.stack.push(a > b);
        this.log(`GREATER_THAN: ${a} > ${b} -> ${a > b}`);
        break;
      case Opcodes.LESS_THAN:
        [b, a] = getTwo();
        this.stack.push(a < b);
        this.log(`LESS_THAN: ${a} < ${b} -> ${a < b}`);
        break;
      case Opcodes.GREATER_THAN_EQUAL:
        [b, a] = getTwo();
        this.stack.push(a >= b);
        this.log(`GREATER_THAN_EQUAL: ${a} >= ${b} -> ${a >= b}`);
        break;
      case Opcodes.LESS_THAN_EQUAL:
        [b, a] = getTwo();
        this.stack.push(a <= b);
        this.log(`LESS_THAN_EQUAL: ${a} <= ${b} -> ${a <= b}`);
        break;

      // Bitwise
      case Opcodes.AND:
        [b, a] = getTwo();
        this.stack.push(a & b);
        this.log(`AND: ${a} & ${b} -> ${a & b}`);
        break;
      case Opcodes.OR:
        [b, a] = getTwo();
        this.stack.push(a | b);
        this.log(`OR: ${a} | ${b} -> ${a | b}`);
        break;
      case Opcodes.XOR:
        [b, a] = getTwo();
        this.stack.push(a ^ b);
        this.log(`XOR: ${a} ^ ${b} -> ${a ^ b}`);
        break;
      case Opcodes.NOT:
        a = this.stack.pop();
        this.stack.push(~a);
        this.log(`NOT: ~${a} -> ${~a}`);
        break;
      case Opcodes.LEFT_SHIFT:
        [b, a] = getTwo();
        this.stack.push(a << b);
        this.log(`LEFT_SHIFT: ${a} << ${b} -> ${a << b}`);
        break;
      case Opcodes.RIGHT_SHIFT:
        [b, a] = getTwo();
        this.stack.push(a >> b);
        this.log(`RIGHT_SHIFT: ${a} >> ${b} -> ${a >> b}`);
        break;
      case Opcodes.ZERO_LEFT_SHIFT:
        [b, a] = getTwo();
        this.stack.push(a >>> b);
        this.log(`ZERO_LEFT_SHIFT: ${a} >>> ${b} -> ${a >>> b}`);
        break;

      // Stack operations
      case Opcodes.PUSH:
        val = this.bytecode[this.instructionPointer++];
        this.stack.push(val);
        this.log(`PUSH: ${val}`);
        break;
      case Opcodes.JMP:
        label = this.bytecode[this.instructionPointer++];
        pos = this.labelMap[label];
        this.log(`JMP: to: ${label}, pos: ${pos}`);
        this.instructionPointer = pos;
        break;
      case Opcodes.JMP_IF:
        label = this.bytecode[this.instructionPointer++];
        condition = this.stack.pop();
        pos = this.labelMap[label];
        this.log(`JMP_IF: to: ${label}, if: ${condition}, pos: ${pos}`);
        if (condition) this.instructionPointer = pos;
        break;

      // VM operations
      case Opcodes.HLT:
        this.instructionPointer = -1;
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
      if (this.instructionPointer === -1) {
        this.log('Interrupted!');
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
