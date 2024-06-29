import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {Alert} from 'react-native';
import axios from 'axios';
import configurations from '../configurations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {NavigationContainerRef} from '@react-navigation/native';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

const NotificationProvider = ({children}: {children: React.ReactNode}) => {
  const {user} = useSelector((state: RootState) => state.authSlice);

  const setDeviceToken = async () => {
    try {
      const token = await messaging().getToken();
      let authToken = (await AsyncStorage.getItem('token')) ?? '';
      await axios.put(
        `${configurations.keys.backend_url}/api/set-device-token`,
        {token},
        {headers: {Authorization: JSON.parse(authToken)}},
      );
    } catch (error) {}
  };

  useEffect(() => {
    if (user) {
      requestUserPermission();

      setDeviceToken();

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        try {
          PushNotification.localNotification({
            channelId: 'default-channel-id',
            title: remoteMessage?.notification?.title,
            message: remoteMessage?.notification?.body ?? '',
            actions: ['Accept', 'Decline'],
            invokeApp: false,
            vibrate: true,
            importance: 'default',
          });
        } catch (error) {
          console.log(error);
        }
      });

      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );
          }
        });

      const unsubscribe = messaging().onMessage(async remoteMessage => {
        let data = remoteMessage.data;
        try {
          if (data?.type === 'call') {
            if (data?.callType === 'incoming') {
              navigationRef?.current?.navigate('CallScreen', {
                ...data,
                incoming: true,
                sentTime: remoteMessage.sentTime,
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      });

      return unsubscribe;
    }
  }, [user]);

  return <>{children}</>;
};

export default NotificationProvider;
