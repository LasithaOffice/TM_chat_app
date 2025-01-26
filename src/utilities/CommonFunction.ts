import { rdb } from "../firebase/firebaseInit";

export async function loadAllUsers() {
  return rdb.ref('/users/')
    .once('value');
}
