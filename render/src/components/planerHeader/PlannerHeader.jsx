import PomodoroWidget from './widgets/PomodoroWidget';
import TimelineWidget from './widgets/TimelineWidget';
import { TimeWidget } from './widgets/TimeWidget';
import { AddNewColumnBtn } from './widgets/AddNewColumnBtn';

const PlannerHeader = ({
  darkTheme = false,
  layout = ['TimelineWidget', 'PomodoroWidget'],
  showColumnSelector,
  setShowColumnSelector,
}) => {

  const widgetComponents = {
    PomodoroWidget,
    TimelineWidget,
  };

  const renderWidgets = (names = []) =>
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
    </div>
  );
};

export default PlannerHeader;
