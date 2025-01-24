import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Button from '../../components/button'
import { onGoogleButtonPress } from '../../utilities/GoogleSignIn'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { saveUser } from '../../redux/slices/userSlice'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { rdb } from '../../firebase/firebaseInit'

const Login = () => {

  const [isLogin, setIsLogin] = useState(false);

  const disptch = useDispatch<AppDispatch>();
  const nav: any = useNavigation();

  function loginProcess() {
    console.log('start login process')
    setIsLogin(true);
    onGoogleButtonPress().then((r) => {
      setIsLogin(false);
      console.log(r)
      if (r.user) {
        console.log(r.user.displayName)
        disptch(saveUser({
          email: r.user.email + "",
          fullname: '',
        }))
        nav.navigate('CreateAccount')
      }
    }).catch((err) => {
      console.log(err)
      setIsLogin(false);
    })
  }

  const [checking, setChecking] = useState(false);

  function userCheck() {
    setChecking(true);
    AsyncStorage.getItem('email').then((r) => {
      if (r) {
        rdb.ref('/users/' + r.replaceAll("@", "_").replaceAll(".", "_"))
          .once('value')
          .then(snapshot => {
            if (snapshot.exists()) {
              nav.navigate('Home')
            } else {
              setChecking(false);
            }
          });
      } else {
        setChecking(false);
      }
    });
  }

  useEffect(() => {
    userCheck();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40, textAlign: 'center', marginTop: 50, color: '#fff', fontWeight: '700' }}>{"TM Chat"}</Text>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 20 }}>
        {
          (checking) ?
            <ActivityIndicator style={{ marginBottom: 40 }} />
            :
            <Button onPress={loginProcess} title='Join with Google' marginBottom={40} loading={isLogin} />
        }
      </View>
    </View>
  )
}

export default Login

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