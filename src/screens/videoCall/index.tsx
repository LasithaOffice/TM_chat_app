import { View, Platform, PermissionsAndroid, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcConnection,
  IRtcEngineEventHandler,
  RtcSurfaceView,
} from 'react-native-agora';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { rdb } from '../../firebase/firebaseInit';
import { getUser, User } from '../../redux/slices/userSlice';
import { useSelector } from 'react-redux';
import { Icon } from '@rneui/base';
import { CallObject } from '../../entity/types';
import { useNavigation } from '@react-navigation/native';
import { iconColor, disableColor, videoColor, lightColor } from '../../utilities/colors';

const VideoCall = (p: any) => {

  const appId = '79fb6b3a4cd34b79a5e3b60379268854';
  const token = '007eJxTYMjKelkVtqhpVtDbDyvr8i7OL1XdGGXv+5pfRG0y38RPGyYrMJhbpiWZJRknmiSnGJskmVsmmqYaJ5kZGJtbGplZWJiavDCbnt4QyMgwa8J0VkYGCATxuRjK8jOTU+OTE3NyGBgAZWoiow==';
  const channelName = 'voice_call';
  const uid = 0; // Local user UID, no need to modify

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  const agoraEngineRef = useRef<IRtcEngine>();
  const [message, showMessage] = useState("")
  const [remoteUid, setRemoteUid] = useState(-1);
  const { height, width } = useWindowDimensions();
  const curentUser = useSelector(getUser);
  const eventHandler = useRef<IRtcEngineEventHandler>();

  function createCall() {
    agoraEngineRef.current?.startPreview();
    agoraEngineRef.current?.joinChannel(token, channelName, uid, {
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      publishMicrophoneTrack: true,
      publishCameraTrack: true,
      autoSubscribeAudio: true,
      autoSubscribeVideo: true,
    });
  }

  function pickCall() {
    agoraEngineRef.current?.startPreview();
    agoraEngineRef.current?.joinChannel(token, channelName, uid, {
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      clientRoleType: ClientRoleType.ClientRoleAudience,
      publishMicrophoneTrack: true,
      publishCameraTrack: true,
      autoSubscribeAudio: true,
      autoSubscribeVideo: true,
    });
  }

  function leaveChanel() {
    agoraEngineRef.current?.leaveChannel();
    setRemoteUid(0);
    nav.goBack();
    showMessage('You left the channel');
  }

  const [isJoined, setIsJoined] = useState(false);
  const [caller, setCaller] = useState<User | null>({
    avatar: 'female_1',
    displayName: '',
    email: '',
  });

  const currentCall = useRef<any>();
  const nav: any = useNavigation();

  const setupVideoSDKEngine = async () => {
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
          setIsJoined(true);
        },
        onUserJoined: (_connection: RtcConnection, uid: number) => {
          showMessage('Remote user ' + uid + ' joined');
          setRemoteUid(uid);
        },
        onUserOffline: (_connection: RtcConnection, uid: number) => {
          showMessage('Remote user ' + uid + ' left the channel');
          setRemoteUid(0);
        },
      };
      // Register the event handler
      agoraEngine.registerEventHandler(eventHandler.current);
      // Initialize the engine
      agoraEngine.initialize({
        appId: appId,
      });
      // Enable local video
      agoraEngine.enableVideo();
      if ((p.route.params && p.route.params.callerName)) {
        setCaller({
          avatar: p.route.params.callerAvatar,
          displayName: p.route.params.callerName,
          email: p.route.params.callerId,
        })
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setupVideoSDKEngine();
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

  function changeCam() {
    agoraEngineRef.current?.switchCamera();
  }

  const [videoDisable, setVideoDisable] = useState(false);
  function offCamera() {
    if (videoDisable) {
      setVideoDisable(false);
      agoraEngineRef.current?.muteLocalVideoStream(false);
    } else {
      setVideoDisable(true);
      agoraEngineRef.current?.muteLocalVideoStream(true);
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
      {/* <Text onPress={leaveChanel} style={styles.mainHeader}>{"stat " + message}</Text> */}
      {
        (caller) &&
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContainer}>
            {isJoined && remoteUid !== 0 ? (
              <React.Fragment key={remoteUid}>
                <RtcSurfaceView
                  canvas={{ uid: remoteUid }}
                  style={[styles.videoView,
                  {
                    height: ((height - 100) / 2)
                  }
                  ]}
                />
              </React.Fragment>
            ) : (
              <></>
            )}
            {isJoined ? (
              <React.Fragment key={0}>
                <RtcSurfaceView canvas={{ uid: 0 }} style={[styles.videoView,
                {
                  height: ((height - 100) / 2)
                }
                ]} />
              </React.Fragment>
            ) : (
              <></>
            )}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={muteUnmuteCall} style={[styles.switchButton, {
              backgroundColor: (isMute) ? disableColor : videoColor,
            }]}>
              {
                (!isMute) ?
                  <Icon size={30} color={iconColor} name='unmute' type='octicon' />
                  :
                  <Icon size={30} color={iconColor} name='mute' type='octicon' />
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={offCamera} style={[styles.switchButton, {
              backgroundColor: (videoDisable) ? disableColor : videoColor,
            }]}>
              {
                (!videoDisable) ?
                  <Icon size={30} color={iconColor} name='video' type='feather' />
                  :
                  <Icon size={30} color={iconColor} name='video-off' type='feather' />
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={changeCam} style={styles.grayButton}>
              <Icon size={30} color={iconColor} name='camera-reverse-outline' type='ionicon' />
            </TouchableOpacity>
            <TouchableOpacity onPress={endCall} style={styles.redButton}>
              <Icon name='phone-slash' type='font-awesome-5' color={iconColor} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      }
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
  avatar: { width: 40, height: 40, marginLeft: 10 },
  videoView: {
    width: '100%',
  },
  smallView: {
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
    width: 100, height: 150,
    borderRadius: 10
  },
  scroll: { flex: 1, backgroundColor: '#222', width: '100%' },
  scrollContainer: { alignItems: 'center' },
  buttonContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-between'
  },
  switchButton: {
    width: 50, height: 50,
    borderRadius: 100,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10
  },
  grayButton: {
    width: 50, height: 50,
    backgroundColor: disableColor,
    borderRadius: 100,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10
  },
  redButton: {
    width: 50, height: 50,
    backgroundColor: 'red', borderRadius: 100,
    justifyContent: 'center', alignItems: 'center'
  }
})