import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Image } from 'react-native'
import React, { useState } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Button from '../../components/button'
import { onGoogleButtonPress } from '../../utilities/GoogleSignIn'
import TextInput from '../../components/textInput'
import { getUser, saveUser } from '../../redux/slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { rdb } from '../../firebase/firebaseInit'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppDispatch } from '../../redux/store'
import { Avatars } from '../../entity/types'
import { iconColor, darkerColor, lightColor } from '../../utilities/colors'

const CreateAccount = () => {

  const [creating, setCreating] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState<Avatars>('male_1')
  const disptch = useDispatch<AppDispatch>();

  const user = useSelector(getUser)
  const nav: any = useNavigation();

  function createAccountProcess() {
    console.log('create accnt process', user)
    if (displayName.length >= 5) {
      setCreating(true);
      rdb.ref('users/' + user.user.email.replaceAll("@", "_").replaceAll(".", "_")).set({
        email: user.user.email,
        displayName: displayName,
        avatar: avatar,
      }).then(d => {
        setCreating(false);
        nav.navigate('Home');
        AsyncStorage.setItem('email', user.user.email);
        disptch(saveUser({
          email: user.user.email + "",
          displayName: displayName,
          avatar: avatar
        }))
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
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <TextInput placeholder='Display Name' onChangeText={(v) => {
          setDisplayName(v);
        }} />
        <Text style={{ marginTop: 20, color: iconColor, fontWeight: '600' }}>Select an avatar</Text>
        <View>
          <View style={{ flexDirection: 'row', paddingTop: 20 }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { setAvatar('male_1') }}>
              <View style={[styles.avatarBordered,
              {
                borderWidth: (avatar == 'male_1') ? 2 : 0,
              }
              ]}>
                <Image style={{ width: 100, height: 100 }} source={require('../../resources/images/male_1.png')} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { setAvatar('female_1') }}>
              <View style={[styles.avatarBordered,
              {
                borderWidth: (avatar == 'female_1') ? 2 : 0,
              }
              ]}>
                <Image style={{ width: 100, height: 100 }} source={require('../../resources/images/female_1.png')} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { setAvatar('male_2') }}>
              <View style={[styles.avatarBordered,
              {
                borderWidth: (avatar == 'male_2') ? 2 : 0,
              }
              ]}>
                <Image style={{ width: 100, height: 100 }} source={require('../../resources/images/male_2.png')} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', paddingVertical: 20 }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { setAvatar('female_2') }}>
              <View style={[styles.avatarBordered,
              {
                borderWidth: (avatar == 'female_2') ? 2 : 0,
              }
              ]}>
                <Image style={{ width: 100, height: 100 }} source={require('../../resources/images/female_2.png')} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { setAvatar('male_3') }}>
              <View style={[styles.avatarBordered,
              {
                borderWidth: (avatar == 'male_3') ? 2 : 0,
              }
              ]}>
                <Image style={{ width: 100, height: 100 }} source={require('../../resources/images/male_3.png')} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { setAvatar('female_3') }}>
              <View style={[styles.avatarBordered,
              {
                borderWidth: (avatar == 'female_3') ? 2 : 0,
              }
              ]}>
                <Image style={{ width: 100, height: 100 }} source={require('../../resources/images/female_3.png')} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: darkerColor,
    height: 45,
    width: '80%',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 40
  },
  avatarBordered: {
    borderRadius: 500,
    borderColor: iconColor,
    width: 110, height: 110,
    alignItems: 'center',
    justifyContent: 'center'
  },
})