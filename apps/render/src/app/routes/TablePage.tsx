import { PlannerHeader } from "app/layouts/PlannerHeader/PlannerHeader";
import { WeeklyTable } from "features/table/components/WeeklyTable";

export function TablePage(): React.ReactElement {
  return (
    <div>
      <PlannerHeader />
      <WeeklyTable />
    </div>
  );
}

export default TablePage;
