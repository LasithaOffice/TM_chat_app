import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Avatars } from '../../entity/types'

type Props = {
  avt: Avatars,
  size?: number,
  marginLeft?: number,
  marginTop?: number,
  marginBottom?: number,
  marginRight?: number,
}

const Avatar = (p: Props) => {
  return (
    (p.avt === 'male_1') ?
      <Image style={{
        width: (p.size) ? p.size : 40,
        height: (p.size) ? p.size : 40,
        marginLeft: (p.marginLeft) ? p.marginLeft : 0,
        marginTop: (p.marginTop) ? p.marginTop : 0,
        marginRight: (p.marginRight) ? p.marginRight : 0,
        marginBottom: (p.marginBottom) ? p.marginBottom : 0,
      }} source={require('../../resources/images/male_1.png')} />
      :
      (p.avt === 'male_2') ?
        <Image style={{
          width: (p.size) ? p.size : 40,
          height: (p.size) ? p.size : 40,
          marginLeft: (p.marginLeft) ? p.marginLeft : 0,
          marginTop: (p.marginTop) ? p.marginTop : 0,
          marginRight: (p.marginRight) ? p.marginRight : 0,
          marginBottom: (p.marginBottom) ? p.marginBottom : 0,
        }} source={require('../../resources/images/male_2.png')} />
        :
        (p.avt === 'male_3') ?
          <Image style={{
            width: (p.size) ? p.size : 40,
            height: (p.size) ? p.size : 40,
            marginLeft: (p.marginLeft) ? p.marginLeft : 0,
            marginTop: (p.marginTop) ? p.marginTop : 0,
            marginRight: (p.marginRight) ? p.marginRight : 0,
            marginBottom: (p.marginBottom) ? p.marginBottom : 0,
          }} source={require('../../resources/images/male_3.png')} />
          :
          (p.avt === 'female_1') ?
            <Image style={{
              width: (p.size) ? p.size : 40,
              height: (p.size) ? p.size : 40,
              marginLeft: (p.marginLeft) ? p.marginLeft : 0,
              marginTop: (p.marginTop) ? p.marginTop : 0,
              marginRight: (p.marginRight) ? p.marginRight : 0,
              marginBottom: (p.marginBottom) ? p.marginBottom : 0,
            }} source={require('../../resources/images/female_1.png')} />
            :
            (p.avt === 'female_2') ?
              <Image style={{
                width: (p.size) ? p.size : 40,
                height: (p.size) ? p.size : 40,
                marginLeft: (p.marginLeft) ? p.marginLeft : 0,
                marginTop: (p.marginTop) ? p.marginTop : 0,
                marginRight: (p.marginRight) ? p.marginRight : 0,
                marginBottom: (p.marginBottom) ? p.marginBottom : 0,
              }} source={require('../../resources/images/female_2.png')} />
              :
              <Image style={{
                width: (p.size) ? p.size : 40,
                height: (p.size) ? p.size : 40,
                marginLeft: (p.marginLeft) ? p.marginLeft : 0,
                marginTop: (p.marginTop) ? p.marginTop : 0,
                marginRight: (p.marginRight) ? p.marginRight : 0,
                marginBottom: (p.marginBottom) ? p.marginBottom : 0,
              }} source={require('../../resources/images/male_1.png')} />
  )
}

export default Avatar
