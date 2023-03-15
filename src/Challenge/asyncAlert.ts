import {Alert} from 'react-native';

type AsyncAlertParams = {
  title: string;
  message: string;
  cancelText?: string;
  okText?: string;
};

export default function asyncAlert({
  title,
  message,
  cancelText = 'Cancel',
  okText = 'OK',
}: AsyncAlertParams) {
  return new Promise(resolve => {
    Alert.alert(
      title,
      message,
      [
        {
          style: 'cancel',
          text: cancelText,
          onPress: () => {
            resolve(false);
          },
        },
        {
          text: okText,
          onPress: () => {
            resolve(true);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => resolve(false),
      },
    );
  });
}
