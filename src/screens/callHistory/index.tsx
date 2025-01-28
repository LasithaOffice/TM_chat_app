import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { loadAllUsers, loadCallLog } from '../../utilities/CommonFunction';
import { getUser, User } from '../../redux/slices/userSlice';
import UserCard from '../../components/userCard';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { lightColor } from '../../utilities/colors';
import CallLogItem from '../../components/callLogItem';
import LoadingContainer from '../../components/loadingContainer';

const CallHistory = () => {

  const curentUser = useSelector(getUser);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  function loadCallLogs() {
    setLoading(true);
    console.log("call logs", curentUser.user.email)
    loadCallLog(curentUser.user.email.replaceAll("@", "_").replaceAll(".", "_")).then(data => {
      console.log("data", data.val())
      setLoading(false);
      // setUsers((Object.values(data.val()) as User[]).filter((u: User) => u.email != curentUser.user.email) as User[]);
    }).catch(e => {
      console.log(e + "")
      setLoading(false);
    });
  }

  const nav: any = useNavigation();

  useEffect(() => {
    loadCallLogs()
  }, [])

  return (
    <View style={styles.container}>
      {/* <Text style={styles.mainHeader}>Call</Text> */}
      {
        (loading) ?
          <LoadingContainer />
          :
          <FlatList
            style={{ width: '100%', }}
            keyExtractor={(item, index) => index.toString()}
            data={users}
            renderItem={({ item }) =>
              <CallLogItem date='2 hours ago' log='missed call' user={item} key={item.email} />
            }
          />
      }
    </View>
  )
}

export default CallHistory

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darker
  },
  mainHeader: {
    fontSize: 30,
    fontWeight: '600',
    marginLeft: 20,
    color: lightColor
  },
  uname: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 10,
    marginTop: 10,
    color: '#aaa'
  },
  avatar: { width: 40, height: 40, marginLeft: 10 }
})