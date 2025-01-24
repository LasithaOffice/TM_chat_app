import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Button from '../../components/button'
import { onGoogleButtonPress } from '../../utilities/GoogleSignIn'
import TextInput from '../../components/textInput'
import { getUser } from '../../redux/slices/userSlice'
import { useSelector } from 'react-redux'
import { rdb } from '../../firebase/firebaseInit'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CreateAccount = () => {

  const [creating, setCreating] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const user = useSelector(getUser)
  const nav: any = useNavigation();

  function createAccountProcess() {
    console.log('create accnt process', user)
    if (displayName.length >= 5) {
      setCreating(true);
      rdb.ref('users/' + user.user.email.replaceAll("@", "_").replaceAll(".", "_")).set({
        email: user.user.email,
        displayName: displayName
      }).then(d => {
        setCreating(false);
        nav.navigate('Home');
        AsyncStorage.setItem('email', user.user.email);
        ToastAndroid.show("You have successfully create an account!", ToastAndroid.SHORT);
      }).catch(e => {
        setCreating(false);
        ToastAndroid.show("Error creating account", ToastAndroid.SHORT);
      })
    } else {
      ToastAndroid.show("Display Name should have at least 5 characters", ToastAndroid.SHORT);
    }
  }

  return (
    <View style={styles.container}>
      {/* <Text style={{ fontSize: 40, textAlign: 'center', marginTop: 50, color: '#fff', fontWeight: '700' }}>{"Create Account"}</Text> */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <TextInput placeholder='Display Name' onChangeText={(v) => {
          setDisplayName(v);
        }} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 20 }}>
        <Button onPress={createAccountProcess} title='Create Account' marginBottom={40} loading={creating} />
      </View>
    </View>
  )
}

export default CreateAccount

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darker
  },
  loginButton: {
    backgroundColor: '#000',
    height: 45,
    width: '80%',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 40
  }
})