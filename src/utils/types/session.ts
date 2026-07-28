import type { UserProfileData } from "@utils/types/user";

export const SessionStatus = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  MISSED: "MISSED",
  RUNNING: "RUNNING",
};
export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

export interface SessionData {
  id: string;
  title: string;
  description: string | null;
  studentId: string;
  teacherId: string;
  subjectId: string;
  startTime: string;
  endTime: string;
  duration: number | null;
  externalLink: string;
  googleEventId: string | null;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  student: { user: UserProfileData };
  teacher: { user: UserProfileData };
  subject: { name: string };
}

export interface SessionFeedback {
  id: string;
  receiverId: string;
  receiver: UserProfileData;
  senderId: string;
  sender: UserProfileData;
  sessionId: string;
  session: SessionData;
  rating: number;
  comment: string;
}
