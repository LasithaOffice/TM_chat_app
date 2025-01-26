import { View, Text, useWindowDimensions, Animated, TouchableOpacity, Vibration } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/login';
import CreateAccount from '../screens/createAccount';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Home from '../screens/home';
import VoiceCall from '../screens/voiceCall';
import VideoCall from '../screens/videoCall';
import VPreview from '../screens/videoCall/preview';
import Avatar from '../components/avatar';
import { Icon } from '@rneui/base';
import { useSelector } from 'react-redux';
import { getUser } from '../redux/slices/userSlice';
import { rdb } from '../firebase/firebaseInit';
import { CallObject } from '../entity/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {

  const { width, height } = useWindowDimensions();

  const a = new Animated.Value((height + 20) * 10 / 10);
  const gap = useSafeAreaInsets();

  function callComes() {
    Animated.spring(a, {
      speed: 10,
      toValue: (height - 40 + gap.bottom) * 9 / 10,
      useNativeDriver: true,
    }).start();
  }

  function callEnds() {
    Animated.spring(a, {
      speed: 10,
      toValue: (height + 20) * 10 / 10,
      useNativeDriver: true,
    }).start();
    rdb.ref('/calls/' + user.user.email.replaceAll("@", "_").replaceAll(".", "_"))
      .set({
        status: "ended"
      })
    // rdb.ref('/calls/' + user.user.email.replaceAll("@", "_").replaceAll(".", "_"))
    //       .on('value', snapshot => {
    //         console.log('Call data: ', snapshot.val());
    //         const call: CallObject = snapshot.val() as CallObject;
    //         if (call) {
    //           if (call.status == 'incoming') {
    //             setCallerName(call.callerName)
    //             Vibration.vibrate(PATTERN, true)
    //             callComes();
    //           } else if (call.status == 'ended') {
    //             callEnds();
    //             Vibration.cancel();
    //           }
    //         }
    //       });
  }

  const user = useSelector(getUser);
  const callRef = useRef<any>();

  const [callerName, setCallerName] = useState("");

  const PATTERN = [
    1 * 1000,
    2 * 1000,
    3 * 1000,
  ];

  useEffect(() => {
    if (user) {
      if (user.user.displayName) {
        console.log()
        callRef.current = rdb.ref('/calls/' + user.user.email.replaceAll("@", "_").replaceAll(".", "_"))
          .on('value', snapshot => {
            console.log('Call data: ', snapshot.val());
            const call: CallObject = snapshot.val() as CallObject;
            if (call) {
              if (call.status == 'incoming') {
                setCallerName(call.callerName)
                Vibration.vibrate(PATTERN, true)
                callComes();
              } else if (call.status == 'ended') {
                callEnds();
                Vibration.cancel();
              }
            }
          });
      }
    }
    return () => {
      rdb.ref('/calls/' + user.user.email.replaceAll("@", "_").replaceAll(".", "_")).off('value', callRef.current);
    }
  }, [user])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Login' component={Login} options={
          {
            headerShown: false
          }
        } />
        <Stack.Screen name='CreateAccount' component={CreateAccount} options={
          {
            title: "Create Account",
            headerStyle: {
              backgroundColor: '#111',
            },
            statusBarBackgroundColor: '#111',
            headerTintColor: '#fff'
          }
        } />
        <Stack.Screen name='Home' component={Home} options={
          {
            headerShown: false
          }
        } />
        <Stack.Screen name='VoiceCall' component={VoiceCall} options={
          {
            headerShown: false
          }
        } />
        <Stack.Screen name='VideoCall' component={VideoCall} options={
          {
            headerShown: false
          }
        } />
        <Stack.Screen name='VPreview' component={VPreview} options={
          {
            headerShown: false
          }
        } />
      </Stack.Navigator>
      <View style={{ position: 'absolute', }}>
        <Animated.View style={{
          width: width - 20,
          height: height / 10,
          backgroundColor: '#111',
          position: 'absolute',
          zIndex: 9999,
          borderRadius: 10,
          left: 10,
          //top: a,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 20,
          transform: [{
            translateY: a
          }],
        }}>
          <Avatar avt='female_1' />
          <Text style={{ color: '#fff', marginLeft: 10, fontSize: 16, flex: 1 }}> {"PP is calling"}</Text>
          <TouchableOpacity onPress={callComes} style={{
            width: 40, height: 40,
            backgroundColor: 'red', borderRadius: 100,
            justifyContent: 'center', alignItems: 'center',
            marginRight: 10
          }}>
            <Icon size={30} color={'#fff'} name='phone' type='font-awesome' />
          </TouchableOpacity>
          <TouchableOpacity onPress={callEnds} style={{
            width: 40, height: 40,
            backgroundColor: '#444', borderRadius: 100,
            justifyContent: 'center', alignItems: 'center'
          }}>
            <Icon size={35} color={'#fff'} name='cross' type='entypo' />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </NavigationContainer>
  )
}

export default MainNavigation