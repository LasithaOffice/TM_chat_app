import { View, Text, Platform, PermissionsAndroid, StyleSheet } from 'react-native'
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
import { useNavigation } from '@react-navigation/native';



const VideoCall = () => {

  const appId = '79fb6b3a4cd34b79a5e3b60379268854';
  const token = '007eJxTYFjySKiP6+ykbJ37p9nXPX759s41z+qvs2dt42Y66ql2JcZSgcHcMi3JLMk40SQ5xdgkydwy0TTVOMnMwNjc0sjMwsLU5HX1lPSGQEYGn5NmzIwMEAjiczGUZaak5scnJ+bkMDAAALW3I2Q=';
  const channelName = 'video_call';
  const uid = 0; // Local user UID, no need to modify

  const nav: any = useNavigation();

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  const agoraEngineRef = useRef<any>();
  const [message, showMessage] = useState("")
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);

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
    getPermission();
    const agoraEngine = agoraEngineRef.current;
    agoraEngine.initialize({
      appId: appId,
    });
    agoraEngine.enableVideo();
    agoraEngine.registerEventHandler(eventHandler.current);
    return () => {
      agoraEngineRef.current?.unregisterEventHandler(eventHandler.current);
      agoraEngineRef.current?.release();
    };
  }, [])

  function createCall() {
    agoraEngineRef.current?.startPreview();
    // Join the channel as a broadcaster
    agoraEngineRef.current?.joinChannel(token, channelName, uid, {
      // Set channel profile to live broadcast
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      // Set user role to broadcaster
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      // Publish audio collected by the microphone
      publishMicrophoneTrack: true,
      // Publish video collected by the camera
      publishCameraTrack: true,
      // Automatically subscribe to all audio streams
      autoSubscribeAudio: true,
      // Automatically subscribe to all video streams
      autoSubscribeVideo: true,
    });
    nav.navigate('VPreview');
  }

  function pickCall() {
    agoraEngineRef.current?.joinChannel(token, channelName, uid, {
      // Set channel profile to live broadcast
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      // Set user role to audience
      clientRoleType: ClientRoleType.ClientRoleAudience,
      // Do not publish audio collected by the microphone
      publishMicrophoneTrack: true,
      // Do not publish video collected by the camera
      publishCameraTrack: true,
      // Automatically subscribe to all audio streams
      autoSubscribeAudio: true,
      // Automatically subscribe to all video streams
      autoSubscribeVideo: true,
    });
    nav.navigate('VPreview');
  }

  function leaveChanel() {
    agoraEngineRef.current?.leaveChannel();
    setRemoteUid(0);
    setIsJoined(false);
    showMessage('You left the channel');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeader}>Video Call</Text>
      <Text style={styles.uname}>{"Message " + message}</Text>
      <View style={{ width: 20, height: 20, backgroundColor: (isJoined) ? "#008833" : "#992222", margin: 10, borderRadius: 200 }}></View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 10 }}>
        <View style={{ flex: 0.48 }}><Button dark title='Call' onPress={() => {
          createCall();
        }} /></View>
        <View style={{ flex: 0.48 }}><Button dark title='Answer' onPress={() => {
          pickCall();
        }} /></View>
      </View>
      <View style={{ marginHorizontal: 10, marginTop: 15 }}><Button dark title='End Call' onPress={() => {
        leaveChanel();
      }} /></View>
    </View>
  )
}

export default VideoCall

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darker
  },
  mainHeader: {
    fontSize: 40,
    fontWeight: '600',
    marginLeft: 10,
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