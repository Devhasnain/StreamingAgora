import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import Header from '../components/conversation/Header';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../styles/ui.styles';
import {Button, Divider} from '@rneui/themed';
import MessageCard from '../components/conversation/MessageCard';
import axios from 'axios';
import configurations from '../configurations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSocket} from '../contextapi/SocketIoContext';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import Feather from 'react-native-vector-icons/Feather';

type Props = {
  route: {
    params: {
      _id: string;
      name: string;
      email: string;
    };
  };
};

type Message = {
  _id: string;
  content: string;
  sender: {
    _id: string;
    email: string;
    name: string;
  };
  timestamp: Date;
};

const Conversation = ({route}: any) => {
  let params = route?.params;
  let {flex, flex1, flexCol, flexRow, alignCenter, justifyCenter} = styles();
  let {socket} = useSocket();
  let {user} = useSelector((state: RootState) => state.authSlice);
  let scrollRef = useRef<any>();
  let [text, setText] = useState('');
  let [messages, setMessages] = useState<Message[] | []>([]);
  let [loading, setLoading] = useState(false);
  let [IsError, setIsError] = useState({
    error: false,
    msg: '',
  });
  let [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!messages?.length) {
      fetchConversation();
    }
  }, [route]);

  useEffect(() => {
    scrollRef?.current?.scrollToEnd({animated: true});
  }, []);

  useEffect(() => {
    socket?.current?.on('message-delivered', (data: any) => {
      setMessages(pre => [...pre, data]);
    });

    socket?.current?.on('new-message', (data: any) => {
      setMessages(pre => [...pre, data]);
    });
  }, []);

  let SetInputRows = (val: number) => {
    if (val > 500) {
      return 8;
    } else if (val > 400) {
      return 7;
    } else if (val > 300) {
      return 6;
    } else if (val > 220) {
      return 5;
    } else if (val > 159) {
      return 4;
    } else if (val > 106) {
      return 3;
    } else if (val > 53) {
      return 2;
    } else {
      return 1;
    }
  };

  let fetchConversation = async () => {
    try {
      setLoading(true);
      let token = (await AsyncStorage.getItem('token')) ?? '';
      let res = await axios.get(
        `${configurations.keys.backend_url}/api/get/chat/${params?._id}`,
        {headers: {Authorization: JSON.parse(token)}},
      );
      setMessages(res.data.conversation?.messages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError({
        error: true,
        msg: 'Unexpected error occurred, Failed to load the conversation.',
      });
    }
  };

  let onSendMessage = () => {
    try {
      if (!text.trim().length) {
        return;
      }

      setIsSending(true);
      socket.current.emit('send-message', {
        from: user?._id,
        to: params?._id,
        content: text,
      });

      setIsSending(false);
      setText('');
    } catch (error) {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={[{marginHorizontal: 12}, flex1]}>
      <Header params={params} />
      <Divider />
      <View
        style={[flex, flexCol, flex1, {borderColor: 'black', borderWidth: 0}]}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{paddingVertical: 10, gap: 15}}
          showsVerticalScrollIndicator={false}>
          {loading ? (
            <ActivityIndicator size={40} color={'black'} />
          ) : !loading && IsError.error ? (
            <Text>Unable to load the conversation!</Text>
          ) : !loading && messages?.length ? (
            messages.map((item, index) => (
              <Fragment key={index}>
                <MessageCard message={item} />
              </Fragment>
            ))
          ) : (
            ''
          )}
        </ScrollView>

        <View
          style={[
            flex,
            flexRow,
            {
              gap: 8,
              borderColor: 'black',
              borderWidth: 0,
              marginBottom: 10,
              alignItems: text?.length > 50 ? 'flex-end' : 'center',
            },
          ]}>
          <TextInput
            onFocus={() => {
              scrollRef?.current?.scrollToEnd({animated: true});
            }}
            style={{
              backgroundColor: '#ccc',
              paddingVertical: 8,
              paddingHorizontal: 8,
              flex: 1,
              borderRadius: 5,
              color: 'black',
            }}
            value={text}
            placeholderTextColor={'black'}
            onChangeText={e => setText(e)}
            placeholder="Send a message"
            cursorColor={'black'}
            multiline={true}
            numberOfLines={SetInputRows(text.length)}
          />
          <Button
            onPress={onSendMessage}
            loading={isSending}
            disabledStyle={{backgroundColor: '#ccc'}}
            disabledTitleStyle={{color: 'black'}}
            disabled={isSending || !text.trim().length ? true : false}
            radius={8}
            style={[
              {
                backgroundColor: 'blue',
                width: 38,
                borderRadius: 10,
              },
              flex,
              flexCol,
              alignCenter,
              justifyCenter,
            ]}
            icon={
              <Feather name="send" color={isSending ? 'white' : 'black'} size={25} />
            }></Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Conversation;
