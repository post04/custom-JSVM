const { Opcodes } = require('./constants');

const tryParseInt = (arg) => {
  try {
    const parsed = parseInt(arg);
    if (isNaN(parsed)) return arg;
    return parsed;
  } catch (e) {
    return arg;
  }
};

module.exports = (asm) => {
  let program = [];
  let labelMap = {};

  // Handle our ASM code line by line
  asm.split('\n').forEach((line) => {
    // if the line is empty or starts with a comment, skip
    if (!line || line.startsWith(';')) return;
    if (line.startsWith('@')) {
      labelMap[line.split('@')[1].split(' ')[0]] = program.length;
      return;
    }

    // Get the args of the line, handle comments
    let args = line
      .trim()
      .split(';')[0]
      .split(' ')
      .filter((el) => el.trim());

    // Get the opcode
    const opcode = args.shift().trim();

    // Handle unknown opcodes
    if (!(opcode in Opcodes))
      throw new Error(`Parser: unknown opcode ${opcode}`);

    // Push opcode and args to program. Parse each arg as an int, if posible
    const parsed = args.map((a) => tryParseInt(a.trim()));
    // console.log(line, '\t=>\t', parsed);
    program.push(Opcodes[opcode], ...parsed);
  });

  return {
    program: program.filter((a) => a !== undefined),
    labelMap: labelMap,
  };
};
