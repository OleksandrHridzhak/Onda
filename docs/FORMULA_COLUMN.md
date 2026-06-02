# Formula Column Feature

The Formula Column is a powerful feature that allows you to calculate values based on other cells in the same row, similar to spreadsheet formulas but with a Notion-like feel and flexibility.

## Overview

The Formula Column evaluates mathematical expressions and functions, and can reference values from other columns in the same row. Each day of the week can have its own formula and calculated result.

## How to Use

1. **Create a Formula Column**: Add a new Formula column from the column creation menu
2. **Click on a Cell**: Click on any cell in the Formula column to start editing
3. **Enter a Formula**: Type your formula expression
4. **Press Enter**: The formula will be evaluated and the result displayed

## Formula Syntax

### Basic Arithmetic Operations

- Addition: `2 + 3` → 5
- Subtraction: `10 - 4` → 6
- Multiplication: `5 * 3` → 15
- Division: `20 / 4` → 5
- Modulo: `10 % 3` → 1
- Exponentiation: `2 ^ 3` → 8

### Operator Precedence

Formulas follow standard mathematical precedence:

- `2 + 3 * 4` → 14 (multiplication first)
- `(2 + 3) * 4` → 20 (parentheses override precedence)

### Cell References

Reference other columns in the same row using `[columnId]`:

```
[col1] + [col2]
[numberColumn] * 2
[col1] + [col2] + [col3]
```

The formula will use the value from the same day (row) of the referenced column.

### Functions

#### Mathematical Functions

- `sum(a, b, c, ...)` - Sum all arguments
    - Example: `sum(1, 2, 3, 4)` → 10
- `avg(a, b, c, ...)` - Average of all arguments
    - Example: `avg(10, 20, 30)` → 20
- `min(a, b, c, ...)` - Minimum value
    - Example: `min(5, 2, 8, 1)` → 1
- `max(a, b, c, ...)` - Maximum value
    - Example: `max(5, 2, 8, 1)` → 8
- `round(number, decimals)` - Round to specified decimal places
    - Example: `round(3.14159, 2)` → 3.14
- `abs(number)` - Absolute value
    - Example: `abs(-5)` → 5
- `sqrt(number)` - Square root
    - Example: `sqrt(16)` → 4

#### String Functions

- `length(string)` - Length of string
    - Example: `length("Hello")` → 5
- `upper(string)` - Convert to uppercase
    - Example: `upper("hello")` → "HELLO"
- `lower(string)` - Convert to lowercase
    - Example: `lower("HELLO")` → "hello"

#### String Concatenation

Use `&` to concatenate strings:

- `"Hello" & " " & "World"` → "Hello World"
- `[textCol1] & " - " & [textCol2]`

#### Logical Functions

- `if(condition, true_value, false_value)` - Conditional expression
    - Example: `if(5 > 3, "yes", "no")` → "yes"
    - Example: `if([col1] > 100, "High", "Low")`

### Comparison Operators

- `==` - Equal to
- `!=` - Not equal to
- `>` - Greater than
- `<` - Less than
- `>=` - Greater than or equal to
- `<=` - Less than or equal to

Example: `if([score] >= 90, "A", "B")`

### Logical Operators

- `and` - Logical AND
    - Example: `5 > 3 and 10 < 20` → true
- `or` - Logical OR
    - Example: `5 < 3 or 10 < 20` → true
- `not` - Logical NOT
    - Example: `not true` → false

## Example Use Cases

### Calculate Total from Multiple Columns

If you have columns for different expense categories:

```
[groceries] + [transport] + [entertainment]
```

### Calculate Percentage

```
([actual] / [target]) * 100
```

### Conditional Formatting Based on Value

```
if([score] >= 90, "Excellent", if([score] >= 70, "Good", "Needs Improvement"))
```

### Calculate Average of Cell References

```
avg([col1], [col2], [col3])
```

### String Manipulation

```
upper([name]) & " - " & [status]
```

## Tips

1. **Reference by Column ID**: To find a column's ID, you can inspect it in the developer tools or use the column menu
2. **Error Handling**: If a formula has invalid syntax, it will display an error message
3. **Null Values**: References to empty cells are treated as null/0 in calculations
4. **Real-time Updates**: Formulas automatically recalculate when referenced columns change (not yet implemented - future enhancement)

## Limitations

- Formulas can only reference cells in the same row (same day of the week)
- Circular references are not supported
- Currently, formulas are recalculated only when manually edited (auto-recalculation on dependency changes is a future enhancement)

## Future Enhancements

- Auto-recalculation when referenced cells change
- Date and time functions
- More advanced text manipulation functions
- Support for cross-row references (e.g., sum of all values in a column)
- Formula library/templates for common calculations
