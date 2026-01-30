import { evaluateFormula, getFormulaReferences } from './formulaEvaluator';

describe('formulaEvaluator', () => {
    describe('basic arithmetic', () => {
        it('should evaluate simple addition', () => {
            expect(evaluateFormula('2 + 3', { columnValues: {} })).toBe(5);
        });

        it('should evaluate simple subtraction', () => {
            expect(evaluateFormula('10 - 4', { columnValues: {} })).toBe(6);
        });

        it('should evaluate simple multiplication', () => {
            expect(evaluateFormula('5 * 3', { columnValues: {} })).toBe(15);
        });

        it('should evaluate simple division', () => {
            expect(evaluateFormula('20 / 4', { columnValues: {} })).toBe(5);
        });

        it('should evaluate modulo operation', () => {
            expect(evaluateFormula('10 % 3', { columnValues: {} })).toBe(1);
        });

        it('should evaluate exponentiation', () => {
            expect(evaluateFormula('2 ^ 3', { columnValues: {} })).toBe(8);
        });
    });

    describe('operator precedence', () => {
        it('should respect multiplication precedence over addition', () => {
            expect(evaluateFormula('2 + 3 * 4', { columnValues: {} })).toBe(14);
        });

        it('should handle parentheses', () => {
            expect(evaluateFormula('(2 + 3) * 4', { columnValues: {} })).toBe(
                20,
            );
        });

        it('should handle complex expressions', () => {
            expect(
                evaluateFormula('2 * (3 + 4) - 5', { columnValues: {} }),
            ).toBe(9);
        });
    });

    describe('cell references', () => {
        it('should replace cell references with values', () => {
            const context = {
                columnValues: {
                    col1: 10,
                    col2: 5,
                },
            };
            expect(evaluateFormula('[col1] + [col2]', context)).toBe(15);
        });

        it('should handle null values in cell references', () => {
            const context = {
                columnValues: {
                    col1: null,
                },
            };
            const result = evaluateFormula('[col1] + 5', context);
            expect(result).toBe(5);
        });

        it('should handle text values in cell references', () => {
            const context = {
                columnValues: {
                    col1: 'Hello',
                    col2: 'World',
                },
            };
            expect(evaluateFormula('[col1] & " " & [col2]', context)).toBe(
                'Hello World',
            );
        });
    });

    describe('functions', () => {
        it('should evaluate sum function', () => {
            expect(
                evaluateFormula('sum(1, 2, 3, 4)', { columnValues: {} }),
            ).toBe(10);
        });

        it('should evaluate avg function', () => {
            expect(
                evaluateFormula('avg(10, 20, 30)', { columnValues: {} }),
            ).toBe(20);
        });

        it('should evaluate min function', () => {
            expect(
                evaluateFormula('min(5, 2, 8, 1)', { columnValues: {} }),
            ).toBe(1);
        });

        it('should evaluate max function', () => {
            expect(
                evaluateFormula('max(5, 2, 8, 1)', { columnValues: {} }),
            ).toBe(8);
        });

        it('should evaluate round function', () => {
            expect(
                evaluateFormula('round(3.14159, 2)', { columnValues: {} }),
            ).toBe(3.14);
        });

        it('should evaluate abs function', () => {
            expect(evaluateFormula('abs(-5)', { columnValues: {} })).toBe(5);
        });

        it('should evaluate sqrt function', () => {
            expect(evaluateFormula('sqrt(16)', { columnValues: {} })).toBe(4);
        });

        it('should evaluate if function', () => {
            expect(
                evaluateFormula('if(5 > 3, "yes", "no")', { columnValues: {} }),
            ).toBe('yes');
            expect(
                evaluateFormula('if(5 < 3, "yes", "no")', { columnValues: {} }),
            ).toBe('no');
        });
    });

    describe('comparison operators', () => {
        it('should evaluate equality', () => {
            expect(evaluateFormula('5 == 5', { columnValues: {} })).toBe(true);
            expect(evaluateFormula('5 == 3', { columnValues: {} })).toBe(false);
        });

        it('should evaluate inequality', () => {
            expect(evaluateFormula('5 != 3', { columnValues: {} })).toBe(true);
            expect(evaluateFormula('5 != 5', { columnValues: {} })).toBe(false);
        });

        it('should evaluate greater than', () => {
            expect(evaluateFormula('5 > 3', { columnValues: {} })).toBe(true);
            expect(evaluateFormula('3 > 5', { columnValues: {} })).toBe(false);
        });

        it('should evaluate less than', () => {
            expect(evaluateFormula('3 < 5', { columnValues: {} })).toBe(true);
            expect(evaluateFormula('5 < 3', { columnValues: {} })).toBe(false);
        });
    });

    describe('logical operators', () => {
        it('should evaluate and operator', () => {
            expect(evaluateFormula('true and true', { columnValues: {} })).toBe(
                true,
            );
            expect(
                evaluateFormula('true and false', { columnValues: {} }),
            ).toBe(false);
        });

        it('should evaluate or operator', () => {
            expect(evaluateFormula('true or false', { columnValues: {} })).toBe(
                true,
            );
            expect(
                evaluateFormula('false or false', { columnValues: {} }),
            ).toBe(false);
        });

        it('should evaluate not operator', () => {
            expect(evaluateFormula('not true', { columnValues: {} })).toBe(
                false,
            );
            expect(evaluateFormula('not false', { columnValues: {} })).toBe(
                true,
            );
        });
    });

    describe('string operations', () => {
        it('should concatenate strings with &', () => {
            expect(
                evaluateFormula('"Hello" & " " & "World"', {
                    columnValues: {},
                }),
            ).toBe('Hello World');
        });

        it('should evaluate length function', () => {
            expect(
                evaluateFormula('length("Hello")', { columnValues: {} }),
            ).toBe(5);
        });

        it('should evaluate upper function', () => {
            expect(
                evaluateFormula('upper("hello")', { columnValues: {} }),
            ).toBe('HELLO');
        });

        it('should evaluate lower function', () => {
            expect(
                evaluateFormula('lower("HELLO")', { columnValues: {} }),
            ).toBe('hello');
        });
    });

    describe('error handling', () => {
        it('should return null for empty formula', () => {
            expect(evaluateFormula('', { columnValues: {} })).toBe(null);
        });

        it('should return error message for invalid syntax', () => {
            const result = evaluateFormula('2 +', { columnValues: {} });
            expect(typeof result).toBe('string');
            expect((result as string).startsWith('Error:')).toBe(true);
        });

        it('should return error message for unknown function', () => {
            const result = evaluateFormula('unknownFunc(1, 2)', {
                columnValues: {},
            });
            expect(typeof result).toBe('string');
            expect((result as string).includes('Unknown function')).toBe(true);
        });
    });

    describe('getFormulaReferences', () => {
        it('should extract cell references from formula', () => {
            const refs = getFormulaReferences('[col1] + [col2] * [col3]');
            expect(refs).toEqual(['col1', 'col2', 'col3']);
        });

        it('should return empty array for formula without references', () => {
            const refs = getFormulaReferences('2 + 3 * 4');
            expect(refs).toEqual([]);
        });

        it('should handle duplicate references', () => {
            const refs = getFormulaReferences('[col1] + [col1]');
            expect(refs).toEqual(['col1', 'col1']);
        });
    });
});
