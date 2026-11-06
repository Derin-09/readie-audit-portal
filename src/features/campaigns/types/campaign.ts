export interface CampaignAssessmentVideo {
  created_at: string;
  video_url_link: string;
  userId: string;
  streakId: number;
  profileAvatar: string | null;
  userName: string;
  userEmail: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  pctCorrect: number;
  created_date: string;
  created_time: string;
  totalActivityCount: number;
  activityCountsByType: string;
  invigilatorVideoUrlLink: string;
}

export interface CampaignEvaluationRecord {
  roomName: string;
  campaignId: number;
  userId: number;
  analyticsCompleted: boolean;
  candidateUserId: number | null;
  candidateId: string | null;
  candidateName: string | null;
  candidateEmail: string;
  candidateDateCreated: string;
  campaignJobTitle: string;
  percentageAnalyticCompleted: number;
  campaign_assessment_video_link: CampaignAssessmentVideo[];
}

export type CampaignEvaluationResponse = CampaignEvaluationRecord[];
