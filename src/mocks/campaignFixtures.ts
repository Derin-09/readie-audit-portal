import type {
  CampaignAssessmentVideo,
  CampaignEvaluationRecord,
  CampaignEvaluationResponse,
} from "../features/campaigns/types/campaign";
import { MOCK_ROOM_NAMES } from "./roomNames";

interface CampaignRecordInput {
  roomName: string;
  campaignId: number;
  userId: number;
  analyticsCompleted: boolean;
  candidateName: string | null;
  candidateEmail: string;
  candidateDateCreated: string;
  campaignJobTitle: string;
  percentageAnalyticCompleted: number;
  includeAssessmentVideo?: boolean;
}

function createAssessmentVideo(
  input: CampaignRecordInput,
): CampaignAssessmentVideo {
  const date = new Date(input.candidateDateCreated);
  const createdDate = Number.isNaN(date.getTime())
    ? "2026-01-01"
    : date.toISOString().slice(0, 10);
  const createdTime = Number.isNaN(date.getTime())
    ? "00:00:00"
    : date.toISOString().slice(11, 19);

  return {
    created_at: input.candidateDateCreated,
    video_url_link: `https://media.example.com/readie-mock/${encodeURIComponent(input.roomName)}/assessment.mp4`,
    userId: `mock-user-${input.userId}`,
    streakId: input.userId,
    profileAvatar: null,
    userName: input.candidateName ?? input.candidateEmail,
    userEmail: input.candidateEmail,
    totalQuestions: 12,
    correctCount: 9,
    wrongCount: 2,
    unansweredCount: 1,
    pctCorrect: 75,
    created_date: createdDate,
    created_time: createdTime,
    totalActivityCount: 48,
    activityCountsByType: JSON.stringify({
      tab_switch: 1,
      copy_paste: 0,
      idle: 2,
    }),
    invigilatorVideoUrlLink: `https://media.example.com/readie-mock/${encodeURIComponent(input.roomName)}/invigilator.mp4`,
  };
}

function createCampaignRecord(
  input: CampaignRecordInput,
): CampaignEvaluationRecord {
  return {
    roomName: input.roomName,
    campaignId: input.campaignId,
    userId: input.userId,
    analyticsCompleted: input.analyticsCompleted,
    candidateUserId: input.userId,
    candidateId: `candidate-${input.userId}`,
    candidateName: input.candidateName,
    candidateEmail: input.candidateEmail,
    candidateDateCreated: input.candidateDateCreated,
    campaignJobTitle: input.campaignJobTitle,
    percentageAnalyticCompleted: input.percentageAnalyticCompleted,
    campaign_assessment_video_link:
      input.includeAssessmentVideo === false
        ? []
        : [createAssessmentVideo(input)],
  };
}

