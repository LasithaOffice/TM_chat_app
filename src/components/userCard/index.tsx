import { View, Text, Image, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { getUser, User } from '../../redux/slices/userSlice'
import Avatar from '../avatar'
import { Icon } from '@rneui/base'
import { rdb } from '../../firebase/firebaseInit'
import { useSelector } from 'react-redux'
import { CallObject } from '../../entity/types'
import { useNavigation } from '@react-navigation/native'
import { iconColor, lightColor } from '../../utilities/colors'

const UserCard = ({ user, chat }: { user: User, chat?: any }) => {

  const currentUser = useSelector(getUser);
  const [processing, setProcessing] = useState(false);
  const nav: any = useNavigation();

  function initiateAVoiceCall() {
    setProcessing(true);
    rdb.ref('/calls/' + user.email.replaceAll("@", "_").replaceAll(".", "_"))
      .once('value', (snapshot) => {
        const call: CallObject = snapshot.val() as CallObject;
        if (call) {
          if (call.status == 'ended') {
            rdb.ref('/calls/' + user.email.replaceAll("@", "_").replaceAll(".", "_"))
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
                  callerName: user.displayName,
                  callerAvatar: user.avatar,
                  callerId: user.email.replaceAll("@", "_").replaceAll(".", "_"),
                  act: "sender",
                })
              });
          } else {
            setProcessing(false);
            ToastAndroid.show("Already in a call!", ToastAndroid.SHORT);
          }
        } else {
          rdb.ref('/calls/' + user.email.replaceAll("@", "_").replaceAll(".", "_"))
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
                callerName: user.displayName,
                callerAvatar: user.avatar,
                callerId: user.email.replaceAll("@", "_").replaceAll(".", "_"),
                act: "sender",
              })
            });
        }
      })
  }

  function initiateAConversation() {
    nav.navigate('ChatPage', {
      displayName: user.displayName,
      avatar: user.avatar,
      uid: user.email.replaceAll("@", "_").replaceAll(".", "_"),
    })
  }

  function initiateAVideoCall() {
    setProcessing(true);
    rdb.ref('/calls/' + user.email.replaceAll("@", "_").replaceAll(".", "_"))
      .once('value', (snapshot) => {
        const call: CallObject = snapshot.val() as CallObject;
        if (call) {
          if (call.status == 'ended') {
            rdb.ref('/calls/' + user.email.replaceAll("@", "_").replaceAll(".", "_"))
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
                  callerName: user.displayName,
                  callerAvatar: user.avatar,
                  callerId: user.email.replaceAll("@", "_").replaceAll(".", "_"),
                  act: "sender",
                })
              });
          } else {
            setProcessing(false);
            ToastAndroid.show("Already in a call!", ToastAndroid.SHORT);
          }
        } else {
          rdb.ref('/calls/' + user.email.replaceAll("@", "_").replaceAll(".", "_"))
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
                callerName: user.displayName,
                callerAvatar: user.avatar,
                callerId: user.email.replaceAll("@", "_").replaceAll(".", "_"),
                act: "sender",
              })
            });
        }
      })
  }

  return (
    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
      <Avatar avt={user.avatar} size={40} marginLeft={10} />
      <Text style={{
        marginLeft: 10,
        fontSize: 16,
        color: lightColor,
        flex: 1
      }}>{user.displayName}</Text>
      {
        (chat) ?
          <TouchableOpacity onPress={() => {
            initiateAConversation();
          }} style={{ marginRight: 20 }}>
            <Icon size={30} color={iconColor} name='chat-plus-outline' type='material-community' />
          </TouchableOpacity>
          :
          (processing) ?
            <ActivityIndicator style={{ marginRight: 20 }} />
            :
            <>
              <TouchableOpacity onPress={() => {
                initiateAVoiceCall();
              }} style={{ marginRight: 20 }}>
                <Icon size={20} color={iconColor} name='phone' type='font-awesome' />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                initiateAVideoCall();
              }} style={{ marginRight: 15 }}>
                <Icon size={20} color={iconColor} name='video' type='font-awesome-5' />
              </TouchableOpacity>
            </>
      }
    </View>
  )
}

export default UserCard