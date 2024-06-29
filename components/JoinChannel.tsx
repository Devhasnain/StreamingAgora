import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import React, {useRef, useState} from 'react';
import createAgoraRtcEngine, {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
} from 'react-native-agora';
import configurations from '../configurations';
import {Avatar, BottomSheet, Button, Input} from '@rneui/themed';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {useNavigation} from '@react-navigation/native';
import {useSocket} from '../contextapi/SocketIoContext';

const {height} = Dimensions.get('window');

const JoinChannel = () => {
  const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
  const [channel, setChannel] = useState('');
  const {socket} = useSocket();
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const {user} = useSelector((state: RootState) => state.authSlice);
  const navigation = useNavigation<any>();

  const setupVideoSDKEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      agoraEngine.initialize({
        appId: configurations.agora.appId,
      });

      agoraEngineRef.current.enableAudio();
      agoraEngineRef.current.setEnableSpeakerphone(true);
      agoraEngineRef.current.muteLocalAudioStream(false);

      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          console.log('channel joined');
        },
        onUserJoined: (_connection, Uid) => {
          console.log('channel joined', _connection, Uid);
        },
        onUserOffline: (_connection, Uid) => {
          console.log('channel joined', _connection, Uid);
        },
      });

     
    } catch (e) {
      console.log(e);
    }
  };

  // channel_s42msv6texo

  const handleJoinCall = async () => {
    try {
      // socket.current.emit('connected', {
      //   userId: user?._id,
      // });



      setOpenBottomSheet(true);

      if (Platform.OS === 'android') {
        await getPermission();
      }

      await setupVideoSDKEngine();

      let uid = 222

      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication,
      );
      agoraEngineRef.current?.joinChannel('', "channel_l4xaw1wb49", uid, {
        clientRoleType: ClientRoleType.ClientRoleAudience,
      });
    } catch (error) {
      setOpenBottomSheet(false);
    }
  };

  // const  handleDisconnect = ()=>{
  //   socket.current.disconnect();
  // }

  const endCall = async () => {
    try {
      setOpenBottomSheet(false);

      agoraEngineRef.current?.leaveChannel();
    } catch (error) {}
  };

  return (
    <View>
      <Input
        placeholder="Channel Name"
        value={channel}
        onChangeText={e => {
          setChannel(e);
        }}
      />
      <Button title={'Connect'} onPress={handleJoinCall} />
      {/* <Button title={'Disconnect'} onPress={handleDisconnect} /> */}
      <BottomSheet
        isVisible={openBottomSheet}
        backdropStyle={{
          flex: 1,
          height,
          position: 'relative',
        }}
        containerStyle={{
          position: 'absolute',
          flex: 1,
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: height,
        }}>
        <View>
          <Avatar
            size={80}
            rounded
            titleStyle={{color: 'black'}}
            title={user?.name[0]}
            containerStyle={{backgroundColor: 'white'}}
          />
          <Text style={{textAlign: 'center'}}>{user?.name}</Text>
        </View>
        <Button
          radius={10}
          size="lg"
          containerStyle={{marginTop: 100}}
          title={'End'}
          color={'error'}
          onPress={endCall}
        />
      </BottomSheet>
    </View>
  );
};

const getPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

export default JoinChannel;
