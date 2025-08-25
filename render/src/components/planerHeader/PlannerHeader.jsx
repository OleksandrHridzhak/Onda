import PomodoroWidget from './widgets/PomodoroWidget';
import TimelineWidget from './widgets/TimelineWidget';
import { useSelector } from 'react-redux';
import { TimeWidget } from './widgets/TimeWidget';
import { AddNewColumnBtn } from './widgets/AddNewColumnBtn';

const PlannerHeader = ({
  darkTheme = false,
  layout = ['TimelineWidget', 'PomodoroWidget'],
  showColumnSelector,
  setShowColumnSelector,
}) => {
  const theme = useSelector((state) => state.theme.theme);

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
    <div className={`${theme.background}`}>
      {layout?.length > 0 ? (
        <div className="flex justify-between items-center px-2 pt-10 pb-9">
          <TimeWidget />
          <div className="flex items-center">
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
