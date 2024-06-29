import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
import BottomTabNavigations from './BottomTabNavigations';
import SignUp from '../screens/auth/SignUp';
import configurations from '../configurations';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {setUser} from '../redux/reducers/authSlice';
import LoadingScreen from '../components/LoadingScreen';
import Conversation from '../screens/Conversation';
import CallScreen from '../screens/CallScreen';
import NotificationProvider, {
  navigationRef,
} from '../components/NotificationProvider';
import Streaming from '../screens/Streaming';

const Stack = createNativeStackNavigator();

const StackNavigations = () => {
  const {user} = useSelector((state: RootState) => state.authSlice);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const AuthenticateUser = async () => {
    try {
      setLoading(true);

      if (user) {
        return;
      }

      let token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('');
      }

      console.log(token);

      let res = await axios.get(
        `${configurations.keys.backend_url}/api/refresh`,
        {headers: {Authorization: JSON.parse(token)}},
      );
      console.log(res.data);
      dispatch(setUser(res.data.user));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      await AsyncStorage.removeItem('token');
    }
  };

  useEffect(() => {
    if (!user) {
      AuthenticateUser();
    }
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <NotificationProvider>
        <Stack.Navigator>
          {loading ? (
            <>
              <Stack.Screen
                name="Splash"
                component={LoadingScreen}
                options={configurations.StackScreenOptions}
              />
            </>
          ) : !loading && user ? (
            <>
              <Stack.Screen
                name="Main"
                component={BottomTabNavigations}
                options={configurations.StackScreenOptions}
              />
              <Stack.Screen
                name="Conversation"
                component={Conversation}
                options={configurations.StackScreenOptions}
              />
              <Stack.Screen
                name="CallScreen"
                component={CallScreen}
                options={configurations.StackScreenOptions}
              />
              <Stack.Screen
                name="Streaming"
                component={Streaming}
                options={configurations.StackScreenOptions}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={Login}
                options={configurations.StackScreenOptions}
              />
              <Stack.Screen
                name="Signup"
                component={SignUp}
                options={configurations.StackScreenOptions}
              />
            </>
          )}
        </Stack.Navigator>
      </NotificationProvider>
    </NavigationContainer>
  );
};

export default StackNavigations;
