import { ScrollView } from "react-native";
import React, { Fragment } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/home/Header";
import ConversationCard from "../components/home/ConversationCard";
import { useUserContext } from "../contextapi/UsersContext";
import JoinChannel from "../components/JoinChannel";

const Home = () => {
  const { users } = useUserContext();
  return (
    <SafeAreaView style={{ marginHorizontal: 12, flex: 1 }}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 5 }}
      >
        {users.map((item, index) => (
          <Fragment key={index}>
            <ConversationCard user={item} />
          </Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
