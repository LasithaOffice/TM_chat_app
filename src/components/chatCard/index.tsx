import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Avatar from '../avatar';
import { ConversationObj } from '../../entity/types';
import { disableColor, lightColor } from '../../utilities/colors';
import { timeAgo, timeAgoShort } from '../../utilities/CommonFunction';

const ChatCard = ({ conversation }: { conversation: ConversationObj }) => {
  return (
    <Pressable android_ripple={{
      color: disableColor
    }} style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', padding: 10 }}>
      <Avatar avt={conversation.avatar} size={40} marginLeft={10} />
      <View style={{ flex: 1 }}>
        <Text style={{
          marginLeft: 10,
          fontSize: 20,
          color: lightColor,
        }}>{conversation.displayName}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 2 }}>
          <Text style={{
            fontSize: 16,
            color: lightColor,
          }}>{conversation.message}</Text>
        </View>
      </View>
      <Text numberOfLines={1} style={{
        fontSize: 16,
        color: lightColor,
      }}>{timeAgoShort(conversation.timeStamp)}</Text>
    </Pressable>
  )
}

export default ChatCard