import type { User } from "./user";

export const ReviewStatus = {
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];

export interface SubjectData {
  id: string;
  name: string;
  description: string;
}

export interface SubjectRequest {
  id: string;
  subject: SubjectData;
  subjectId: string;
  reviewedById: string;
  reviewedBy?: User | null;
  status: ReviewStatus;
  reviewNotes: string;
  createdAt: string;
  updatedAt: string;
}

interface TeacherSubjectRequest extends SubjectRequest {
  teacherId: string;
}
interface StudentSubjectRequest extends SubjectRequest {
  studentId: string;
}

export interface CreateSubjectRequest {
  studentId?: string;
  teacherId?: string;
  subjectId: string;
}