export const MOCK_CAMPAIGNS: CampaignEvaluationResponse = [
  createCampaignRecord({
    roomName: MOCK_ROOM_NAMES.amaraMain,
    campaignId: 119,
    userId: 9101,
    analyticsCompleted: true,
    candidateName: "Amara Okafor",
    candidateEmail: "amara.okafor@example.com",
    candidateDateCreated: "2026-10-02T09:24:00.000Z",
    campaignJobTitle: "Senior Product Engineer",
    percentageAnalyticCompleted: 100,
  }),
  createCampaignRecord({
    roomName: MOCK_ROOM_NAMES.dmitri,
    campaignId: 119,
    userId: 9102,
    analyticsCompleted: false,
    candidateName: null,
    candidateEmail: "dmitri.volkov@example.com",
    candidateDateCreated: "2026-10-03T14:05:00.000Z",
    campaignJobTitle: "Senior Product Engineer",
    percentageAnalyticCompleted: 62,
    includeAssessmentVideo: false,
  }),
  createCampaignRecord({
    roomName: MOCK_ROOM_NAMES.amaraSecond,
    campaignId: 119,
    userId: 9103,
    analyticsCompleted: true,
    candidateName: "Amara Okafor",
    candidateEmail: "amara.okafor@example.com",
    candidateDateCreated: "2026-10-06T11:40:00.000Z",
    campaignJobTitle: "Senior Product Engineer",
    percentageAnalyticCompleted: 100,
  }),
  createCampaignRecord({
    roomName: MOCK_ROOM_NAMES.priya,
    campaignId: 120,
    userId: 9201,
    analyticsCompleted: true,
    candidateName: "Priya Nair",
    candidateEmail: "priya.nair@example.com",
    candidateDateCreated: "2026-10-08T08:12:00.000Z",
    campaignJobTitle: "Staff Data Analyst",
    percentageAnalyticCompleted: 100,
  }),
  createCampaignRecord({
    roomName: MOCK_ROOM_NAMES.lucas,
    campaignId: 120,
    userId: 9202,
    analyticsCompleted: false,
    candidateName: null,
    candidateEmail: "lucas.moreau@example.com",
    candidateDateCreated: "2026-10-09T16:48:00.000Z",
    campaignJobTitle: "Staff Data Analyst",
    percentageAnalyticCompleted: 38,
    includeAssessmentVideo: false,
  }),
  createCampaignRecord({
    roomName: MOCK_ROOM_NAMES.sofia,
    campaignId: 120,
    userId: 9203,
    analyticsCompleted: true,
    candidateName: "Sofia Reyes",
    candidateEmail: "sofia.reyes@example.com",
    candidateDateCreated: "2026-10-10T10:30:00.000Z",
    campaignJobTitle: "Staff Data Analyst",
    percentageAnalyticCompleted: 100,
  }),
  createCampaignRecord({
    roomName: MOCK_ROOM_NAMES.noah,
    campaignId: 122,
    userId: 9301,
    analyticsCompleted: true,
    candidateName: "Noah Williams",
    candidateEmail: "noah.williams@example.com",
    candidateDateCreated: "2026-10-14T12:20:00.000Z",
    campaignJobTitle: "Customer Success Lead",
    percentageAnalyticCompleted: 100,
  }),
  createCampaignRecord({
    roomName: MOCK_ROOM_NAMES.chen,
    campaignId: 122,
    userId: 9302,
    analyticsCompleted: false,
    candidateName: "Chen Wei",
    candidateEmail: "chen.wei@example.com",
    candidateDateCreated: "2026-10-15T07:55:00.000Z",
    campaignJobTitle: "Customer Success Lead",
    percentageAnalyticCompleted: 88,
    includeAssessmentVideo: false,
  }),
  createCampaignRecord({
    roomName: MOCK_ROOM_NAMES.mariam,
    campaignId: 122,
    userId: 9303,
    analyticsCompleted: true,
    candidateName: "Mariam Haddad",
    candidateEmail: "mariam.haddad@example.com",
    candidateDateCreated: "2026-10-16T18:05:00.000Z",
    campaignJobTitle: "Customer Success Lead",
    percentageAnalyticCompleted: 100,
  }),
  createCampaignRecord({
    roomName: MOCK_ROOM_NAMES.toroMain,
    campaignId: 123,
    userId: 9401,
    analyticsCompleted: true,
    candidateName: "Toro Adeyemi",
    candidateEmail: "toro29k@gmail.com",
    candidateDateCreated: "2026-10-19T09:00:00.000Z",
    campaignJobTitle: "Frontend Engineer",
    percentageAnalyticCompleted: 100,
  }),
  createCampaignRecord({
    roomName: MOCK_ROOM_NAMES.julia,
    campaignId: 123,
    userId: 9402,
    analyticsCompleted: false,
    candidateName: "Julia Kowalski",
    candidateEmail: "julia.kowalski@example.com",
    candidateDateCreated: "2026-10-20T13:37:00.000Z",
    campaignJobTitle: "Frontend Engineer",
    percentageAnalyticCompleted: 45,
    includeAssessmentVideo: false,
  }),
  createCampaignRecord({
    roomName: MOCK_ROOM_NAMES.toroSecond,
    campaignId: 123,
    userId: 9403,
    analyticsCompleted: true,
    candidateName: "Toro Adeyemi",
    candidateEmail: "toro29k@gmail.com",
    candidateDateCreated: "2026-10-22T15:10:00.000Z",
    campaignJobTitle: "Frontend Engineer",
    percentageAnalyticCompleted: 100,
  }),
];
