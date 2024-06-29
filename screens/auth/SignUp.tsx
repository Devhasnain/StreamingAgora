import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../../styles/global.styles'
import { Button, Input } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import configurations from '../../configurations'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { setToken } from '../../redux/reducers/authSlice'

type From = {
  name: string,
  email: string,
  password: string
}

const SignUp = () => {

  const dispatch = useDispatch();

  const { flexRow, dflex, itemsCenter, justifyCenter, flexColumn, } = styles();

  const navigaton = useNavigation<any>();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<From>({
    name: "",
    email: "",
    password: ""
  });

  const RedirectToLogin = () => {
    navigaton.navigate("Login")
  };

  const OnSubmit = async () => {
    try {

      let { name, email, password } = form;

      if (!name?.trim()?.length || !email?.trim()?.length || !password?.trim()?.length) {
        throw new Error("All fields are required!.");
      }

      setLoading(true)

      let res = await axios.post(`${configurations.keys.backend_url}/api/register`, form);
      console.log(res.data);


      await AsyncStorage.setItem("token", JSON.stringify(res.data.token))
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
          <Input onChangeText={(e) => setForm((pre) => ({ ...pre, name: e }))} placeholder='Name' value={form.name} textContentType="name" autoComplete="name" />
          <Input onChangeText={(e) => setForm((pre) => ({ ...pre, email: e }))} placeholder='Email address' value={form.email} textContentType="emailAddress" autoComplete="email" />
          <Input onChangeText={(e) => setForm((pre) => ({ ...pre, password: e }))} placeholder='Password' value={form.password} textContentType="password" secureTextEntry />

          <Button title={"Sign Up"} loading={loading} disabled={loading} onPress={OnSubmit} />

          <TouchableOpacity onPress={RedirectToLogin} >
            <Text style={{ textAlign: "center" }}>Already have an account? </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp