import React from 'react';
import {StyleSheet} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ThemeProvider} from '@shopify/restyle';
import {Provider} from 'react-redux';

import store from 'store';
import restyleTheme from 'restyleTheme';

import Overlay from './Overlay';

type AppContainerProps = {children: React.ReactNode};

const AppContainer = ({children}: AppContainerProps) => (
  <Provider store={store}>
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider theme={restyleTheme}>
        {children}
        <Overlay />
      </ThemeProvider>
    </GestureHandlerRootView>
  </Provider>
);

export default AppContainer;

const styles = StyleSheet.create({
  container: {flex: 1},
});
