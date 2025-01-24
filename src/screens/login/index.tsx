import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const Login = () => {
  return (
    <View style={styles.container}>
      <Text>{"TMPChat"}</Text>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={{ color: '#000' }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginButton: {
    backgroundColor: 'red',
    height: 45,
    width: '100%',
    borderRadius: 10
  }
})