import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const LoadingScreen = () => {
  return (
    <View style={{
        display:"flex",
        flexDirection:"column",
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    }}>
        <ActivityIndicator size={40} color={"black"}/>
    </View>
  )
}

export default LoadingScreen