import {ScrollView} from 'react-native';
import React, { Fragment } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '@rneui/themed';
import styles from '../styles/ui.styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import StreamCard from '../components/streaming/StreamCard';
import JoinChannel from '../components/JoinChannel';

const Explore = ({navigation}:any) => {
  const {flex1, gapYlg} = styles();
  return (
    <SafeAreaView style={[flex1, {paddingHorizontal: 12, backgroundColor:"white", position:"relative"}]}>
      <Button
        color={'error'}
        radius={10}
        containerStyle={{position:"absolute", top:10,right:15,zIndex:10}}
        icon={<MaterialIcon name="podcasts" color={'white'} size={23} />}
        onPress={()=>navigation?.navigate("Streaming", {channelName:"channel_705lb4nwwj"})}
      />
      <ScrollView contentContainerStyle={[gapYlg, {paddingVertical:10}]} showsVerticalScrollIndicator={false}>
        {
            [0,0,0,0,0,0,0].map((item,index)=>(
                <Fragment key={index}>
                    <StreamCard/>
                </Fragment>
            ))
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;
