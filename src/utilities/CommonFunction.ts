import { rdb } from "../firebase/firebaseInit";

export async function loadAllUsers() {
  return rdb.ref('/users/')
    .once('value');
}

export async function loadCallLog(uid: string) {
  return rdb.ref('/callLogs/' + uid + '/')
    .once('value');
}

export function timeAgo(date: number) {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now"; // Less than a minute
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`; // Less than an hour
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`; // Less than a day
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`; // Less than a week

  // For older dates, use a full date format
  // const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return postDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function duration(st: number, en: number) {
  const duration = new Date(en - st);
  const diffInSeconds = (en - st);
  console.log(`duration: ${diffInSeconds}`);
  if (duration.getUTCMinutes() == 0) return duration.getUTCSeconds() + "s"; // Less than a minute
  if (duration.getUTCHours() == 0) return duration.getUTCMinutes() + "m " + duration.getUTCSeconds() + "s"; // Less than a minute
  return duration.getUTCHours() + "h " + duration.getUTCMinutes() + "m"; // Less than an hour
}
