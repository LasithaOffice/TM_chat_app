import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { useSelector } from 'react-redux'
import { getUser } from '../../redux/slices/userSlice'
import Button from '../../components/button'
import { useNavigation } from '@react-navigation/native'

const Home = () => {

  const user = useSelector(getUser)

  const img = '../../resources/images/' + user.user.avatar;
  const nav: any = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeader}>TM Chat</Text>
      <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
        {
          (user.user.avatar === 'male_1') ?
            <Image style={styles.avatar} source={require('../../resources/images/male_1.png')} />
            :
            (user.user.avatar === 'male_2') ?
              <Image style={styles.avatar} source={require('../../resources/images/male_2.png')} />
              :
              (user.user.avatar === 'male_3') ?
                <Image style={styles.avatar} source={require('../../resources/images/male_3.png')} />
                :
                (user.user.avatar === 'female_1') ?
                  <Image style={styles.avatar} source={require('../../resources/images/female_1.png')} />
                  :
                  (user.user.avatar === 'female_2') ?
                    <Image style={styles.avatar} source={require('../../resources/images/female_2.png')} />
                    :
                    <Image style={styles.avatar} source={require('../../resources/images/male_1.png')} />

        }
        <Text style={styles.uname}>{"Welcome " + user.user.displayName}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 10 }}>
        <View style={{ flex: 0.48 }}><Button dark title='Voice Call' onPress={() => {
          nav.navigate('VoiceCall');
        }} /></View>
        <View style={{ flex: 0.48 }}><Button dark title='Video Call' onPress={() => { }} /></View>
      </View>
      <View style={{ marginHorizontal: 10, marginTop: 15 }}><Button dark title='New Chat' onPress={() => { }} /></View>
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
    color: '#ddd'
  },
  uname: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 10,
    color: '#aaa'
  },
  avatar: { width: 40, height: 40, marginLeft: 10 }
})