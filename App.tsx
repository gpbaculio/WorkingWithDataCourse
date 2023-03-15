import React from 'react';

import 'src/Challenge/sqliteDb';

import {AppContainer} from 'src/components';
import Challenge from 'src/Challenge';

const App = () => {
  return (
    <AppContainer>
      <Challenge />
    </AppContainer>
  );
};

export default App;
