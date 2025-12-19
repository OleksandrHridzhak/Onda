import React from 'react';
import PomodoroWidget from './widgets/PomodoroWidget';
import TimelineWidget from './widgets/TimelineWidget';
import { TimeWidget } from './widgets/TimeWidget';
import ColumnTypeSelector from './ColumnTypeSelector';
import { AddNewColumnBtn } from './widgets/AddNewColumnBtn';

interface PlannerHeaderProps {
  darkTheme?: boolean;
  layout?: string[];
  showColumnSelector: boolean;
  setShowColumnSelector: (show: boolean) => void;
  handleAddColumn: (columnType: string) => void;
}

const PlannerHeader: React.FC<PlannerHeaderProps> = ({
  darkTheme = false,
  layout = ['TimelineWidget', 'PomodoroWidget'],
  showColumnSelector,
  setShowColumnSelector,
  handleAddColumn,
}) => {
  const widgetComponents: Record<
    string,
    React.ComponentType<{ darkTheme?: boolean }>
  > = {
    PomodoroWidget,
    TimelineWidget,
  };

  const renderWidgets = (names: string[] = []): (React.ReactElement | null)[] =>
    names.map((name) => {
      const Widget = widgetComponents[name];
      return Widget ? <Widget key={name} darkTheme={darkTheme} /> : null;
    });

  return (
    <div className={`bg-background`}>
      {layout?.length > 0 ? (
        <div className="flex flex-wrap justify-between items-center  px-2 md:pt-10 md:pb-9">
          <TimeWidget />
          <div className="hidden md:flex flex-wrap items-center">
            {renderWidgets(layout)}
            <div className="flex justify-center">
              <AddNewColumnBtn
                setShowColumnSelector={setShowColumnSelector}
                showColumnSelector={showColumnSelector}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center px-2 pt-10 pb-9">
          <TimeWidget />
        </div>
      )}
      {showColumnSelector && (
        <div className="absolute right-0 z-50">
          <ColumnTypeSelector
            onSelect={handleAddColumn}
            onCancel={() => setShowColumnSelector(false)}
            darkMode={darkTheme === true ? true : false}
          />
        </div>
      )}
    </div>
  );
};

export default PlannerHeader;
