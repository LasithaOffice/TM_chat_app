import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../redux/slices/userSlice'
import Button from '../../components/button'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Avatar from '../../components/avatar'
import { Icon } from '@rneui/base'
import { iconColor, lightColor } from '../../utilities/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAgoraData } from '../../utilities/CommonFunction'
import { AppDispatch } from '../../redux/store'
import { AgoraData, saveToken } from '../../redux/slices/agoraDataSlice'
import { rdb } from '../../firebase/firebaseInit'
import { ConversationObj } from '../../entity/types'
import ChatCard from '../../components/chatCard'

const Home = () => {

  const currentUser = useSelector(getUser)

  const img = '../../resources/images/' + currentUser.user.avatar;
  const nav: any = useNavigation();

  const disptch = useDispatch<AppDispatch>();

  const [tokenReceived, setTokenReceived] = useState(false);
  const [chats, setChats] = useState<ConversationObj[]>([])

  function getAgoraToken() {
    getAgoraData().then(d => {
      const data: AgoraData = d.val();
      console.log("agora data", data)
      if (d.exists()) {
        setTokenReceived(true);
        disptch(saveToken(data))
      }
    })
  }

  useEffect(() => {
    getAgoraToken();
    loadChatConversations();
    return () => {
      if (chatsListener.current) {
        rdb.ref('/userConversation/' + currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_")).off('value', chatsListener.current)
      }
    };
  }, [])

  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {
            (!tokenReceived) ?
              <ActivityIndicator style={{ marginRight: 15 }} />
              :
              <TouchableOpacity style={{ marginRight: 15 }} onPressOut={() => {
                nav.navigate('CallHistory');
                console.log("clicked")
              }}>
                <Icon size={20} color={iconColor} name='history' type='fontisto' />
              </TouchableOpacity>
          }
          <TouchableOpacity onPressOut={() => {
            nav.navigate('Settings');
            console.log("clicked")
          }}>
            <Icon size={25} color={iconColor} name='settings' type='simple-line-icon' />
          </TouchableOpacity>
        </View>
      )
    });
  }, [nav, tokenReceived]);

  const chatsListener = useRef<any>();

  function loadChatConversations() {
    chatsListener.current = rdb.ref('/userConversation/' + currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"))
      .on('value', data => {
        if (data.exists()) {
          const chts: ConversationObj[] = (Object.values(data.val()) as
            ConversationObj[]).sort((a, b) => b.timeStamp - a.timeStamp);
          setChats(chts);
        }
      })
  }

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem('email').then((r) => {
      if (!r) {
        nav.replace('Login')
      }
    })
    rdb.ref('/calls/' + currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_"))
      .set({
        status: "ended"
      })
  }, []))

  return (
    <View style={styles.container}>
      {/* <Text style={styles.mainHeader}>TM Chat</Text> */}
      <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
        <Avatar avt={currentUser.user.avatar} size={40} marginLeft={10} />
        <Text style={styles.uname}>{"Welcome " + currentUser.user.displayName}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 10 }}>
        <View style={{ flex: 0.48 }}><Button loading={!tokenReceived} icon={{ name: 'message1', type: 'antdesign' }} dark title='New Chat' onPress={() => {
          nav.navigate('ChatUserList');
        }} /></View>
        <View style={{ flex: 0.48 }}><Button loading={!tokenReceived} icon={{ name: 'phone-call', type: 'feather' }} dark title='Call' onPress={() => {
          nav.navigate('CallList');
        }} /></View>
      </View>
      <FlatList
        style={{ marginTop: 10 }}
        data={chats}
        keyExtractor={(item) => item.timeStamp.toString()}
        renderItem={({ index, item }) =>
          <ChatCard conversation={item} />
        }
      />
      {/* <View style={{ marginHorizontal: 10, marginTop: 15 }}><Button dark title='New Chat' onPress={() => { }} /></View> */}
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darker
  },
  mainHeader: {
    fontSize: 40,
    fontWeight: '600',
    marginLeft: 10,
    color: lightColor
  },
  uname: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 10,
    color: '#aaa'
  },
})