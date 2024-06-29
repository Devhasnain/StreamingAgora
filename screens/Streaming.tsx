import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../styles/ui.styles';
import createAgoraRtcEngine, {
  AudienceLatencyLevelType,
  ChannelProfileType,
  ClientRoleType,
  DegradationPreference,
  IRtcEngine,
  OrientationMode,
  RtcSurfaceView,
  VideoCodecType,
  VideoMirrorModeType,
} from 'react-native-agora';
import {
  PermissionsAndroid,
  Dimensions,
  Platform,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {generateValidChannelName} from './CallScreen';
import configurations from '../configurations';
import {BottomSheet, Button, Text} from '@rneui/themed';
import AgoraUIKit from 'agora-rn-uikit';
import Feather from 'react-native-vector-icons/Feather';

const {width, height} = Dimensions.get('window');
const agoraVideoConfig = {
  codecType: VideoCodecType.VideoCodecH264,
  dimensions: {
    width: 640,
    height: 360,
  },
  frameRate: 15,
  bitrate: 0,
  minBitrate: -1,
  orientationMode: OrientationMode.OrientationModeAdaptive,
  degradationPreference: DegradationPreference.MaintainQuality,
  mirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
};

const Streaming = ({route, navigation}: any) => {
  const {flex} = styles();
  let params = route?.params;

  const agoraEngineRef = useRef<IRtcEngine>();
  const [callDuration, setCallDuration] = useState(0);
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const uid = Math.floor(Math.random() * 10000);
  const [localVideoReady, setLocalVideoReady] = useState(false);
  let channelName = params?.channelName ?? generateValidChannelName();

  const setupVideoSDKEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await getPermission();
      }
      const agoraEngine = createAgoraRtcEngine();
      agoraEngineRef.current = agoraEngine;

      agoraEngine.initialize({
        appId: configurations.agora.appId,
      });

      agoraEngine.enableAudio();
      agoraEngine.enableVideo();
      agoraEngine.setEnableSpeakerphone(true);
      agoraEngine.muteLocalAudioStream(false);
      agoraEngine.setVideoEncoderConfiguration(agoraVideoConfig);

      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          setIsStreamStarted(true);
          console.log('stream started');
        },
        onUserJoined: (_connection, Uid) => {
          startCallTimer();
          console.log(Uid, 'new user joined');
        },
        onUserOffline: (_connection, Uid) => {
          console.log(Uid, 'user is offline');
        },
        onLeaveChannel: _connection => {
          console.log('channel leaved');
          EndCall();
        },
        onError: (err, msg) => {
          console.log(err, msg, 'here is the error');
          EndCall();
        },
        onLocalVideoStateChanged: (state, error) => {
          console.log(
            'Local Video State Changed',
            'State =',
            state,
            'Error =',
            error,
          );
          // if (state === 3) {
          //   setLocalVideoReady(true);
          // } else if (state === 0 && error === 2) {
          //   console.error(
          //     'Local video state error: Camera permission not granted or camera not accessible',
          //   );
          // }
        },
      });

      startStream();
    } catch (e) {
      console.log(e, 'initial call error');
      EndCall();
    }
  };

  const startStream = async () => {
    try {
      const agoraEngine = agoraEngineRef.current;
      if (!agoraEngine) return;

      agoraEngine.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );

      const clientRoleType = params?.incoming
        ? ClientRoleType.ClientRoleAudience
        : ClientRoleType.ClientRoleBroadcaster;
      const audienceLatencyLevel = params?.incoming
        ? AudienceLatencyLevelType.AudienceLatencyLevelUltraLowLatency
        : AudienceLatencyLevelType.AudienceLatencyLevelLowLatency;

      agoraEngine.joinChannel('', channelName, uid, {
        clientRoleType,
        audienceLatencyLevel,
      });

      agoraEngine.startPreview();
    } catch (error) {
      console.log(error, 'start call error');
    }
  };

  const EndCall = () => {
    try {
      setIsStreamStarted(false);
      const agoraEngine = agoraEngineRef.current;
      if (agoraEngine) {
        agoraEngine.leaveChannel();
        agoraEngine.release();
        agoraEngine.stopPreview();
      }
      navigation.navigate('Explore');
    } catch (e) {
      console.log(e, 'end call error');
    }
  };

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

  console.log(channelName)

  return (
    <>
      <AgoraUIKit
        rtcCallbacks={{
          JoinChannelSuccess: () => {
            console.log('stream started');
          },
          UserJoined: () => {
            console.log('user joined');
          },
          EndCall: () => {
            navigation.navigate('Explore');
          },
        }}
        connectionData={{
          appId: configurations?.agora?.appId,
          channel: channelName,
        }}
      />
    </>
  );
};

export const getPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  }
};

export default Streaming;
