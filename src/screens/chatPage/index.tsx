import { View, Text, useWindowDimensions, FlatList, Platform, StatusBar, Pressable, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { getUser } from '../../redux/slices/userSlice';
import { ChatObj, Chatter } from '../../entity/types';
import { timeAgo } from '../../utilities/CommonFunction';
import { Icon } from '@rneui/base';
import TextInput from '../../components/textInput';

const ChatPage = (p: any) => {

  // useFocusEffect(() => {
  //     const onBackPress = () => {
  //         chtL?.listener();
  //         mlistner?.listener();
  //         updateDoc(doc(db, 'MsgRequests', chatter.id), {
  //             req: arrayRemove({
  //                 conversationId: conversationId,
  //                 stat: 1,
  //                 name: currentUser.user.displayName + ' ' + currentUser.surName,
  //                 uid: currentUser.id,
  //                 timeStamp: Timestamp.now(),
  //             }),
  //         });
  //         p.navigation.goBack();
  //         return true;
  //     };
  //     const subscription = BackHandler.addEventListener(
  //         'hardwareBackPress',
  //         onBackPress,
  //     );
  //     return () => subscription.remove();
  // });

  const { height, width } = useWindowDimensions();

  const [chats, setChats] = useState<ChatObj[]>([]);
  const [message, setMessage] = useState<string>('');
  const [conversationId, setConversationId] = useState('');
  const currentUser = useSelector(getUser)

  const chatText = useRef<any>();
  const [chtEnable, setChtEnable] = useState(true);
  const [chatter, setChatter] = useState<Chatter>({
    name: '',
    id: '',
    img: '',
    stat: 0,
  });

  const [chtL, setChtL] = useState<{
    listener: any;
  }>();

  function getChatter() {
    // let chtl = onSnapshot(doc(db, 'Members', p.route.params.mid), doc => {
    //     setChatter({
    //         name: doc.data()?.fname + ' ' + doc.data()?.sname,
    //         img: doc.data()?.img,
    //         id: doc.id,
    //         stat: doc.data()?.stat,
    //     });
    // });
    // setChtL({
    //     listener: chtl,
    // });
  }

  useEffect(() => {
    if (chatter.id != '') {
      if (chatter.stat == 3) {
        chats.push({
          message: 'Hello ' + currentUser.user.displayName + ', How can I help you?',
          user: 'support',
          timeStamp: new Date().getTime(),
        });
        addChat(
          'Hello ' + currentUser.user.displayName + ', How can I help you?',
          'support',
          chats,
        );
      } else {
        chats.push({
          message: "I'm not available now!",
          user: 'support',
          timeStamp: new Date().getTime(),
        });
        addChat("I'm not available now!", 'support', chats);
      }
    }
  }, [chatter]);

  useEffect(() => {
    getChatter();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const docRef = collection(db, 'MsgCoversations');
        // const q = query(docRef, where('from.id', '==', currentUser.id));
        // const docSnap = await getDocs(q);
        // let allChats: any[] = [];
        // docSnap.forEach(doc => {
        //     const messagesData = doc.data().msgs;
        //     if (conversationId === '') {
        //         setConversationId(doc.id);
        //     }

        //     allChats = [...allChats, ...messagesData];
        // });

        // // Sort messages by timestamp
        // allChats.sort((a, b) => {
        //     const timeA =
        //         a?.timeStamp instanceof Timestamp ? a?.timeStamp?.toMillis() : 0;
        //     const timeB =
        //         b?.timeStamp instanceof Timestamp ? b?.timeStamp?.toMillis() : 0;
        //     return timeA - timeB;
        // });

        // // Set state to update component with sorted messages
        // if (allChats.length > 0) {
        //     setChats(allChats);
        // }
        // // docSnap.forEach(doc => {
        // //   const messagesData = doc.data().msgs;
        // //   allChats.push(...messagesData); // Push all messages from this document to allChats array
        // // });
        // // allChats.reverse();
        // // setChats(allChats);
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchUserData();
  }, [currentUser.user.email]);
  let flatList: FlatList<ChatObj> | null;

  const [mlistner, setMListener] = useState<{
    listener: any;
  }>();
  console.log('conversationId', conversationId);

  useEffect(() => {
    if (conversationId !== '') {
      // let l = onSnapshot(
      //     doc(db, 'MsgCoversations', conversationId),
      //     conversation => {
      //         let dt: any = conversation.data();
      //         if (dt?.lastMsg?.user == 'support') {
      //             setChtEnable(true);
      //             addChat(dt.lastMsg.message, 'support', dt.msgs);
      //         }
      //     },
      // );
      // setMListener({
      //     listener: l,
      // });
    }
  }, [conversationId]);

  function createCoversation(cob: ChatObj) {
    // addDoc(collection(db, 'MsgCoversations'), {
    //     from: {
    //         name: currentUser.user.displayName + ' ' + currentUser.surName,
    //         id: currentUser.id,
    //         img: currentUser.img ? currentUser.img : defPI,
    //         type: 'Driver',
    //     },
    //     stat: 1,
    //     createdAt: Timestamp.now(),
    //     lastMsg: cob,
    //     msgs: [cob],
    // }).then(v => {
    //     setConversationId(v.id);
    //     getDoc(doc(db, 'MsgRequests', chatter.id)).then(t => {
    //         const ob: any = t.data();

    //         const ar = ob.req;
    //         const uob = ar.find((d: any) => d.uid == currentUser.id);
    //         if (uob) {
    //             updateDoc(doc(db, 'MsgRequests', chatter.id), {
    //                 req: arrayRemove(uob),
    //             }).then(t => {
    //                 updateDoc(doc(db, 'MsgRequests', chatter.id), {
    //                     req: arrayUnion({
    //                         conversationId: v.id,
    //                         stat: 1,
    //                         name: currentUser.user.displayName + ' ' + currentUser.surName,
    //                         uid: currentUser.id,
    //                         timeStamp: Timestamp.now(),
    //                     }),
    //                 });
    //             });
    //         } else {
    //             updateDoc(doc(db, 'MsgRequests', chatter.id), {
    //                 req: arrayUnion({
    //                     conversationId: v.id,
    //                     stat: 1,
    //                     name: currentUser.user.displayName + ' ' + currentUser.surName,
    //                     uid: currentUser.id,
    //                     timeStamp: Timestamp.now(),
    //                 }),
    //             });
    //         }
    //     });
    // });
  }

  function updateConversation(cob: ChatObj) {
    // updateDoc(doc(db, 'MsgCoversations', conversationId), {
    //     msgs: arrayUnion(cob),
    //     lastMsg: cob,
    //     updatedAt: Timestamp.now(),
    // });
  }

  function addChat(message: string, user: string, chats: ChatObj[]) {
    const nchat: ChatObj = {
      message: message,
      user: user,
      timeStamp: new Date().getTime(),
    };
    let nchats = [];
    chats.map(s => {
      nchats.push(s);
    });
    if (user != 'support') {
      chatText.current.clear();
      if (conversationId == '') {
        setChtEnable(false);
        createCoversation(nchat);
      } else {
        updateConversation(nchat);
      }
      nchats.push(nchat);
    }

    setChats(prevChats => {
      // Check if the message already exists in prevChats
      if (
        prevChats.some(
          chat => chat.message === nchat.message && chat.user === nchat.user,
        )
      ) {
        return prevChats; // If duplicate found, return previous state unchanged
      } else {
        return [...prevChats, nchat]; // Otherwise, add nchat to the previous chats
      }
    });
    // setChats(nchats);
    // console.log('-------------------------------------');
    // console.log(nchats);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {Platform.OS == 'android' && (
        <StatusBar barStyle={'light-content'} backgroundColor={'#212226'} />
      )}
      <View
        style={{
          backgroundColor: '#212226',
          height: height / 4,
          paddingTop: 40,
        }}>
      </View>
      <View style={{ marginHorizontal: '7%', marginTop: '5%', flex: 1 }}>
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
            item.user != 'support' ? (
              <View style={{ alignItems: 'flex-end' }}>
                <View
                  style={{
                    padding: '3%',
                    backgroundColor: '#212226',
                    marginVertical: '1%',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    maxWidth: '70%',
                  }}>
                  <View>
                    <Text
                      style={{
                        color: 'white',
                      }}>
                      {item.message}
                    </Text>
                    {item?.timeStamp ? (
                      <Text
                        style={{
                          color: 'white',
                        }}>
                        {timeAgo(item?.timeStamp)}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ) : (
              <View style={{ alignItems: 'flex-start' }}>
                <View
                  style={{
                    padding: '3%',
                    backgroundColor: '#4899CF',
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
                        }}>
                        {timeAgo(item?.timeStamp)}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            )
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
          <Pressable
            onPress={() => {
              if (chtEnable) {
                addChat(message, 'user', chats);
              } else {
                Alert.alert(
                  'Wait a second! ' + chatter.name + ' will reply you soon.',
                );
              }
            }}
            android_ripple={{
              color: '#bbb',
              borderless: true,
              radius: 30,
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon
                color={'#000'}
                name="send"
                size={35}
                style={{
                  marginLeft: 5,
                  marginTop: 3,
                }}
                type="ionicon"
              />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ChatPage