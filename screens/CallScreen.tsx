import {useNavigation} from '@react-navigation/native';
import {Avatar, Text} from '@rneui/themed';
import React, {useRef, useState, useEffect} from 'react';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from 'react-native-agora';
import {useSocket} from '../contextapi/SocketIoContext';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import axios from 'axios';
import configurations from '../configurations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AgoraUIKit from 'agora-rn-uikit';
import {CallbacksInterface} from 'agora-rn-uikit/src/Contexts/PropsContext';

const CallScreen = ({route}: any) => {
  const params = route?.params;
  const {socket} = useSocket();
  const {user} = useSelector((state: RootState) => state.authSlice);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [message, setMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [callStarted, setCallStarted] = useState(false);
  const navigation = useNavigation<{
    navigate: (value: string, options: any) => void;
  }>();

  let channelName = params?.incoming
    ? params?.channelName
    : generateValidChannelName();

  const uid = Math.floor(Math.random() * 10000);

  const startCallTimer = () => {
    const interval = setInterval(() => {
      setCallDuration(prevDuration => prevDuration + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const formatCallDuration = () => {
    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const sendCallNotification = async () => {
    try {
      let authToken = (await AsyncStorage.getItem('token')) ?? '';
      await axios.post(
        `${configurations.keys.backend_url}/api/send-call-notification`,
        {
          receiptId: params?._id,
          channelName,
        },
        {
          headers: {
            Authorization: JSON.parse(authToken),
          },
        },
      );
    } catch (error) {}
  };

  const RtcCallBacks = {
    JoinChannelSuccess: async () => {
      try {
        await sendCallNotification();
      } catch (error) {
        navigation.navigate('Conversation', params);
      }
    },
    UserJoined: () => {
      startCallTimer();
    },
    EndCall: () => {
      navigation.navigate('Conversation', params);
    },
  };

  return (
    // <>
    // <Text>{formatCallDuration()}</Text>
      <AgoraUIKit
        settings={{
          layout: 0,
          mode: 0,
          role: channelName ? 1 : 2,
        }}
        connectionData={{
          appId: configurations.agora.appId,
          channel: channelName,
          username: user?.name,
          rtcUid: uid,
        }}
        rtcCallbacks={RtcCallBacks}
      />
    // </>
  );
};

export const getPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

export const generateValidChannelName = () => {
  return 'channel_' + Math.random().toString(36).substr(2, 15);
};

export default CallScreen;
