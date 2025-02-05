import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/base'
import { darkerColor, lightColor } from '../../utilities/colors'

type Props = {
  title: string,
  onPress: () => void,
  marginBottom?: number,
  marginHorizontal?: number,
  marginTop?: number,
  dark?: boolean,
  loading?: boolean,
  icon?: {
    name: string,
    type: string
  }
}

const Button = (p: Props) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => {
      if (!p.loading) {
        p.onPress();
      }
    }} style={[styles.loginButton, {
      backgroundColor: (p.dark) ? darkerColor : lightColor,
      marginBottom: (p.marginBottom) ? p.marginBottom : 0,
      marginHorizontal: (p.marginHorizontal) ? p.marginHorizontal : 0,
    }]}>
      {
        (p.loading) ?
          <ActivityIndicator />
          :
          <View style={styles.textContainer}>
            {
              (p.icon) &&
              <Icon size={20} color={(p.dark) ? lightColor : darkerColor} name={p.icon.name} type={p.icon.type} style={{ marginRight: 10 }} />
            }
            <Text style={{ color: (p.dark) ? lightColor : darkerColor, fontSize: 16, textAlign: 'center' }}>{p.title}</Text>
          </View>
      }
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: lightColor,
    height: 45,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})