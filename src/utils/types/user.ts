export const Role = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const Level = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
} as const;

export type Level = (typeof Level)[keyof typeof Level];

export const VerificationStatus = {
  VERIFIED: "VERIFIED",
  NOT_VERIFIED: "NOT_VERIFIED",
} as const;

export type VerificationStatus =
  (typeof VerificationStatus)[keyof typeof VerificationStatus];

export interface SignupFormData {
  // User Base Fields
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;

  // Shared Profile Fields
  country: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  dateOfBirth: string;
  bio: string;
  timeZone: string;

  // Teacher Specific Fields
  yearsOfExperience: number | 0;
  languages: string[];
  teachingLevels: Level[];

  // Student Specific Fields
  level: Level;

  // Optional Parent Sub-relation Fields
  parentName: string;
  parentPhone: string;
  parentEmail: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
