import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { TableWeekProvider } from "features/table/context/TableWeekContext";
import { store } from "app/store";

export function AppProviders({
  children,
}: PropsWithChildren): React.ReactElement {
  return (
    <Provider store={store}>
      <HashRouter>
        <TableWeekProvider>{children}</TableWeekProvider>
      </HashRouter>
    </Provider>
  );
}
