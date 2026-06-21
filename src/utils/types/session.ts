export const SessionStatus = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  MISSED: "MISSED",
  RUNNING: "RUNNING",
};
export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];
