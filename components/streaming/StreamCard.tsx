import {TouchableOpacity, View} from 'react-native';
import React, {useRef} from 'react';
import styles from '../../styles/ui.styles';
import {Avatar, Text} from '@rneui/themed';
import Video, {VideoRef} from 'react-native-video';

const StreamCard = () => {
  const {flex, flexRow, alignCenter, justifyBetween, sX_7} = styles();
  const videoRef = useRef<VideoRef>(null);
  const background = require('../../assets/vid.mp4');
  return (
    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor:"#ccc", padding:15, borderRadius:15}}>
      <View
        style={[
          flex,
          flexRow,
          alignCenter,
          justifyBetween,
          {position: 'relative'},
        ]}>
        {/* <Video
          ref={videoRef}
          source={background}
          style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
        /> */}
        <View style={[flex, flexRow, alignCenter, sX_7]}>
          <Avatar
            size={40}
            rounded
            title={'T'}
            containerStyle={{backgroundColor: 'blue'}}
          />
          <View>
            <Text>User name</Text>
          </View>
        </View>
      </View>

      <View style={{height:250}}></View>

    </TouchableOpacity>
  );
};

export default StreamCard;
