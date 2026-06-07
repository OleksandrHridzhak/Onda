import React from 'react';
import PomodoroWidget from 'features/PlannerHeader/widgets/PomodoroWidget';
import TimelineWidget from 'features/PlannerHeader/widgets/TimelineWidget';
import { SymbolBlock } from 'features/PlannerHeader/widgets/SymbolBlock';
import { TimeWidget } from 'features/PlannerHeader/widgets/TimeWidget';

interface PlannerHeaderProps {
    darkTheme?: boolean;
    layout?: string[];
}
// PlannerHeader componentfр

const PlannerHeader: React.FC<PlannerHeaderProps> = ({
    darkTheme = false,
    layout = ['TimelineWidget', 'SymbolBlock'],
}) => {
    const widgetComponents: Record<
        string,
        React.ComponentType<{ darkTheme?: boolean }>
    > = {
        PomodoroWidget,
        TimelineWidget,
        SymbolBlock,
    };

    const renderWidgets = (
        names: string[] = [],
    ): (React.ReactElement | null)[] =>
        names.map((name) => {
            const Widget = widgetComponents[name];
            return Widget ? <Widget key={name} darkTheme={darkTheme} /> : null;
        });

    return (
        <div className={`bg-background p-4 relative`}>
            {layout?.length > 0 ? (
                <div className="flex flex-wrap justify-between items-center px-4 md:pt-10 md:pb-9">
                    <TimeWidget />
                    <div className="hidden md:ml-4 md:flex flex-1 flex-wrap items-center justify-end ">
                        {renderWidgets(layout)}
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
