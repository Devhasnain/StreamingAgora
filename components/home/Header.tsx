import { View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import styles from '../../styles/ui.styles'
import { Avatar, SearchBar, Text } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const Header = () => {
    const { flex, flexRow, alignCenter } = styles();
    const { user } = useSelector((state: RootState) => state.authSlice);
    const [search, setSearch] = useState("");

    return (
        <>
            <TouchableOpacity style={[flex, flexRow, alignCenter, { gap: 7, paddingTop: 10, paddingBottom: 10 }]}>
                <Avatar
                    size={45}
                    rounded
                    title={user?.name[0]}
                    containerStyle={{ backgroundColor: "blue" }}
                />
                <View>
                    <Text style={{ fontSize: 18 }}>{user?.name}</Text>
                    <Text>{user?.email}</Text>
                </View>
            </TouchableOpacity>
            <SearchBar cursorColor={"black"} value={search} onChangeText={(e) => { setSearch(e) }} containerStyle={{ marginHorizontal: 0, paddingHorizontal: 0, marginVertical: 0, backgroundColor: "transparent", borderBottomWidth: 0, borderTopWidth: 0 }} inputContainerStyle={{ paddingVertical: 0, marginVertical: 0 }} round style={{ color: "black" }} placeholder='Search...' />
        </>
    )
}

export default Header