let c = 0;
module.exports = {
  Opcodes: {
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
  },
};
