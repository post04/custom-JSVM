let c = 0;

const opcodes = {
  // Simple arithmitic
  ADD: c++, // +
  SUB: c++, // -
  MUL: c++, // *
  DIV: c++, // /
  MOD: c++, // %
  NEG: c++, // !

  // Logical
  EQUAL: c++, // ==
  NOT_EQUAL: c++, // !=
  STRICT_EQUAL: c++, // ===
  STRICT_NOT_EQUAL: c++, // !==
  GREATER_THAN: c++, // >
  LESS_THAN: c++, // <
  GREATER_THAN_EQUAL: c++, // >=
  LESS_THAN_EQUAL: c++, // <=

  // Bitwise
  AND: c++, // &
  OR: c++, // |
  XOR: c++, // ^
  NOT: c++, // ~
  LEFT_SHIFT: c++, // <<
  RIGHT_SHIFT: c++, // >>
  ZERO_LEFT_SHIFT: c++, // >>>

  // Stack operations
  PUSH: c++,
  JMP: c++,
  JMP_IF: c++,

  // Object operations
  PUSH_THIS: c++,
  MEMBER_EXPRESSION: c++,
  PUSH_ARRAY: c++,
  PUSH_OBJECT: c++,
  PUSH_TO_ARRAY: c++,

  // Other (for now)
  EXECUTE_FUNCTION: c++,

  // VM operations
  HLT: c++,
};

module.exports = {
  Opcodes: opcodes,
  numToOp(num) {
    res = Object.entries(opcodes).find((el) => el[1] == num);
    return res?.[0] || num;
  },
};
