import {View, Text} from 'react-native';
import React from 'react';

const useLogData = (data: any) => {
  const logData = JSON.stringify(data, null, 2);
  console.log('data', logData);
};

export default useLogData;
