import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import newThemeReducer from './store/slices/newThemeSlice';

const AllTheProviders = ({ children, store }) => {
  return <Provider store={store}>{children}</Provider>;
};

const customRender = (ui, options) => {
  const store = configureStore({
    reducer: {
      theme: newThemeReducer,
    },
  });
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} store={store} />,
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };
