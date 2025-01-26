import { View, Text } from 'react-native'
import React from 'react'
import AgoraUIKit from 'agora-rn-uikit';

const VPreview = () => {

  const appId = '79fb6b3a4cd34b79a5e3b60379268854';
  const token = '007eJxTYFjySKiP6+ykbJ37p9nXPX759s41z+qvs2dt42Y66ql2JcZSgcHcMi3JLMk40SQ5xdgkydwy0TTVOMnMwNjc0sjMwsLU5HX1lPSGQEYGn5NmzIwMEAjiczGUZaak5scnJ+bkMDAAALW3I2Q=';
  const channelName = 'video_call';

  const connectionData = {
    appId: appId,
    channel: channelName,
    token: token, // enter your channel token as a string 
  };

  return (
    <AgoraUIKit connectionData={connectionData} />
    // <></>
  )
}

export default VPreview