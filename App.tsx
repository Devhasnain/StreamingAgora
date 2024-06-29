import React from 'react';
import {Provider} from 'react-redux';
import store from './redux/store';
import {SocketProvider} from './contextapi/SocketIoContext';
import AppThemeProvider from './components/ThemeProvider';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import StackNavigations from './navigations/StackNavigations';

const App = () => {
  return (
    <React.Fragment>
      <Provider store={store}>
        <SocketProvider>
            <AppThemeProvider>
              <SafeAreaProvider>
                <StackNavigations />
              </SafeAreaProvider>
            </AppThemeProvider>
        </SocketProvider>
      </Provider>
    </React.Fragment>
  );
};

export default App;
