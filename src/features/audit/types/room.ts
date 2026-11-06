export type RecordingStatus = "PERSISTED" | (string & {});
export type AnalyticsCompleted = "Y" | "N" | (string & {});
export type Disposition =
  | "REVIEW_REQUIRED"
  | "PASS_WITH_LOW_RISK"
  | (string & {});
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | (string & {});
export type Decision = "INCONCLUSIVE" | "PASS" | "FAIL" | (string & {});
export type VideoQuality = "UNKNOWN" | "GOOD" | "POOR" | (string & {});

export interface Observation {
  timestamp: string;
  source: string;
  category: string;
  observation: string;
}

export interface RiskAssessment {
  risk: RiskLevel;
  confidence: number;
  observations: Observation[];
}

export interface TranscriptEntry {
  timestamp: string;
  speaker: string;
  text: string;
  videoUrl: string;
}

export interface Transcript {
  entries: TranscriptEntry[];
}

export interface GeminiAnalysis {
  overallRisk: RiskLevel;
  syntheticVideo: RiskAssessment;
  personContinuity: RiskAssessment;
  audioVideoConsistency: RiskAssessment;
  possibleOffScreenAssistance: RiskAssessment;
  suspiciousTimeRanges: unknown[];
  limitations: string[];
  transcript: Transcript;
  identityPhase1?: IdentityPhase1;
}

export interface IdentityPhase1 {
  decision: Decision;
  confidence: number;
  referenceVideoQuality: VideoQuality;
  interviewVideoQuality: VideoQuality;
  multiplePeopleDetected: boolean;
  matchingEvidence: unknown[];
  conflictingEvidence: unknown[];
  limitations: string[];
}

export interface DeepfakePhase2 {
  gemini: GeminiAnalysis;
  specialistResults: unknown[];
  disposition: Disposition;
  humanReviewRequired: boolean;
}

export interface Analytic {
  candidateId?: string;
  identity_phase1: IdentityPhase1 | null;
  deepfake_phase2: DeepfakePhase2;
  disposition: Disposition;
  humanReviewRequired: boolean;
}

export interface CampaignRecording {
  roomName: string;
  recordingType: "COMPOSITE" | (string & {});
  campaignId: number;
  updatedAt: string;
  databaseType: "CAMPAIGN_COMPOSITE_INTERVIEW" | (string & {});
  objectPath: string;
  egressId: string;
  participantIdentity: string | null;
  userId: number;
  finalUrl: string;
  status: RecordingStatus;
  attempts: number;
  lastError: string | null;
  campaignRecordId: number;
  nextCheckAt: string;
  createdAt: string;
  persistedAt: string;
  parsedCampaignId: string;
  extractedEmail: string;
  campaignAssessments: unknown[];
  analytic: Analytic;
  analyticsCompleted: AnalyticsCompleted;
}

export type CampaignRecordingsResponse = CampaignRecording[];
