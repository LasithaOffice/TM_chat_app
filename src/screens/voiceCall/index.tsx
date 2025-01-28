import { View, Text, Platform, PermissionsAndroid, StyleSheet, ActivityIndicator, ScrollView, FlatList, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcConnection,
  IRtcEngineEventHandler,
} from 'react-native-agora';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Button from '../../components/button';
import { rdb } from '../../firebase/firebaseInit';
import { loadAllUsers } from '../../utilities/CommonFunction';
import { getUser, User } from '../../redux/slices/userSlice';
import UserCard from '../../components/userCard';
import { useSelector } from 'react-redux';
import Avatar from '../../components/avatar';
import { Icon } from '@rneui/base';
import { CallObject } from '../../entity/types';
import { useNavigation } from '@react-navigation/native';
import { iconColor, disableColor, voiceColor, lightColor } from '../../utilities/colors';

const VoiceCall = (p: any) => {

  const appId = '79fb6b3a4cd34b79a5e3b60379268854';
  const token = '007eJxTYMjKelkVtqhpVtDbDyvr8i7OL1XdGGXv+5pfRG0y38RPGyYrMJhbpiWZJRknmiSnGJskmVsmmqYaJ5kZGJtbGplZWJiavDCbnt4QyMgwa8J0VkYGCATxuRjK8jOTU+OTE3NyGBgAZWoiow==';
  const channelName = 'voice_call';
  const uid = 0; // Local user UID, no need to modify

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  };

  const agoraEngineRef = useRef<IRtcEngine>();
  const [message, showMessage] = useState("")
  const [remoteUid, setRemoteUid] = useState(0);

  const curentUser = useSelector(getUser);
  const eventHandler = useRef<IRtcEngineEventHandler>();

  function createCall() {
    // ToastAndroid.show("created a call" + agoraEngineRef.current, ToastAndroid.SHORT)
    agoraEngineRef.current?.joinChannel(token, channelName, uid, {
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      publishMicrophoneTrack: true,
      autoSubscribeAudio: true,
    });
  }

  function pickCall() {
    // ToastAndroid.show("picked the call " + agoraEngineRef.current, ToastAndroid.SHORT)
    agoraEngineRef.current?.joinChannel(token, channelName, uid, {
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      clientRoleType: ClientRoleType.ClientRoleAudience,
      publishMicrophoneTrack: true,
      autoSubscribeAudio: true,
    });
  }

  function leaveChanel() {
    agoraEngineRef.current?.leaveChannel();
    setRemoteUid(0);
    nav.goBack();
    showMessage('You left the channel');
  }

  const [ending, setEnding] = useState(false);
  const [caller, setCaller] = useState<User | null>(null);

  const currentCall = useRef<any>();
  const nav: any = useNavigation();

  const setupVoiceSDKEngine = async () => {
    try {
      // Create RtcEngine after obtaining device permissions
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      eventHandler.current = {
        onJoinChannelSuccess: () => {
          showMessage('Successfully joined channel: ' + channelName);
        },
        onUserJoined: (_connection: RtcConnection, uid: number) => {
          showMessage('Remote user ' + uid + ' joined');
          setRemoteUid(uid);
        },
        onUserOffline: (_connection: RtcConnection, uid: number) => {
          showMessage('Remote user ' + uid + ' left the channel');
          nav.goBack();
          //ToastAndroid.show("going back", ToastAndroid.SHORT);
          setRemoteUid(0);
        },
      };
      // Register the event handler
      agoraEngine.registerEventHandler(eventHandler.current);
      // Initialize the engine
      agoraEngine.initialize({
        appId: appId,
      });
      if ((p.route.params && p.route.params.callerName)) {
        setCaller({
          avatar: p.route.params.callerAvatar,
          displayName: p.route.params.callerName,
          email: p.route.params.callerId,
        })
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    setupVoiceSDKEngine();
    return () => {
      if (eventHandler.current) {
        console.log("removed agora listener")
        agoraEngineRef.current?.unregisterEventHandler(eventHandler.current);
        agoraEngineRef.current?.release();
      }
      if (currentCall.current) {
        console.log("removed firebase listener")
        rdb.ref('/calls/' + caller?.email.replaceAll("@", "_").replaceAll(".", "_")).off('value', currentCall.current);
      }
    };
  }, [])

  useEffect(() => {
    if (caller) {
      if ((p.route.params && p.route.params.act == "sender")) {
        createCall();
        currentCall.current = rdb.ref('/calls/' + caller.email.replaceAll("@", "_").replaceAll(".", "_"))
          .on('value', snapshot => {
            console.log('Call data: ', snapshot.val());
            const call: CallObject = snapshot.val() as CallObject;
            if (call) {
              if (call.status == 'ended') {
                leaveChanel();
              }
            }
          });
      } else {
        pickCall();
      }
    }
  }, [caller])

  const [isMute, setIsMute] = useState(false);
  function muteUnmuteCall() {
    if (isMute) {
      setIsMute(false);
      agoraEngineRef.current?.adjustRecordingSignalVolume(100);
    } else {
      setIsMute(true);
      agoraEngineRef.current?.adjustRecordingSignalVolume(0);
    }
  }

  function endCall() {
    console.log("dataaa ", (p.route.params && p.route.params.act == "sender"), caller)
    if ((p.route.params && p.route.params.act == "sender")) {
      if (caller) {
        rdb.ref('/calls/' + caller.email.replaceAll("@", "_").replaceAll(".", "_"))
          .set({
            status: "ended",
          });
      }
    } else {
      rdb.ref('/calls/' + curentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"))
        .set({
          status: "ended",
        });
    }
    leaveChanel();
  }

  return (
    <View style={styles.container}>
      {/* <Text onPress={leaveChanel} style={styles.mainHeader}>{message}</Text> */}
      {
        (caller) &&
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Avatar avt={caller.avatar} size={100} />
            <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: '500', color: lightColor, marginTop: 20 }}>{caller.displayName}</Text>
          </View>
          {
            (remoteUid != 0) ?
              <View style={{
                paddingHorizontal: 20,
                flexDirection: 'row',
                paddingBottom: 20,
                justifyContent: 'space-between'
              }}>
                <TouchableOpacity onPress={muteUnmuteCall} style={{
                  width: 50, height: 50,
                  backgroundColor: (isMute) ? disableColor : voiceColor, borderRadius: 100,
                  justifyContent: 'center', alignItems: 'center',
                  marginRight: 10
                }}>
                  {
                    (!isMute) ?
                      <Icon size={30} color={iconColor} name='unmute' type='octicon' />
                      :
                      <Icon size={30} color={iconColor} name='mute' type='octicon' />
                  }
                </TouchableOpacity>
                <TouchableOpacity onPress={endCall} style={{
                  width: 50, height: 50,
                  backgroundColor: 'red', borderRadius: 100,
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <Icon name='phone-slash' type='font-awesome-5' color={iconColor} size={20} />
                </TouchableOpacity>
              </View>
              :
              <View style={{ alignItems: 'center', marginBlock: 50 }}>
                <TouchableOpacity onPress={endCall} style={{
                  width: 70,
                  height: 70,
                  borderRadius: 100,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {
                    (ending) ?
                      <ActivityIndicator size={20} color={iconColor} />
                      :
                      <Icon name='phone-slash' type='font-awesome-5' color={iconColor} size={30} />
                  }
                </TouchableOpacity>
              </View>
          }
        </View>
      }
    </View>
  )
}

export default VoiceCall

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darker
  },
  mainHeader: {
    fontSize: 30,
    fontWeight: '600',
    marginLeft: 20,
    color: lightColor
  },
  uname: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 10,
    marginTop: 10,
    color: '#aaa'
  },
  avatar: { width: 40, height: 40, marginLeft: 10 }
})