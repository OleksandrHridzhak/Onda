import React from 'react';
import { componentsMap } from './Table.constants';
import { daysColumn, fillerColumn } from './Table.constants';
import { useLiveQuery } from 'dexie-react-hooks';
import TableItemWrapper from './columns/TableItemWrapper';
import { getAllColumns } from '../../../db/helpers/columns';
import { getSettings } from '../../../db/helpers/settings';
import './Table.css';
import { useRowHeightSync } from './hooks/useRowHeightSync';
import DynamicColumn from './columns/DynamicColumn';

const Table: React.FC = () => {
    /**
     * Fetch the ordered list of column IDs from the settings.
     * This determines the visual sequence of columns in the table.
     */
    const columnOrder = useLiveQuery(async () => {
        const res = await getSettings();
        return res?.data?.layout?.columnsOrder ?? [];
    });

    /**
     * Fetch all column data objects from the database.
     * Required as a dependency for useRowHeightSync to recalculate
     * row heights when column content or configuration changes.
     */
    const columnsData = useLiveQuery(async () => {
        const res = await getAllColumns();
        return res.success ? res.data : [];
    });

    // Synchronize row heights across all nested tables
    useRowHeightSync([columnsData]);

    // To avoid rendering issues, ensure required data is loaded
    if (columnOrder === undefined || columnsData === undefined) {
        return null; // Add a loading skeleton here if needed
    }

    /**
     * ARCHITECTURE NOTE:
     * We use nested tables for each column instead of standard cell rendering.
     * This provides each column type with structural independence.
     * * Structure:
     * <MainTable>
     * <Row>
     * <DaysColumn (Nested Table) />
     * <DynamicColumns (Nested Tables) />
     * <FillerColumn (Nested Table) />
     * </Row>
     * </MainTable>
     */
    return (
        <div className="overflow-x-auto font-poppins border border-border rounded-xl m-2 custom-scroll">
            <div className="overflow-x-auto custom-scroll">
                <table className="w-full">
                    <thead>
                        <tr className="border-border bg-tableHeader text-textTableValues border-b">
                            {/* Static: Days of the week column */}
                            <TableItemWrapper
                                key="days-column"
                                column={daysColumn}
                                className="border-r border-border"
                            >
                                <componentsMap.days />
                            </TableItemWrapper>

                            {/* Dynamic: User-defined optional columns */}
                            {columnOrder.map((id) => (
                                <DynamicColumn key={id} columnId={id} />
                            ))}

                            {/* Utility: Filler column to occupy remaining space */}
                            <TableItemWrapper
                                key="filler"
                                column={fillerColumn}
                            >
                                <componentsMap.fillerColumn />
                            </TableItemWrapper>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    );
};
export default Table;
