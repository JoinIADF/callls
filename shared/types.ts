// Generic API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Core Data Models
export type UserRole = 'front-desk' | 'shift-lead' | 'manager' | 'owner';
export type StoreLocation = 'Ellisville' | 'Rock Hill';
export interface User {
  id: string;
  name: string;
  role: UserRole;
  store: StoreLocation;
  avatarUrl?: string;
}
export interface Dog {
  id: string;
  name: string;
  ownerName: string;
  store: StoreLocation;
  photoUrl?: string;
}
// Module-specific Models
// Meet & Greet Tracker
export type MeetAndGreetStatus = 'Attended' | 'No-Show' | 'Cancelled' | 'Rescheduled';
export interface MeetAndGreet {
  id: string;
  petName: string;
  ownerName: string;
  greetDateTime: string; // ISO 8601 string
  status: MeetAndGreetStatus;
  converted: boolean;
  staffId: string;
  notes?: string;
  store: StoreLocation;
  createdAt: string;
  updatedAt: string;
}
// Pet Parent Engagement
export type EngagementMilestone = '1 Month' | '6 Months' | '1 Year' | 'Anniversary' | 'Other';
export type EngagementFeedbackCategory = 'Concern' | 'Praise' | 'Suggestion';
export interface Engagement {
  id: string;
  parentName: string;
  milestone: EngagementMilestone;
  feedbackCategory: EngagementFeedbackCategory;
  notes: string;
  staffId: string;
  store: StoreLocation;
  createdAt: string;
}
// Observations & Dog Notes
export type ObservationType = 'Confidence' | 'Socialization' | 'Behavior' | 'Training Readiness';
export interface Observation {
  id: string;
  dogId: string;
  dogName: string; // Denormalized for easier display
  date: string; // ISO 8601 string
  shift: 'AM' | 'PM';
  observationType: ObservationType;
  notes: string;
  staffId: string;
  store: StoreLocation;
}
// Shift Lead Report
export interface ShiftReport {
  id: string;
  date: string; // ISO 8601 string
  shiftLeadId: string;
  enrollmentAdds: number;
  enrollmentDrops: number;
  enrollmentPauses: number;
  newVisits: number;
  returnVisits: number;
  issues: string;
  staffHighlights: string;
  capacity: number;
  store: StoreLocation;
}