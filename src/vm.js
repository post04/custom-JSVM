// Taken from https://github.com/Kechinator/jsvm/blob/9d735425197a60fbd88eb009da085fb9540f0ff9/vm/vm.js#L16
const opcodes = {
  // Simple arithmitic
  ADD: 0x00,
  SUB: 0x01,
  MUL: 0x02,
  DIV: 0x03,
  MOD: 0x04,
  NEG: 0x05,
};

class VirtualMachine {
  constructor(bytecode) {
    this.bytecode = bytecode; // raw bytecode
    this.instructionPointer = 0;
    this.stack = []; // our stack
  }

  handleOpcode(code) {
    switch (code) {
      case opcodes.ADD:
        break;
      case opcodes.SUB:
        break;
      case opcodes.MUL:
        break;
      case opcodes.DIV:
        break;
      case opcodes.MOD:
        break;
      case opcodes.NEG:
        break;
      default:
        throw new Error(`No handler for opcode ${code}`);
    }
  }
}

module.exports = VirtualMachine;
