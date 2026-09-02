import { PlannerHeader } from 'app/layouts/PlannerHeader/PlannerHeader';
import { WeeklyTable } from 'features/table/components/WeeklyTable';

export function TablePage(): React.ReactElement {
    return (
        <div className="font-poppins relative w-full max-w-6xl mx-auto bg-background overflow-y-auto">
            <PlannerHeader />
            <WeeklyTable />
        </div>
    );
}

export default TablePage;
