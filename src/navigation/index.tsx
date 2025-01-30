import { View, Text, useWindowDimensions, Animated, TouchableOpacity, Vibration, DeviceEventEmitter } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/login';
import CreateAccount from '../screens/createAccount';
import Home from '../screens/home';
import Avatar from '../components/avatar';
import { Icon } from '@rneui/base';
import { useSelector } from 'react-redux';
import { getUser } from '../redux/slices/userSlice';
import { rdb } from '../firebase/firebaseInit';
import { CallObject, ConversationObj } from '../entity/types';
import CallList from '../screens/callList';
import VoiceCall from '../screens/voiceCall';
import VideoCall from '../screens/videoCall';
import { darkerColor, iconColor, lightColor, videoColor, voiceColor } from '../utilities/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import CallHistory from '../screens/callHistory';
import Settings from '../screens/settings';
import ChatPage from '../screens/chatPage';
import ChatUserList from '../screens/chatUserList';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {

  const { width, height } = useWindowDimensions();

  const callNotificationY = useRef(new Animated.Value(height)).current;
  const messageNotificationY = useRef(new Animated.Value(-200)).current;

  function callComes() {
    console.log("call starts ", currentUser.user.displayName)
    Animated.spring(callNotificationY, {
      speed: 1,
      toValue: (height - 100),
      useNativeDriver: true,
    }).start();
  }

  function callEnds() {
    console.log("hideeeee")
    Animated.spring(callNotificationY, {
      speed: 1,
      toValue: (height),
      useNativeDriver: true,
    }).start();
  }

  const interval = useRef<any>();

  function messageComes() {
    Animated.spring(messageNotificationY, {
      speed: 1,
      toValue: 5,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      clearInterval(interval.current);
      messageEnds();
    }, 3000)
  }

  function messageEnds() {
    Animated.spring(messageNotificationY, {
      speed: 1,
      toValue: -200,
      useNativeDriver: true,
    }).start();
  }

  function endCall() {
    console.log("hideeeee")
    //ToastAndroid.show("ends", ToastAndroid.SHORT)
    Animated.spring(callNotificationY, {
      speed: 1,
      toValue: (height),
      useNativeDriver: true,
    }).start();
    Vibration.cancel();
    rdb.ref('/calls/' + currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"))
      .set({
        status: "ended",
        // callerId: callObject?.callerId
      })
  }

  const currentUser = useSelector(getUser);
  const callRef = useRef<any>();
  const chatRef = useRef<any>();
  const nav: any = useNavigation();

  const [callObject, setCallObject] = useState<CallObject | null>(null);
  const [lastMessage, setLastMessage] = useState<ConversationObj>();
  const [secondTime, setSecondTime] = useState(false);

  const PATTERN = [
    1 * 1000,
    2 * 1000,
    3 * 1000,
  ];

  function answerCall() {
    Animated.spring(callNotificationY, {
      speed: 1,
      toValue: (height),
      useNativeDriver: true,
    }).start();
    rdb.ref('/calls/' + currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"))
      .set({
        status: "incall"
      })
    if (callObject?.type == 'video') {
      nav.navigate('VideoCall', {
        callerName: callObject?.callerName,
        callerAvatar: callObject?.callerAvatar,
        callerId: callObject?.callerId,
      })
    } else {
      nav.navigate('VoiceCall', {
        callerName: callObject?.callerName,
        callerAvatar: callObject?.callerAvatar,
        callerId: callObject?.callerId,
      })
    }
  }

  useEffect(() => {
    if (currentUser) {
      if (currentUser.user.displayName) {
        //callComes();
        callRef.current = rdb.ref('/calls/' + currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"))
          .on('value', snapshot => {
            console.log('Call data: ', snapshot.val());
            const call: CallObject = snapshot.val() as CallObject;
            if (call) {
              if (call.status == 'incoming') {
                setCallObject(call);
                Vibration.vibrate(PATTERN, true)
                callComes();
              } else if (call.status == 'ended') {
                callEnds();
                Vibration.cancel();
              } else if (call.status == 'incall') {
                Vibration.cancel();
              }
            }
          });
        chatRef.current = rdb.ref('/lastMessage/' + currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"))
          .on('value', snapShot => {
            if (snapShot.exists()) {
              const msg: ConversationObj = Object.values(snapShot.val())[0] as ConversationObj;
              console.log('Current screen ', nav.getCurrentRoute().name);
              if (nav.getCurrentRoute().name != 'ChatPage') {
                setLastMessage(msg);
              }
            }
          })
      }
    }
    return () => {
      rdb.ref('/calls/' + currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_")).off('value', callRef.current);
    }
  }, [currentUser])

  useEffect(() => {
    if (lastMessage) {
      if (secondTime) {
        messageComes();
      } else {
        setSecondTime(true);
      }
    }
  }, [lastMessage])

  return (
    <>
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
              backgroundColor: darkerColor,
            },
            statusBarBackgroundColor: darkerColor,
            headerTintColor: iconColor
          }
        } />
        <Stack.Screen name='Home' component={Home} options={
          {
            // headerShown: true
            title: "TM Chats",
            headerStyle: {
              backgroundColor: darkerColor,
            },
            statusBarBackgroundColor: darkerColor,
            headerTintColor: iconColor,
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: 'bold',
            }
          }
        } />
        <Stack.Screen name='VoiceCall' component={VoiceCall} options={
          {
            headerShown: false
          }
        } />
        <Stack.Screen name='CallList' component={CallList} options={
          {
            title: "Contacts",
            statusBarBackgroundColor: darkerColor,
            headerTintColor: iconColor,
            headerStyle: {
              backgroundColor: darkerColor,
            },
          }
        } />
        <Stack.Screen name='CallHistory' component={CallHistory} options={
          {
            title: "Call History",
            statusBarBackgroundColor: darkerColor,
            headerTintColor: iconColor,
            headerStyle: {
              backgroundColor: darkerColor,
            },
          }
        } />
        <Stack.Screen name='Settings' component={Settings} options={
          {
            title: "Settings",
            statusBarBackgroundColor: darkerColor,
            headerTintColor: iconColor,
            headerStyle: {
              backgroundColor: darkerColor,
            },
          }
        } />
        <Stack.Screen name='VideoCall' component={VideoCall} options={
          {
            headerShown: false
          }
        } />
        <Stack.Screen name='ChatPage' component={ChatPage} options={
          {
            statusBarBackgroundColor: darkerColor,
            headerTintColor: iconColor,
            headerStyle: {
              backgroundColor: darkerColor,
            },
          }
        } />
        <Stack.Screen name='ChatUserList' component={ChatUserList} options={
          {
            title: "Create a new conversation",
            statusBarBackgroundColor: darkerColor,
            headerTintColor: iconColor,
            headerStyle: {
              backgroundColor: darkerColor,
            },
          }
        } />
      </Stack.Navigator>
      <View style={{
        position: 'absolute',
        backgroundColor: 'red',
        height: height,
      }}>
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
            translateY: callNotificationY,
          }],
        }}>
          {
            (callObject) &&
            <Avatar avt={callObject.callerAvatar} />
          }
          <Text style={{ color: iconColor, marginLeft: 10, fontSize: 16, flex: 1 }}> {callObject?.callerName + " is calling"}</Text>
          <TouchableOpacity onPress={answerCall} style={{
            width: 40, height: 40,
            backgroundColor: (callObject?.type == 'video') ? videoColor : voiceColor, borderRadius: 100,
            justifyContent: 'center', alignItems: 'center',
            marginRight: 10
          }}>
            {
              (callObject && callObject.type == 'video') ?
                <Icon size={20} color={iconColor} name='video' type='font-awesome-5' />
                :
                <Icon size={30} color={iconColor} name='phone' type='font-awesome' />
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={endCall} style={{
            width: 40, height: 40,
            backgroundColor: 'red', borderRadius: 100,
            justifyContent: 'center', alignItems: 'center'
          }}>
            <Icon size={35} color={iconColor} name='cross' type='entypo' />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{
          width: width - 20,
          backgroundColor: '#333',
          position: 'absolute',
          zIndex: 9999,
          borderRadius: 10,
          left: 10,
          //top: a,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 20,
          transform: [{
            translateY: messageNotificationY,
          }],
        }}>
          {
            (lastMessage) &&
            <Avatar avt={lastMessage.avatar} />
          }
          <View style={{ flex: 1, marginLeft: 10, }}>
            <Text style={{ color: lightColor, fontSize: 14 }}> {lastMessage?.displayName}</Text>
            <Text style={{ color: iconColor, fontSize: 18 }}> {lastMessage?.message}</Text>
          </View>
          {/* <TouchableOpacity onPress={answerCall} style={{
            width: 40, height: 40,
            backgroundColor: (callObject?.type == 'video') ? videoColor : voiceColor, borderRadius: 100,
            justifyContent: 'center', alignItems: 'center',
            marginRight: 10
          }}>
            {
              (callObject && callObject.type == 'video') ?
                <Icon size={20} color={iconColor} name='video' type='font-awesome-5' />
                :
                <Icon size={30} color={iconColor} name='phone' type='font-awesome' />
            }
          </TouchableOpacity> */}
        </Animated.View>

      </View>
    </>
  )
}

export default MainNavigation