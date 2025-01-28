import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { lightColor } from '../../utilities/colors'

const LoadingContainer = () => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
      <ActivityIndicator style={{ marginRight: 10 }} />
      <Text style={{ textAlign: 'center', color: lightColor }}>Loading...</Text>
    </View>
  )
}

export default LoadingContainer