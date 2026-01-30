/**
 * Formula Evaluator
 *
 * Evaluates formula expressions similar to Notion formulas.
 * Supports:
 * - Basic arithmetic: +, -, *, /, %, ^
 * - Parentheses for grouping: ()
 * - Numbers: integers and decimals
 * - Cell references: [columnId] (references same row, same day)
 * - Functions: sum(), avg(), min(), max(), round(), abs(), sqrt()
 * - Logical: if(condition, true_value, false_value)
 * - Comparison: ==, !=, >, <, >=, <=
 * - String concatenation: &
 * - Logical operators: and, or, not
 */

interface EvaluationContext {
    columnValues: Record<string, string | number | boolean | null>;
}

/**
 * Evaluates a formula expression with the given context
 * @param formula - The formula string to evaluate
 * @param context - Context with column values for cell references
 * @returns The evaluated result (number, string, boolean, or null)
 */
export function evaluateFormula(
    formula: string,
    context: EvaluationContext,
): string | number | boolean | null {
    if (!formula || formula.trim() === '') {
        return null;
    }

    try {
        // Replace cell references with values
        let processedFormula = formula;

        // Replace [columnId] with actual values
        const cellRefPattern = /\[([^\]]+)\]/g;
        processedFormula = processedFormula.replace(
            cellRefPattern,
            (match, columnId) => {
                const value = context.columnValues[columnId];
                if (value === null || value === undefined) {
                    return 'null';
                }
                if (typeof value === 'string') {
                    return `"${value.replace(/"/g, '\\"')}"`;
                }
                return String(value);
            },
        );

        // Parse and evaluate the expression
        const result = parseExpression(processedFormula);
        return result;
    } catch (error) {
        console.error('Formula evaluation error:', error);
        return `Error: ${(error as Error).message}`;
    }
}

/**
 * Tokenize the expression
 */
function tokenize(expr: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < expr.length; i++) {
        const char = expr[i];

        if (inString) {
            current += char;
            if (char === stringChar && expr[i - 1] !== '\\') {
                inString = false;
                tokens.push(current);
                current = '';
            }
            continue;
        }

        if (char === '"' || char === "'") {
            if (current) {
                tokens.push(current);
                current = '';
            }
            inString = true;
            stringChar = char;
            current = char;
            continue;
        }

        if (/\s/.test(char)) {
            if (current) {
                tokens.push(current);
                current = '';
            }
            continue;
        }

        if ('()+-*/%^<>=!&,'.includes(char)) {
            if (current) {
                tokens.push(current);
                current = '';
            }

            // Handle two-character operators
            if (i < expr.length - 1) {
                const twoChar = char + expr[i + 1];
                if (['==', '!=', '>=', '<='].includes(twoChar)) {
                    tokens.push(twoChar);
                    i++;
                    continue;
                }
            }

            tokens.push(char);
            continue;
        }

        current += char;
    }

    if (current) {
        tokens.push(current);
    }

    return tokens;
}

/**
 * Parse and evaluate expression using a simple recursive descent parser
 */
