import { PlannerHeader } from 'widgets/PlannerHeader';
import { WeeklyTable } from 'widgets/WeeklyTable';

const TableScreen = (): React.ReactElement => {
    return (
        <div className="font-poppins relative w-full max-w-6xl mx-auto bg-background overflow-y-auto">
            <PlannerHeader />
            <WeeklyTable />
        </div>
    );
};

export default TableScreen;
