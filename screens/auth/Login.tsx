import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { ChangeEvent, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../../styles/global.styles'
import { Button, Input } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import configurations from '../../configurations'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { setToken } from '../../redux/reducers/authSlice'

type From = {
  email: string,
  password: string
}

const Login = () => {
  const dispatch = useDispatch();
  const { flexRow, dflex, itemsCenter, justifyCenter, flexColumn, } = styles();

  const navigaton = useNavigation<any>();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<From>({
    email: "",
    password: ""
  });

  const RedirectToSignUp = () => {
    navigaton.navigate("Signup")
  };

  const OnSubmit = async () => {
    try {
      let { email, password } = form;

      if (!email?.trim()?.length || !password?.trim()?.length) {
        throw new Error("All fields are required!.");
      }

      setLoading(true)

      let res = await axios.post(`${configurations.keys.backend_url}/api/login`, form);
      console.log(res.data)

      await AsyncStorage.setItem("token", JSON.stringify(res.data.token));
      dispatch(setToken(res.data.token));

      setLoading(false)

    } catch (error: any) {
      setLoading(false)
      Alert.alert(error?.response?.data?.msg ?? error.message)
    }
  }


  return (
    <SafeAreaView style={[{ marginHorizontal: 12 }]}>
      <ScrollView>
        <View style={[flexRow, dflex, { height: 200 }, itemsCenter, justifyCenter]}>
          <Text style={{ fontSize: 30, textAlign: "center", fontWeight: "600" }}>Logo</Text>
        </View>
        <View style={[flexColumn, { gap: 5, paddingTop: 60 }]}>
          <Input onChangeText={(e) => setForm((pre) => ({ ...pre, email: e }))} placeholder='Email address' value={form.email} textContentType="emailAddress" autoComplete="email" />
          <Input onChangeText={(e) => setForm((pre) => ({ ...pre, password: e }))} placeholder='Password' value={form.password} textContentType="password" secureTextEntry />

          <Button title={"Login"} loading={loading} disabled={loading} onPress={OnSubmit} />

          <TouchableOpacity onPress={RedirectToSignUp} >
            <Text style={{ textAlign: "center" }}>Don't have an account? </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Login