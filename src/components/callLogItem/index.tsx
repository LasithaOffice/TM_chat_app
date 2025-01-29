import { View, Text, Image, TouchableOpacity, ToastAndroid, ActivityIndicator, Pressable } from 'react-native'
import React, { useState } from 'react'
import { getUser, User } from '../../redux/slices/userSlice'
import Avatar from '../avatar'
import { Icon } from '@rneui/base'
import { rdb } from '../../firebase/firebaseInit'
import { useSelector } from 'react-redux'
import { CallLog, CallObject } from '../../entity/types'
import { useNavigation } from '@react-navigation/native'
import { darkerColor, disableColor, errorcolor, iconColor, lightColor } from '../../utilities/colors'
import { duration, timeAgo } from '../../utilities/CommonFunction'

type Props = {
  callLog: CallLog
}

const CallLogItem = (p: Props) => {

  const currentUser = useSelector(getUser);
  const [processing, setProcessing] = useState(false);
  const nav: any = useNavigation();

  function initiateAVoiceCall() {
    setProcessing(true);
    rdb.ref('/calls/' + p.callLog.callerId)
      .once('value', (snapshot) => {
        const call: CallObject = snapshot.val() as CallObject;
        if (call) {
          if (call.status == 'ended') {
            rdb.ref('/calls/' + p.callLog.callerId)
              .set({
                callerName: currentUser.user.displayName,
                callerAvatar: currentUser.user.avatar,
                callerId: currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"),
                status: "incoming",
                type: "voice"
              })
              .then(() => {
                setProcessing(false);
                nav.navigate('VoiceCall', {
                  callerName: p.callLog.displayName,
                  callerAvatar: p.callLog.avatar,
                  callerId: p.callLog.callerId,
                  act: "sender",
                })
              });
          } else {
            setProcessing(false);
            ToastAndroid.show("Already in a call!", ToastAndroid.SHORT);
          }
        } else {
          rdb.ref('/calls/' + p.callLog.callerId)
            .set({
              callerName: currentUser.user.displayName,
              callerAvatar: currentUser.user.avatar,
              callerId: currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"),
              status: "incoming",
              type: "voice"
            })
            .then(() => {
              setProcessing(false);
              nav.navigate('VoiceCall', {
                callerName: p.callLog.displayName,
                callerAvatar: p.callLog.avatar,
                callerId: p.callLog.callerId,
                act: "sender",
              })
            });
        }
      })
  }

  function initiateAVideoCall() {
    setProcessing(true);
    rdb.ref('/calls/' + p.callLog.callerId)
      .once('value', (snapshot) => {
        const call: CallObject = snapshot.val() as CallObject;
        if (call) {
          if (call.status == 'ended') {
            rdb.ref('/calls/' + p.callLog.callerId)
              .set({
                callerName: currentUser.user.displayName,
                callerAvatar: currentUser.user.avatar,
                callerId: currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"),
                status: "incoming",
                type: "video"
              })
              .then(() => {
                setProcessing(false);
                nav.navigate('VideoCall', {
                  callerName: p.callLog.displayName,
                  callerAvatar: p.callLog.avatar,
                  callerId: p.callLog.callerId,
                  act: "sender",
                })
              });
          } else {
            setProcessing(false);
            ToastAndroid.show("Already in a call!", ToastAndroid.SHORT);
          }
        } else {
          rdb.ref('/calls/' + p.callLog.callerId)
            .set({
              callerName: currentUser.user.displayName,
              callerAvatar: currentUser.user.avatar,
              callerId: currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"),
              status: "incoming",
              type: "video"
            })
            .then(() => {
              setProcessing(false);
              nav.navigate('VideoCall', {
                callerName: p.callLog.displayName,
                callerAvatar: p.callLog.avatar,
                callerId: p.callLog.callerId,
                act: "sender",
              })
            });
        }
      })
  }

  return (
    <Pressable android_ripple={{ color: disableColor }} onPress={() => {
      if (p.callLog.type == 'video') {
        initiateAVideoCall();
      } else {
        initiateAVoiceCall();
      }
    }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingLeft: 10 }}>
      <Avatar avt={p.callLog.avatar} size={50} marginLeft={10} />
      <View style={{ flex: 1 }}>
        <Text style={{
          marginLeft: 10,
          fontSize: 20,
          color: lightColor,
        }}>{p.callLog.displayName}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 2 }}>
          {
            (p.callLog.role == 'sender') ?
              (
                (p.callLog.status == 'connected') ?
                  <Icon size={20} color={iconColor} name='call-made' type='material' />
                  :
                  <Icon size={20} color={errorcolor} name='call-missed-outgoing' type='material' />
              )
              :
              (
                (p.callLog.status == 'connected') ?
                  <Icon size={20} color={iconColor} name='call-received' type='material' />
                  :
                  <Icon size={20} color={errorcolor} name='call-missed' type='material' />
              )
          }
          <View style={{ width: 5, height: 5, backgroundColor: lightColor, borderRadius: 5, marginHorizontal: 5 }}></View>
          <Text style={{
            fontSize: 16,
            color: lightColor,
          }}>{timeAgo(p.callLog.en_time)}</Text>
        </View>
      </View>
      {
        (p.callLog.type == 'voice') ?
          <View style={{ marginRight: 5, width: 60, }}>
            <Icon size={30} color={iconColor} name='phone' type='font-awesome' />
            {
              (p.callLog.status == 'connected') &&
              <Text style={{ marginTop: 5, color: lightColor, textAlign: 'center' }}>{duration(p.callLog.st_time, p.callLog.en_time)}</Text>
            }
          </View>
          :
          <View style={{ marginRight: 5, width: 60, }}>
            <Icon size={30} color={iconColor} name='video' type='font-awesome-5' />
            {
              (p.callLog.status == 'connected') &&
              <Text style={{ marginTop: 5, color: lightColor, textAlign: 'center' }}>{duration(p.callLog.st_time, p.callLog.en_time)}</Text>
            }
          </View>
      }
    </Pressable>
  )
}

export default CallLogItem