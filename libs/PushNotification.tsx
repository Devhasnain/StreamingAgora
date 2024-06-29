import React from 'react';
import { PushNotificationIOS } from 'react-native';
import PushNotification from 'react-native-push-notification';


PushNotification.configure({
  onRegister: function ({os,token}) {
    console.log('TOKEN:', token);
  },

  onNotification: function (notification:any) {
    console.log('NOTIFICATION:', notification);

    // Process the notification here
    if (notification.action === 'Accept') {
      // Handle accept action
    } else if (notification.action === 'Decline') {
      // Handle decline action
    }

    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: true,
});

export default PushNotification;
