import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { loadAllUsers, loadCallLog } from '../../utilities/CommonFunction';
import { getUser, User } from '../../redux/slices/userSlice';
import UserCard from '../../components/userCard';
import { useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { lightColor } from '../../utilities/colors';
import CallLogItem from '../../components/callLogItem';
import LoadingContainer from '../../components/loadingContainer';
import { CallLog } from '../../entity/types';

const CallHistory = () => {

  const curentUser = useSelector(getUser);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);

  function loadCallLogs() {
    console.log("call logs", curentUser.user.email)
    loadCallLog(curentUser.user.email.replaceAll("@", "_").replaceAll(".", "_")).then(data => {
      if (data.exists()) {
        console.log("data", data.val())
        setLoading(false);
        setIsRefreshing(false);
        setCallLogs((Object.values(data.val()) as CallLog[]).sort((a, b) => b.st_time - a.st_time));
      } else {
        setLoading(false);
        setIsRefreshing(false);
      }
    }).catch(e => {
      console.log(e + "")
      setLoading(false);
      setIsRefreshing(false);
    });
  }

  function onRefresh() {
    setIsRefreshing(true);
    loadCallLogs();
  }

  const nav: any = useNavigation();

  useEffect(() => {
    setLoading(true);
    loadCallLogs()
  }, [])

  return (
    <View style={styles.container}>
      {/* <Text style={styles.mainHeader}>Call</Text> */}
      {
        (loading) ?
          <LoadingContainer />
          :
          (callLogs.length > 0) ?
            <FlatList
              onRefresh={onRefresh}
              refreshing={isRefreshing}
              style={{ width: '100%', }}
              keyExtractor={(item, index) => index.toString()}
              data={callLogs}
              renderItem={({ item }) =>
                <CallLogItem callLog={item} key={item.callerId} />
              }
            />
            :
            <Text style={{ marginTop: 20, textAlign: 'center', color: lightColor }}>{"No call history"}</Text>
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