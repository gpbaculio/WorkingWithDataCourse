import React, {useEffect, useRef, useState} from 'react';
import {Text, Switch, Alert} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {DynamicText, DynamicView} from 'src/components';

type Preferences = {
  pushNotifications: boolean;
  emailMarketing: boolean;
  latestNews: boolean;
};

const Challenge = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    pushNotifications: false,
    emailMarketing: false,
    latestNews: false,
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    const getStoragePreferences = async () => {
      const values = await AsyncStorage.multiGet(Object.keys(preferences));

      const initialState = values.reduce(
        (acc, curr) => {
          // Every item in the values array is itself an array with a string key and a stringified value, i.e ['pushNotifications', 'false']
          acc[curr[0] as keyof Preferences] = JSON.parse(curr[1] as string);
          return acc;
        },
        {pushNotifications: false, emailMarketing: false, latestNews: false},
      );
      setPreferences(initialState);
    };

    getStoragePreferences();
  }, []);

  useEffect(() => {
    const handlePrefencesUpdates = async () => {
      const keyValues = Object.entries(preferences).map(entry => {
        return [entry[0], String(entry[1])];
      });

      try {
        await AsyncStorage.multiSet(keyValues as [string, string][]);
      } catch (e) {
        Alert.alert(`An error occurred: ${e}`);
      }
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      handlePrefencesUpdates();
    }
  }, [preferences]);

  const updateState = (key: keyof Preferences) => () => {
    setPreferences(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <DynamicView variant="container" bg="#ecf0f1" paddingHorizontal="m">
      <DynamicText
        margin="xxL"
        pt="m"
        fontSize={18}
        fontWeight="bold"
        textAlign="center">
        Account Preferences
      </DynamicText>
      <DynamicView
        flexDirection="row"
        justifyContent="space-between"
        paddingVertical="l">
        <Text>Push notifications</Text>
        <Switch
          value={preferences.pushNotifications}
          onValueChange={updateState('pushNotifications')}
        />
      </DynamicView>
      <DynamicView
        flexDirection="row"
        justifyContent="space-between"
        paddingVertical="l">
        <Text>Marketing emails</Text>
        <Switch
          value={preferences.emailMarketing}
          onValueChange={updateState('emailMarketing')}
        />
      </DynamicView>
      <DynamicView
        flexDirection="row"
        justifyContent="space-between"
        paddingVertical="l">
        <Text>Latest news</Text>
        <Switch
          value={preferences.latestNews}
          onValueChange={updateState('latestNews')}
        />
      </DynamicView>
    </DynamicView>
  );
};

export default Challenge;
