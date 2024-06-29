import { View } from "react-native";
import React from "react";
import styles from "../../styles/ui.styles";
import { Avatar, Text } from "@rneui/themed";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { timeAgo } from "../../libs/TimeAgo";

type Props = {
  message: {
    _id: string;
    content: string;
    sender: {
      _id: string;
      email: string;
      name: string;
    };
    timestamp: Date;
  };
};

const MessageCard = ({ message }: Props) => {
  const { flex, flexRow, alignCenter, sX_7, sX_5 } = styles();
  const { user } = useSelector((state: RootState) => state.authSlice);
  return (
    <View style={[flex, flexRow, alignCenter]}>
      {user?._id === message?.sender._id ? (
        <View
          style={[
            flex,
            flexRow,
            sX_5,
            {
              alignItems: "flex-end",
              width: "100%",
              justifyContent: "flex-end",
            },
          ]}
        >
          <View style={{maxWidth:300}}>
            <View
              style={{
                backgroundColor: "#ccc",
                width: "auto",
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text>{message?.content}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 11, textAlign: "right" }}>
                {timeAgo(message?.timestamp)}
              </Text>
            </View>
          </View>
          <Avatar
            size={20}
            rounded
            title={message?.sender?.name[0]}
            titleStyle={{ color: "white" }}
            containerStyle={{ backgroundColor: "blue", marginBottom: 15 }}
          />
        </View>
      ) : (
        <View
          style={[
            flex,
            flexRow,
            sX_5,
            { alignItems: "flex-end", width: "100%" },
          ]}
        >
          <Avatar
            size={20}
            rounded
            title={message?.sender?.name[0]}
            titleStyle={{ color: "white" }}
            containerStyle={{ backgroundColor: "blue", marginBottom: 15 }}
          />
          <View style={{maxWidth:300}}>
            <View
              style={{ backgroundColor: "#ccc", padding: 10, borderRadius: 8 }}
            >
              <Text>{message?.content}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 11 }}>
                {timeAgo(message?.timestamp)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MessageCard;
