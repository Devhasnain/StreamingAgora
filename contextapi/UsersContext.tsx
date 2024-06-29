import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import configurations from "../configurations";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserContextProps {
  users:
    | {
        _id: string;
        name: string;
        email: string;
      }[]
    | [];
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUserContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}
export const UserContextProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState([]);

  const connectToSocket = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      if(!token){
        return
      }
      let res = await axios.get(`${configurations.keys.backend_url}/api/users`, {headers:{Authorization:JSON.parse(token)}});

      setUsers(res.data.users);
    } catch (error) {}
  };

  useEffect(() => {
    if (!users.length) {
      connectToSocket();
    }
  }, []);

  return (
    <UserContext.Provider value={{ users: users }}>
      {children}
    </UserContext.Provider>
  );
};
