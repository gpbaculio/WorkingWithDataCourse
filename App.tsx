import React from 'react';
import 'src/Challenge/sqliteDb';
import Challenge from 'src/Challenge';

import {AppContainer} from 'src/components';

const App = () => {
  return (
    <AppContainer>
      <Challenge />
    </AppContainer>
  );
};

export default App;