function parseExpression(expr: string): string | number | boolean | null {
    const tokens = tokenize(expr.trim());
    let pos = 0;

    function peek(): string | undefined {
        return tokens[pos];
    }

    function consume(): string {
        return tokens[pos++];
    }

    function parseOr(): string | number | boolean | null {
        let left = parseAnd();

        while (peek() === 'or') {
            consume(); // or
            const right = parseAnd();
            left = left || right;
        }

        return left;
    }

    function parseAnd(): string | number | boolean | null {
        let left = parseComparison();

        while (peek() === 'and') {
            consume(); // and
            const right = parseComparison();
            left = left && right;
        }

        return left;
    }

    function parseComparison(): string | number | boolean | null {
        const left = parseAdditive();

        const op = peek();
        if (['==', '!=', '>', '<', '>=', '<='].includes(op || '')) {
            consume();
            const right = parseAdditive();
            switch (op) {
                case '==':
                    return left == right;
                case '!=':
                    return left != right;
                case '>':
                    return Number(left) > Number(right);
                case '<':
                    return Number(left) < Number(right);
                case '>=':
                    return Number(left) >= Number(right);
                case '<=':
                    return Number(left) <= Number(right);
            }
        }

        return left;
    }

    function parseAdditive(): string | number | boolean | null {
        let left = parseMultiplicative();

        while (true) {
            const op = peek();
            if (op === '+' || op === '-' || op === '&') {
                consume();
                const right = parseMultiplicative();
                if (op === '+') {
                    left = Number(left) + Number(right);
                } else if (op === '-') {
                    left = Number(left) - Number(right);
                } else if (op === '&') {
                    left = String(left) + String(right);
                }
            } else {
                break;
            }
        }

        return left;
    }

    function parseMultiplicative(): string | number | boolean | null {
        let left = parseExponential();

        while (true) {
            const op = peek();
            if (op === '*' || op === '/' || op === '%') {
                consume();
                const right = parseExponential();
                if (op === '*') {
                    left = Number(left) * Number(right);
                } else if (op === '/') {
                    left = Number(left) / Number(right);
                } else if (op === '%') {
                    left = Number(left) % Number(right);
                }
            } else {
                break;
            }
        }

        return left;
    }

    function parseExponential(): string | number | boolean | null {
        let left = parseUnary();

        if (peek() === '^') {
            consume();
            const right = parseExponential();
            left = Math.pow(Number(left), Number(right));
        }

        return left;
    }

    function parseUnary(): string | number | boolean | null {
        const token = peek();

        if (token === 'not') {
            consume();
            return !parseUnary();
        }

        if (token === '-') {
            consume();
            return -Number(parseUnary());
        }

        if (token === '+') {
            consume();
            return Number(parseUnary());
        }

        return parsePrimary();
    }

    function parsePrimary(): string | number | boolean | null {
        const token = peek();

        if (!token) {
            throw new Error('Unexpected end of expression');
        }

        // Parentheses
        if (token === '(') {
            consume();
            const result = parseOr();
            if (peek() !== ')') {
                throw new Error('Expected closing parenthesis');
            }
            consume();
            return result;
        }

        // Functions
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token) && peek() !== undefined) {
            const nextToken = tokens[pos + 1];
            if (nextToken === '(') {
                return parseFunction();
            }
        }

        // Numbers
        if (/^-?\d+\.?\d*$/.test(token)) {
            consume();
            return parseFloat(token);
        }

        // Strings
        if (token.startsWith('"') || token.startsWith("'")) {
            consume();
            return token.slice(1, -1);
        }

        // Booleans
        if (token === 'true') {
            consume();
            return true;
        }
        if (token === 'false') {
            consume();
            return false;
        }

        // Null
        if (token === 'null') {
            consume();
            return null;
        }

        throw new Error(`Unexpected token: ${token}`);
    }

    function parseFunction(): string | number | boolean | null {
        const funcName = consume().toLowerCase();
        consume(); // (

        const args: Array<string | number | boolean | null> = [];

        if (peek() !== ')') {
            while (true) {
                args.push(parseOr());
                if (peek() === ',') {
                    consume();
                } else {
                    break;
                }
            }
        }

        if (peek() !== ')') {
            throw new Error('Expected closing parenthesis for function');
        }
        consume();

        return evaluateFunction(funcName, args);
    }

    function evaluateFunction(
        name: string,
        args: Array<string | number | boolean | null>,
    ): string | number | boolean | null {
        switch (name) {
            case 'sum':
                return args.reduce(
                    (a, b) => Number(a) + Number(b),
                    0 as number,
                );
            case 'avg': {
                if (args.length === 0) return 0;
                const sum = args.reduce(
                    (a, b) => Number(a) + Number(b),
                    0 as number,
                ) as number;
                return sum / args.length;
            }
            case 'min':
                return Math.min(...args.map(Number));
            case 'max':
                return Math.max(...args.map(Number));
            case 'round': {
                const decimals = args[1] !== undefined ? Number(args[1]) : 0;
                return Number(
                    (
                        Math.round(Number(args[0]) * Math.pow(10, decimals)) /
                        Math.pow(10, decimals)
                    ).toFixed(decimals),
                );
            }
            case 'abs':
                return Math.abs(Number(args[0]));
            case 'sqrt':
                return Math.sqrt(Number(args[0]));
            case 'if':
                return args[0] ? args[1] : args[2];
            case 'length':
                return String(args[0]).length;
            case 'upper':
                return String(args[0]).toUpperCase();
            case 'lower':
                return String(args[0]).toLowerCase();
            default:
                throw new Error(`Unknown function: ${name}`);
        }
    }

    return parseOr();
}

/**
 * Get all column references from a formula
 * @param formula - The formula string
 * @returns Array of column IDs referenced in the formula
 */
export function getFormulaReferences(formula: string): string[] {
    const refs: string[] = [];
    const cellRefPattern = /\[([^\]]+)\]/g;
    let match;

    while ((match = cellRefPattern.exec(formula)) !== null) {
        refs.push(match[1]);
    }

    return refs;
}
