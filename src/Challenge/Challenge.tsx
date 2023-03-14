import {Text, Switch} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DynamicText, DynamicView} from 'src/components';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const updateState = (key: keyof Preferences) => () => {
    setPreferences(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  useEffect(() => {
    const getStoragePreferences = async () => {
      const storagePreferences = await AsyncStorage.getItem('preferences');
      if (storagePreferences !== null) {
        setPreferences(JSON.parse(storagePreferences));
      }
    };

    getStoragePreferences();
  }, []);

  useEffect(() => {
    const handlePrefencesUpdates = async () => {
      await AsyncStorage.setItem(
        'preferences',
        JSON.stringify(preferences),
        e => {
          if (e) {
            console.warn(e);
          }
        },
      );
    };

    handlePrefencesUpdates();
  }, [preferences]);

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
