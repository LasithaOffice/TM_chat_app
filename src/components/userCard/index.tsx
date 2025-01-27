import { View, Text, Image, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { getUser, User } from '../../redux/slices/userSlice'
import Avatar from '../avatar'
import { Icon } from '@rneui/base'
import { rdb } from '../../firebase/firebaseInit'
import { useSelector } from 'react-redux'
import { CallObject } from '../../entity/types'
import { useNavigation } from '@react-navigation/native'

const UserCard = ({ user, setCaller }: { user: User, setCaller: Function }) => {

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
                setCaller(user);
              });
          } else {
            setProcessing(false);
            ToastAndroid.show("Already in a call!", ToastAndroid.SHORT);
          }
        } else {
          rdb.ref('/calls/' + user.email.replaceAll("@", "_").replaceAll(".", "_"))
            .set({
              callerName: currentUser.user.displayName,
              callerId: currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"),
              status: "incoming",
              type: "voice"
            })
            .then(() => {
              setCaller(user);
            });
        }
      })
  }

  function initiateAVideoCall() {
    rdb.ref('/calls/' + user.email.replaceAll("@", "_").replaceAll(".", "_"))
      .set({
        caller: currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"),
        status: "incoming",
        type: "voice"
      })
      .then(() => console.log('Data set.'));
  }

  return (
    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
      <Avatar avt={user.avatar} size={40} marginLeft={10} />
      <Text style={{
        marginLeft: 10,
        fontSize: 16,
        color: '#ddd',
        flex: 1
      }}>{user.displayName}</Text>
      {
        (processing) ?
          <ActivityIndicator style={{ marginRight: 20 }} />
          :
          <>
            <TouchableOpacity onPress={() => {
              initiateAVoiceCall();
            }} style={{ marginRight: 20 }}>
              <Icon size={20} color={'#fff'} name='phone' type='font-awesome' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              initiateAVideoCall();
            }} style={{ marginRight: 15 }}>
              <Icon size={20} color={'#fff'} name='video' type='font-awesome-5' />
            </TouchableOpacity>
          </>
      }
    </View>
  )
}

export default UserCard