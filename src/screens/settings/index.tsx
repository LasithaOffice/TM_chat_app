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
    GoogleSignin.configure({
      webClientId: '432700589651-ho1ope7d0o8hpbq32q6oildoi20gm6ev.apps.googleusercontent.com',
    });
    GoogleSignin.signOut().then(r => {
      setLogginOut(false);
      AsyncStorage.removeItem('email');
      nav.replace("Login");
    }).catch(e => {
      console.log("errrrr ", e)
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