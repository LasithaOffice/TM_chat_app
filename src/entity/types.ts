export type Avatars = 'male_1' | 'male_2' | 'male_3' | 'female_1' | 'female_2' | 'female_3';

export interface CallObject {
  callerId: string,
  callerName: string,
  callerAvatar: Avatars,
  status: "incoming" | "ended" | "incall",
  type: "voice" | "video"
}

export interface CallLog {
  displayName: string
  avatar: Avatars
  callerId: string
  en_time: number
  role: "sender" | "receiver",
  type: "voice" | "video",
  st_time: number
  status: "connected" | "missed"
}