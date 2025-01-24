import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'

type Props = {
  title: string,
  onPress: () => void,
  marginBottom?: number,
  marginTop?: number,
  dark?: boolean,
  loading?: boolean
}

const Button = (p: Props) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={p.onPress} style={[styles.loginButton, {
      backgroundColor: (p.dark) ? '#111' : '#ddd',
      marginBottom: (p.marginBottom) ? p.marginBottom : 0
    }]}>
      {
        (p.loading) ?
          <ActivityIndicator />
          :
          <Text style={{ color: '#000', fontSize: 16, textAlign: 'center' }}>{p.title}</Text>
      }
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: '#ddd',
    height: 45,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
  }
})