import { rdb } from "../firebase/firebaseInit";

export async function loadAllUsers() {
  return rdb.ref('/users/')
    .once('value');
}

export async function loadCallLog(uid: string) {
  return rdb.ref('/callLogs/' + uid + '/')
    .once('value');
}
