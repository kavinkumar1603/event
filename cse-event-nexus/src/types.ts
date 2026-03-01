export enum UserRole {
  FACULTY = 'FACULTY',
  HOD = 'HOD',
  PRINCIPAL = 'PRINCIPAL',
  STUDENT_ORGANIZER = 'STUDENT_ORGANIZER',
  STUDENT_GENERAL = 'STUDENT_GENERAL',
}

export enum EventStatus {
  PENDING_FACULTY = 'PENDING_FACULTY',
  PENDING_HOD = 'PENDING_HOD',
  PENDING_PRINCIPAL = 'PENDING_PRINCIPAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isApprovedOrganizer?: boolean;
}

export interface MediaRequirement {
  poster: boolean;
  brochure: boolean;
  photo: boolean;
  certificate: boolean;
}

export interface ITSupport {
  desktop: boolean;
  lanWifi: boolean;
  numUsers: number;
}

export interface AVSupport {
  display: boolean;
  micColor: boolean;
  micHand: boolean;
  micPodium: boolean;
}

export interface EventRequest {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizerName: string;
  date: string;
  venue: string;
  status: EventStatus;
  media: MediaRequirement;
  food: {
    available: boolean;
    vipMenu: string;
    generalMenu: string;
  };
  guest: {
    name: string;
    details: string;
    accommodation: boolean;
  };
  itSupport: ITSupport;
  avSupport: AVSupport;
  createdAt: string;
}

export interface IQACReport {
  eventId: string;
  requestDoc: string;
  brochureDoc: string;
  scheduleDoc: string;
  registrationDetails: string;
  attendanceDoc: string;
  geoTagPhoto: string;
  resourcePersonProfile: string;
  participantFeedback: string;
  guestFeedback: string;
  reportDoc: string;
  submittedAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  timestamp: string;
}
