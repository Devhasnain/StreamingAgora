import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Profile from '../screens/account/Profile';
import {UserContextProvider} from '../contextapi/UsersContext';
import TabBarIcon from '../components/TabBarIcon';
import Explore from '../screens/Explore';

const Stack = createBottomTabNavigator();

const HomeNavigations = () => {
  return (
    <UserContextProvider>
      <Stack.Navigator
        screenOptions={{
          tabBarStyle: {
            height: 65,
          },
          tabBarShowLabel:false
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <TabBarIcon
                name={focused ? 'chat-bubble' : 'chat-bubble-outline'}
                size={28}
                color={'black'}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Explore"
          component={Explore}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <TabBarIcon
                name={'explore'}
                size={focused ? 30 : 28}
                color={'black'}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <TabBarIcon name={'person'} size={28} color={'black'} />
            ),
          }}
        />
      </Stack.Navigator>
    </UserContextProvider>
  );
};

export default HomeNavigations;
