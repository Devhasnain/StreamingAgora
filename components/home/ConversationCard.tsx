import { View, TouchableOpacity } from "react-native";
import React from "react";
import styles from "../../styles/ui.styles";
import { Avatar, Text } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

type Props = {
  user: {
    _id: string;
    name: string;
    email: string;
  };
};
const ConversationCard = ({ user }: Props) => {
  const { flex, flexRow, sX_10, alignCenter, justifyBetween } = styles();
  const navigation = useNavigation<any>();
  const handleOpenConversation = () => {
    navigation.navigate("Conversation", user);
  };
  return (
    <View
      style={[
        flex,
        flexRow,
        sX_10,
        justifyBetween,
        { borderBottomColor: "#ccc", borderBottomWidth: 0.5 },
      ]}
    >
      <TouchableOpacity
        onPress={handleOpenConversation}
        activeOpacity={0.8}
        style={[
          flex,
          flexRow,
          sX_10,
          alignCenter,
          { borderRadius: 6, paddingVertical: 10 },
        ]}
      >
        <Avatar
          size={50}
          rounded
          title={user?.name[0]}
          containerStyle={{ backgroundColor: "blue" }}
        />
        <View>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>{user?.name}</Text>
          <Text style={{ fontSize: 14 }}>Start a conversation</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ConversationCard;
