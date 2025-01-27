export type Avatars = 'male_1' | 'male_2' | 'male_3' | 'female_1' | 'female_2' | 'female_3';

export interface CallObject {
  callerId: string,
  callerName: string,
  callerAvatar: Avatars,
  status: "incoming" | "ended" | "incall",
  type: "voice" | "vodeo"
}