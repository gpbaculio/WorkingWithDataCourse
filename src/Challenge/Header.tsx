import React from 'react';
import {Platform} from 'react-native';

import {DynamicText, DynamicView} from 'src/components';

const Header = () => {
  return (
    <DynamicView
      pt={Platform.OS === 'ios' ? 'xL' : undefined}
      variant="center"
      backgroundColor="#f5f5f5">
      <DynamicText pt="xL" pb="l" color="#495E57" fontSize={24}>
        Little Lemon Menu
      </DynamicText>
    </DynamicView>
  );
};

export default Header;
