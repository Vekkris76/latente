import { PlaceCategory, TimeBucket, DayType } from '../types/enums';

export type WindowProposalStatus = 
  | "pending" 
  | "accepted_by_a" 
  | "accepted_by_b" 
  | "activated" 
  | "declined" 
  | "expired";

export interface WindowProposal {
  id: string;
  coPresenceId?: string;
  userA_id: string;
  userB_id: string;
  place_category: PlaceCategory;
  time_bucket: TimeBucket;
  day_type: DayType;
  proposed_date: string; // YYYY-MM-DD
  start_time: string;    // HH:MM
  end_time: string;      // HH:MM
  status: WindowProposalStatus;
  acceptA: boolean;
  acceptB: boolean;
  declined_by: string | null;
  created_at: Date;
  expires_at?: Date;
}
