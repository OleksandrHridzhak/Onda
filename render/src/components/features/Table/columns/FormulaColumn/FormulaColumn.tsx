import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { FormulaCell } from './FormulaCell';
import { updateColumnFields } from '../../../../../db/helpers/columns';
import { FormulaColumn as FormulaColumnType } from '../../../../../types/newColumn.types';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';
import { DayColumnLayout } from '../DayColumnLayout';
import { evaluateFormula } from '../../../../../utils/formulaEvaluator';
import { useLiveQuery } from 'dexie-react-hooks';
import { getAllColumns } from '../../../../../db/helpers/columns';

interface FormulaColumnProps {
    columnId: string;
}

export const FormulaColumn: React.FC<FormulaColumnProps> = ({ columnId }) => {
    const { column, isLoading, isError } = useReactiveColumn<FormulaColumnType>(
        columnId,
        'formulaColumn',
    );

    // Fetch all columns to evaluate formulas with cell references
    const allColumns = useLiveQuery(async () => {
        const res = await getAllColumns();
        return res.success ? res.data : [];
    });

    // TODO: Add a proper skeleton / error state later
    if (isLoading || allColumns === undefined) {
        return <div></div>;
    }

    if (isError || !column) {
        return null;
    }

    const handleFormulaChange = (day: string, newFormula: string) => {
        // Update the formula
        updateColumnFields(columnId, {
            [`uniqueProps.days.${day}.formula`]: newFormula,
        });

        // Evaluate and update the result
        evaluateAndUpdateResult(day, newFormula);
    };

    const evaluateAndUpdateResult = (day: string, formula: string) => {
        // Build context with values from other columns in the same row (same day)
        const columnValues: Record<string, string | number | boolean | null> =
            {};

        allColumns?.forEach((col) => {
            if (col.id === columnId) return; // Skip self

            // Extract value based on column type
            // Note: Only supported column types are included.
            // New column types need to be added here for formula compatibility.
            if (col.type === 'checkboxColumn') {
                columnValues[col.id] =
                    col.uniqueProps.days[
                        day as keyof typeof col.uniqueProps.days
                    ];
            } else if (col.type === 'textboxColumn') {
                columnValues[col.id] =
                    col.uniqueProps.days[
                        day as keyof typeof col.uniqueProps.days
                    ];
            } else if (col.type === 'numberboxColumn') {
                columnValues[col.id] =
                    col.uniqueProps.days[
                        day as keyof typeof col.uniqueProps.days
                    ];
            } else if (col.type === 'formulaColumn') {
                columnValues[col.id] =
                    col.uniqueProps.days[
                        day as keyof typeof col.uniqueProps.days
                    ]?.result ?? null;
            }
            // TODO: Add support for more column types (tags, multi-checkbox, etc.)
        });

        // Evaluate the formula
        const result = evaluateFormula(formula, { columnValues });

        // Update the result in the database
        updateColumnFields(columnId, {
            [`uniqueProps.days.${day}.result`]: result,
        });
    };

    return (
        <table className="checkbox-nested-table column-formula font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout>
                {(day) => {
                    const dayData = column.uniqueProps.days[day];
                    return (
                        <FormulaCell
                            formula={dayData?.formula || ''}
                            result={dayData?.result ?? null}
                            onChange={(newFormula) =>
                                handleFormulaChange(day, newFormula)
                            }
                        />
                    );
                }}
            </DayColumnLayout>
        </table>
    );
};
