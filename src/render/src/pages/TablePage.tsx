import React from 'react';
import PlannerHeader from 'features/PlannerHeader';
import { useTableLogic } from 'features/Table/TableLogic';
import Table from 'features/Table/Table';
import { useLiveQuery } from 'dexie-react-hooks';
import { getAllColumns } from 'db/helpers/columns';
import { getSettings } from 'db/helpers/settings';

const TableScreen: React.FC = () => {
    const tableLogic = useTableLogic();

    const columnsData = useLiveQuery(async () => {
        const res = await getAllColumns();
        if (!res.success) {
            console.error('Failed to load columns:', res.error);
            return [];
        }
        return res.data;
    });

    const settings = useLiveQuery(async () => {
        const res = await getSettings();
        if (!res.success) {
            console.error('Failed to load settings:', res.error);
            return null;
        }
        return res.data;
    });

    const isLoading =
        tableLogic.loading ||
        columnsData === undefined ||
        settings === undefined;

    if (isLoading) {
        return null;
    }

    return (
        <div className="font-poppins relative w-full max-w-6xl mx-auto bg-background overflow-y-auto">
            <div>
                <PlannerHeader />
            </div>
            <Table />
        </div>
    );
};

export default TableScreen;
