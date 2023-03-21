**Simple arithmitic**

- `ADD`: Pops 2 elements, adds them together and pushes the result onto the stack
- `SUB` Pops 2 elements, subtracts them and pushes the result onto the stack
- `MUL` Pops 2 elements, multiplies them and pushes the result onto the stack
- `DIV` Pops 2 elements, divides them and pushes the result onto the stack
- `MOD` Pops 2 elements, uses the modulo operator on them and pushes the result onto the stack
- `NEG` Pops 1 element, uses the ! operator on it and pushes the result onto the stack

**Logical**

- `EQUAL` Pops 2 elements, checks if they're equal and pushes the result onto the stack
- `NOT_EQUAL` Pops 2 elements, checks if they're not equal and pushes the result onto the stack
- `STRICT_EQUAL` Pops 2 elements, checks if they're strictly equal and pushes the result onto the stack
- `STRICT_NOT_EQUAL` Pops 2 elements, checks if they're strictly not equal and pushes the result onto the stack
- `GREATER_THAN` Pops 2 elements, checks if the top one is greater and pushes the result onto the stack
- `LESS_THAN` Pops 2 elements, checks if the top one is smaller and pushes the result onto the stack
- `LESS_THAN_EQUAL` Pops 2 elements, checks if the top one is smaller or the same and pushes the result onto the stack
- `GREATER_THAN_EQUAL` Pops 2 elements, checks if the top one is greater or the same and pushes the result onto the stack

**Bitwise**

- `AND` Pops 2 elements, uses the `&` operator and pushes the result onto the stack
- `OR` Pops 2 elements, uses the `|` operator and pushes the result onto the stack
- `XOR` Pops 2 elements, uses the `^` operator and pushes the result onto the stack
- `NOT` Pops 2 elements, uses the `~` operator and pushes the result onto the stack
- `LEFT_SHIFT` Pops 2 elements, uses the `<<` operator and pushes the result onto the stack
- `RIGHT_SHIFT` Pops 2 elements, uses the `>>` operator and pushes the result onto the stack
- `ZERO_LEFT_SHIFT` Pops 2 elements, uses the `>>>` operator and pushes the result onto the stack

**Stack operations**

- `PUSH` Pushes the next byte onto the stack
- `JMP` Jumps the pointer to the next byte
- `JMP_IF` Jumps the pointer to the next byte if the top argument on the stack is also true (and pops that one)

**Object operations**

- `PUSH_THIS` Pushes the `window` (or global) keyword onto the stack
- `MEMBER_EXPRESSION` Gets the last 2 from the stack, pushes the result of `a[b]` to the stack
- `PUSH_ARRAY` Creates an empty array and pushes it to the stack
- `PUSH_OBJECT` Creates an empty object and pushes it to the stack
- `PUSH_TO_ARRAY` Gets the top element from the stack, and pushes it to the second element on the stack

**Other (for now)**

- `EXECUTE_FUNCTION` Executes the function at the top of the stack, passes in the destructured arguments from the array in the second top in the stack, if the type of the var is Array. If not, just use that as the only argument

**VM operations**

- `HLT` Halts the execution
