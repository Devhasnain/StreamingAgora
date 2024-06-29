import {
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React from 'react';
import styles from '../../styles/ui.styles';
import {Avatar, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

type Props = {
  params: {
    _id: string;
    name: string;
    email: string;
  };
};

const Header = ({params}: Props) => {
  const {flex, flexRow, alignCenter, justifyBetween, sX_10} = styles();
  const navigation = useNavigation<any>();

  const startAudioCall = async () => {
    navigation.navigate('CallScreen', {...params, isVideoCall: false});
  };

  const startVideoCall = async () => {
    navigation.navigate('CallScreen', {...params, isVideoCall: true});
  };

  return (
    <View
      style={[
        flex,
        flexRow,
        alignCenter,
        justifyBetween,
        {paddingTop: 5, paddingBottom: 8},
      ]}>
      <View style={[flex, flexRow, alignCenter, {gap: 15}]}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Feather name="arrow-left" color={'black'} size={20} />
        </TouchableOpacity>
        <View style={[flex, flexRow, alignCenter, sX_10]}>
          <Avatar
            size={43}
            rounded
            title={params?.name[0]}
            containerStyle={{backgroundColor: 'blue'}}
          />
          <Text style={{fontSize: 18}}>{params?.name}</Text>
        </View>
      </View>
      <View style={[flex, flexRow, alignCenter, {gap: 18}]}>
        <TouchableOpacity onPress={startAudioCall} activeOpacity={0.8}>
          <Feather name="phone" color={'black'} size={22} />
        </TouchableOpacity>
        <TouchableOpacity onPress={startVideoCall} activeOpacity={0.8}>
          <Feather name="video" color={'black'} size={26} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
