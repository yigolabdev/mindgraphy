import { WeddingDetailsFormData } from '@/lib/types/wedding-details';

const STORAGE_KEY = 'wedding_details_draft';

export const saveWeddingDetailsDraft = (data: WeddingDetailsFormData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save wedding details draft:', error);
  }
};

export const loadWeddingDetailsDraft = (): WeddingDetailsFormData | null => {
  try {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      return JSON.parse(savedDraft);
    }
  } catch (error) {
    console.error('Failed to load wedding details draft:', error);
  }
  return null;
};

export const clearWeddingDetailsDraft = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear wedding details draft:', error);
  }
};

export const getEmptyWeddingDetails = (): WeddingDetailsFormData => ({
  timeConfirmed: false,
  timetable: {
    makeupShop: '',
    makeupStartTime: '',
    makeupEndTime: '',
  },
  ceremony: {
    hasPreCeremonyPhoto: '',
    hasOfficiant: '',
    hasMC: '',
    mcType: '',
    hasRingExchange: '',
    hasFlowerGirl: '',
    hasPaebaek: '',
  },
  family: {
    groomFamily: '',
    brideFamily: '',
  },
  photoStyle: {
    preferredStyle: '',
    notPreferredStyle: '',
  },
  styling: {
    mainDressColor: '',
    mainDressStyle: '',
    receptionDressColor: '',
    receptionDressStyle: '',
    groomSuitInfo: '',
  },
  vendors: {
    dressShop: '',
    suitShop: '',
    makeupShop: '',
    planner: '',
    videoTeam: '',
    iphoneSnap: '',
    otherTeam: '',
  },
  specialEvents: '',
  specialRequests: '',
  honeymoon: {
    departure: '',
    destination: '',
    return: '',
  },
  meetingType: '',
  invitationUrl: '',
});
