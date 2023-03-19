const { Opcodes } = require('./constants');

const tryParseInt = (n) => {
  try {
    const a = parseInt(n);
    if (a === NaN) return n;
    return a;
  } catch (e) {
    return n;
  }
};

module.exports = (asm) => {
  let program = [];
  asm.split('\n').forEach((line) => {
    if (!line || line.startsWith(';')) return;
    let args = line
      .split(';')[0]
      .split(' ')
      .filter((el) => el.trim());
    const opcode = args.shift().trim();
    if (!(opcode in Opcodes))
      throw new Error(`Parser: unknown opcode ${opcode}`);
    program.push(Opcodes[opcode], ...args.map((a) => tryParseInt(a.trim())));
  });
  return program.filter((a) => a !== undefined); // filter out undefined
};
