import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import './lang.config';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <Provider store={store}>
      <ThemeCustomization>
        <ScrollTop>
          <RouterProvider router={router} />
        </ScrollTop>
      </ThemeCustomization>
    </Provider>
  );
}
