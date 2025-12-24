// Wedding Details Form Types
export type YesNoAnswer = 'yes' | 'no' | '';
export type MCType = 'professional' | 'friend' | '';
export type MeetingType = 'direct' | 'phone' | 'list' | '';

export interface WeddingTimeTable {
  makeupShop: string;
  makeupStartTime: string;
  makeupEndTime: string;
}

export interface WeddingCeremony {
  hasPreCeremonyPhoto: YesNoAnswer;
  hasOfficiant: YesNoAnswer;
  hasMC: YesNoAnswer;
  mcType: MCType;
  hasRingExchange: YesNoAnswer;
  hasFlowerGirl: YesNoAnswer;
  hasPaebaek: YesNoAnswer;
}

export interface WeddingFamily {
  groomFamily: string;
  brideFamily: string;
}

export interface WeddingPhotoStyle {
  preferredStyle: string;
  notPreferredStyle: string;
}

export interface WeddingStyling {
  mainDressColor: string;
  mainDressStyle: string;
  receptionDressColor: string;
  receptionDressStyle: string;
  groomSuitInfo: string;
}

export interface WeddingVendors {
  dressShop: string;
  suitShop: string;
  makeupShop: string;
  planner: string;
  videoTeam: string;
  iphoneSnap: string;
  otherTeam: string;
}

export interface WeddingHoneymoon {
  departure: string;
  destination: string;
  return: string;
}

export interface WeddingDetailsFormData {
  timeConfirmed: boolean;
  timetable: WeddingTimeTable;
  ceremony: WeddingCeremony;
  family: WeddingFamily;
  photoStyle: WeddingPhotoStyle;
  styling: WeddingStyling;
  vendors: WeddingVendors;
  specialEvents: string;
  specialRequests: string;
  honeymoon: WeddingHoneymoon;
  meetingType: MeetingType;
  invitationUrl: string;
}
