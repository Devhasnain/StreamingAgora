// context/SocketContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from 'react';
import {useSelector} from 'react-redux';
import {io, Socket} from 'socket.io-client';
import {RootState} from '../redux/store';

const SOCKET_URL = 'http://192.168.100.38:3001';

// let getToken = async () => {
//   let a  = await  AsyncStorage.getItem("token");

//   if(a){
//     return JSON.parse(a)
//   }else{
//     return null
//   }
// };

// const socket: Socket = io(SOCKET_URL, { query: { token: getToken() } });

interface SocketContextProps {
  socket: Socket | any;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}
export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
  const [isConnected, setIsConnected] = useState(false);
  const {user} = useSelector((state: RootState) => state.authSlice);

  const socketRef = useRef<Socket>();

  const connectToSocket = async () => {
    try {
      let token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('');
      }
      socketRef.current = io(SOCKET_URL, {
        query: {
          token: JSON.parse(token),
        },
      });

      socketRef.current.emit('connected', {
        userId: user?._id,
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (user) {
      connectToSocket();
    }
    return () => {
      socketRef?.current?.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{socket: socketRef}}>
      {children}
    </SocketContext.Provider>
  );
};
