import { View, Text, useWindowDimensions, FlatList, Platform, StatusBar, Pressable, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { getUser } from '../../redux/slices/userSlice';
import { Avatars, ChatObj, Chatter } from '../../entity/types';
import { timeAgo, timeAgoShort } from '../../utilities/CommonFunction';
import { Icon } from '@rneui/base';
import TextInput from '../../components/textInput';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { iconColor, lightColor, myChatColor, otherChatColor } from '../../utilities/colors';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../../components/avatar';
import { HeaderBackButton } from '@react-navigation/elements';
import { rdb } from '../../firebase/firebaseInit';


const ChatPage = (p: any) => {

  const nav: any = useNavigation();
  const currentUser = useSelector(getUser)

  const avatar: Avatars = p.route.params.avatar;
  const displayName: string = p.route.params.displayName;
  const uid: string = p.route.params.uid;
  const myid: string = currentUser.user.email.replaceAll("@", "_").replaceAll(".", "_");

  const [conversationId, setConversationId] = useState("");

  useEffect(() => {
    nav.setOptions({
      title: displayName,
      headerCenter: (props: any) => {
        return (
          <>
            {props.canGoBack && <HeaderBackButton style={{ left: -10 }} {...props} onPress={() => {
              console.log("sswsss")
              nav.goBack()
            }} />}
            <Avatar avt={avatar} marginRight={10} marginLeft={-10} />
          </>
        );
      },
    })
  }, [nav])

  function checkConversation() {
    rdb.ref('/chatConversation/' + (uid + myid)).once('value', snapShot => {
      if (snapShot.exists()) {
        console.log(" yes 1" + (uid + myid))
        setConversationId((uid + myid))
      } else {
        console.log(" no 2" + (uid + myid))
        rdb.ref('/chatConversation/' + (myid + uid)).once('value', snapShot => {
          if (snapShot.exists()) {
            console.log(" yes 3" + (myid + uid))
            setConversationId((myid + uid))
          } else {
            console.log(" no 4" + (myid + uid))
            rdb.ref('/chatConversation/' + (myid + uid) + "/st_time").set(new Date().getTime());
            setConversationId((myid + uid))
          }
        })
      }
    })
  }

  const messageListener = useRef<any>();
  const [currentMsg, setCurrentMsg] = useState<ChatObj>();

  useEffect(() => {
    if (currentMsg) {
      addChat(currentMsg.message, currentMsg.uid);
    }
  }, [currentMsg]);

  function otherMessageListener() {
    messageListener.current = rdb.ref('/chatConversation/' + conversationId + "/" + uid).on('value', snapShot => {
      if (snapShot.exists()) {
        const data: ChatObj = snapShot.val();
        setCurrentMsg(data);
      }
    })
  }

  useEffect(() => {
    checkConversation();
  }, [])


  function loadChat() {
    rdb.ref('/chatConversation/' + conversationId + "/all").once('value', snapShot => {
      if (snapShot.exists()) {
        setChats(Object.values(snapShot.val() as ChatObj[]).sort((a, b) => a.timeStamp - b.timeStamp));
      }
    })
  }

  useEffect(() => {
    if (conversationId) {
      console.log("conversationId Changed", conversationId)
      otherMessageListener();
      loadChat();
      return () => {
        if (messageListener.current) {
          rdb.ref('/chatConversation/' + conversationId + "/" + uid).off('value', messageListener.current)
        }
      }
    }
  }, [conversationId])

  const [chats, setChats] = useState<ChatObj[]>([]);
  const [message, setMessage] = useState<string>('');

  const chatText = useRef<any>();

  let flatList: FlatList<ChatObj> | null;

  function addChat(message: string, uid: string) {
    const nchat: ChatObj = {
      message: message,
      uid: uid,
      timeStamp: new Date().getTime(),
    };
    let nchats: ChatObj[] = [...chats, nchat];
    setChats(nchats);
    if (uid == myid) {
      chatText.current.clear();
      saveMesssage(nchat);
    }
  }

  function saveMesssage(msg: ChatObj) {
    console.log("saveMesssage 22222", conversationId)
    rdb.ref('/chatConversation/' + conversationId + "/all/" + msg.timeStamp).set(msg)
    rdb.ref('/chatConversation/' + conversationId + "/" + myid).set(msg)
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.darker }}>
      <View style={{ marginHorizontal: 10, flex: 1, marginTop: 10 }}>
        <FlatList
          onContentSizeChange={() => {
            if (flatList) {
              flatList.scrollToEnd();
            }
          }}
          ref={list => (flatList = list)}
          showsVerticalScrollIndicator={false}
          data={chats}
          renderItem={({ item }) =>
            item.uid == myid ? <MyChat item={item} /> : <OtherChat item={item} />
          }
        />
      </View>
      <View style={{ padding: '2%' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, paddingRight: '2%' }}>
            <TextInput
              ref={chatText}
              // borderRadius={40}
              onChangeText={(v: string) => setMessage(v)}
              width={'100%'}
              placeholder={'Type a message'}
            // placeholderTextColor={'#888'}
            // borderWidth={2}
            // borderColor={'#666'}
            />
          </View>
          {
            (!conversationId) ?
              <ActivityIndicator />
              :
              <TouchableOpacity
                onPress={() => {
                  if (message) {
                    addChat(message, myid);
                  } else {
                    Alert.alert('Please enter a message.');
                  }
                }}
                style={{

                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    color={lightColor}
                    name="send"
                    size={35}
                    style={{
                      marginLeft: 5,
                      marginTop: 3,
                    }}
                    type="ionicon"
                  />
                </View>
              </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  );
};

export default ChatPage

const MyChat = ({ item }: { item: ChatObj }) => {
  return (
    <View style={{ alignItems: 'flex-end' }}>
      <View
        style={{
          padding: '3%',
          backgroundColor: myChatColor,
          marginVertical: '1%',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
          maxWidth: '70%',
        }}>
        <View>
          <Text
            style={{
              color: iconColor,
              fontWeight: '700'
            }}>
            {item.message}
          </Text>
          {item?.timeStamp ? (
            <Text
              style={{
                color: lightColor,
                textAlign: 'right',
                width: '100%',
              }}>
              {timeAgoShort(item?.timeStamp)}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  )
}

const OtherChat = ({ item }: { item: ChatObj }) => {
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <View
        style={{
          padding: '3%',
          backgroundColor: otherChatColor,
          marginVertical: '1%',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          maxWidth: '70%',
        }}>
        <View>
          <Text
            style={{
              color: 'white',
            }}>
            {item.message}
          </Text>
          {item.timeStamp ? (
            <Text
              style={{
                color: 'white',
                width: '100%',
              }}>
              {timeAgoShort(item?.timeStamp)}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  )
}