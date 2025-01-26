import { View, Text, Platform, PermissionsAndroid, StyleSheet, ActivityIndicator, ScrollView, FlatList, TouchableOpacity } from 'react-native'
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



const VoiceCall = () => {

  const appId = '79fb6b3a4cd34b79a5e3b60379268854';
  const token = '007eJxTYMgoeZ9cGn2ca+rTTI9nR19ZptZrHk9d3RXX+/HuK06Lvy4KDOaWaUlmScaJJskpxiZJ5paJpqnGSWYGxuaWRmYWFqYmwecmpzcEMjIol4YwMjJAIIjPxVCWn5mcGp+cmJPDwAAAmnUi2Q==';
  const channelName = 'voice_call';
  const uid = 0; // Local user UID, no need to modify

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  };

  const agoraEngineRef = useRef<any>();
  const [message, showMessage] = useState("")
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);

  const curentUser = useSelector(getUser);

  agoraEngineRef.current = createAgoraRtcEngine();
  const eventHandler = useRef<IRtcEngineEventHandler>();
  eventHandler.current = {
    onJoinChannelSuccess: () => {
      showMessage('Successfully joined channel: ' + channelName);
      setIsJoined(true);
    },
    onUserJoined: (_connection: RtcConnection, uid: number) => {
      showMessage('Remote user ' + uid + ' has joined');
      setRemoteUid(uid);
    },
    onUserOffline: (_connection: RtcConnection, uid: number) => {
      showMessage('Remote user ' + uid + ' has left the channel');
      setRemoteUid(0);
    },
  };

  useEffect(() => {
    const agoraEngine = agoraEngineRef.current;
    agoraEngine.initialize({
      appId: appId,
    });
    loadUsers();
    getPermission();
    agoraEngine.registerEventHandler(eventHandler.current);
    return () => {
      agoraEngineRef.current?.unregisterEventHandler(eventHandler.current);
      agoraEngineRef.current?.release();
    };
  }, [])

  function createCall() {
    agoraEngineRef.current?.joinChannel(token, channelName, uid, {
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      publishMicrophoneTrack: true,
      autoSubscribeAudio: true,
    });
  }

  function pickCall() {
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
    setIsJoined(false);
    showMessage('You left the channel');
  }

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [caller, setCaller] = useState<User | null>(null);
  const [callerEm, setCallerEm] = useState<string>("");

  function loadUsers() {
    //setLoading(true);
    loadAllUsers().then(data => {
      console.log("users", Object.values(data.val()))
      setLoading(false);
      setUsers((Object.values(data.val()) as User[]).filter((u: User) => u.email != curentUser.user.email) as User[]);
    }).catch(e => {
      setLoading(false);
    });
  }

  const currentCall = useRef<any>();

  useEffect(() => {
    if (caller) {
      setCallerEm(caller.email);
      currentCall.current = rdb.ref('/calls/' + caller.email.replaceAll("@", "_").replaceAll(".", "_"))
        .on('value', snapshot => {
          console.log('Call data: ', snapshot.val());
          const call: CallObject = snapshot.val() as CallObject;
          if (call) {
            if (call.status == 'ended') {
              setCaller(null);
            }
          }
        });
    } else {
      rdb.ref('/calls/' + callerEm.replaceAll("@", "_").replaceAll(".", "_")).off('value', currentCall.current);
    }
  }, [caller])

  function muteUnmuteCall() {

  }

  function endCall() {
    leaveChanel();
  }

  return (
    <View style={styles.container}>
      <Text onPress={leaveChanel} style={styles.mainHeader}>Call</Text>
      {/* <Text style={styles.uname}>{"Message " + message}</Text> */}
      {/* <View style={{ width: 20, height: 20, backgroundColor: (isJoined) ? "#008833" : "#992222", margin: 10, borderRadius: 200 }}></View> */}
      {
        (!caller) ?
          (loading) ?
            <ActivityIndicator />
            :
            <FlatList
              style={{ paddingTop: 10, width: '100%', }}
              keyExtractor={(item, index) => index.toString()}
              data={users}
              renderItem={({ item }) =>
                <UserCard user={item} setCaller={setCaller} key={item.email} />
              }
            />
          :
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Avatar avt={caller.avatar} size={100} />
              <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: '500', color: '#ddd', marginTop: 20 }}>{caller.displayName}</Text>
            </View>
            {
              (isJoined) ?
                <View style={{ paddingHorizontal: 10 }}>
                  <TouchableOpacity onPress={muteUnmuteCall} style={{
                    width: 40, height: 40,
                    backgroundColor: 'red', borderRadius: 100,
                    justifyContent: 'center', alignItems: 'center',
                    marginRight: 10
                  }}>
                    <Icon size={30} color={'#fff'} name='phone' type='font-awesome' />
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}></View>
                  <TouchableOpacity onPress={endCall} style={{
                    width: 40, height: 40,
                    backgroundColor: '#444', borderRadius: 100,
                    justifyContent: 'center', alignItems: 'center'
                  }}>
                    <Icon size={35} color={'#fff'} name='cross' type='entypo' />
                  </TouchableOpacity>
                </View>
                :
                <View style={{ alignItems: 'center', marginBlock: 50 }}>
                  <TouchableOpacity style={{
                    width: 70,
                    height: 70,
                    borderRadius: 100,
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Icon name='phone-slash' type='font-awesome-5' color='#fff' size={30} />
                  </TouchableOpacity>
                </View>
            }
          </View>
      }
      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 10 }}>
        <View style={{ flex: 0.48 }}>
          <Button dark title='Call' onPress={() => {
            createCall();
          }} />
        </View>
        <View style={{ flex: 0.48 }}>
          <Button dark title='Answer' onPress={() => {
            pickCall();
          }} />
        </View>
      </View>
      <View style={{ marginHorizontal: 10, marginTop: 15 }}>
        <Button dark title='End Call' onPress={() => {
          leaveChanel();
        }} />
      </View> */}
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
    color: '#ddd'
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