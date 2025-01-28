import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Button from '../../components/button'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { lightColor } from '../../utilities/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const Settings = () => {

  const nav: any = useNavigation();

  const [logginOut, setLogginOut] = useState(false);

  function signOut() {
    setLogginOut(true);
    AsyncStorage.removeItem('email');
    GoogleSignin.signOut().then(r => {
      setLogginOut(false);
      nav.replace("Login");
    })
  }

  return (
    <View style={styles.container}>
      <Button loading={logginOut} onPress={signOut} title='sign out' dark icon={
        {
          name: "logout",
          type: "antdesign"
        }
      } />
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darker,
    padding: 10
  },
  mainHeader: {
    fontSize: 40,
    fontWeight: '600',
    marginLeft: 10,
    color: lightColor
  },
  uname: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 10,
    color: '#aaa'
  },
})