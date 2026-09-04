import type { PropsWithChildren } from "react";
import { HashRouter } from "react-router-dom";
import { TableWeekProvider } from "features/table/context/TableWeekContext";

export function AppProviders({
  children,
}: PropsWithChildren): React.ReactElement {
  return (
    <HashRouter>
      <TableWeekProvider>{children}</TableWeekProvider>
    </HashRouter>
  );
}
