import type {
  Analytic,
  AnalyticsCompleted,
  CampaignRecording,
  CampaignRecordingsResponse,
  DeepfakePhase2,
  Disposition,
  GeminiAnalysis,
  IdentityPhase1,
  Observation,
  RiskAssessment,
  RiskLevel,
  TranscriptEntry,
  VideoQuality,
} from "../features/audit/types/room";
import { MOCK_ROOM_NAMES } from "./roomNames";

const MOCK_MEDIA_BASE = "https://media.example.com/readie-mock";

function observation(
  timestamp: string,
  source: string,
  category: string,
  description: string,
): Observation {
  return {
    timestamp,
    source,
    category,
    observation: description,
  };
}

function risk(
  level: RiskLevel,
  confidence: number,
  observations: Observation[] = [],
): RiskAssessment {
  return {
    risk: level,
    confidence,
    observations,
  };
}

interface GeminiInput {
  overallRisk: RiskLevel;
  syntheticVideo: RiskAssessment;
  personContinuity: RiskAssessment;
  audioVideoConsistency: RiskAssessment;
  possibleOffScreenAssistance: RiskAssessment;
  suspiciousTimeRanges?: unknown[];
  limitations?: string[];
  transcriptEntries?: TranscriptEntry[];
}

function gemini(input: GeminiInput): GeminiAnalysis {
  return {
    overallRisk: input.overallRisk,
    syntheticVideo: input.syntheticVideo,
    personContinuity: input.personContinuity,
    audioVideoConsistency: input.audioVideoConsistency,
    possibleOffScreenAssistance: input.possibleOffScreenAssistance,
    suspiciousTimeRanges: input.suspiciousTimeRanges ?? [],
    limitations: input.limitations ?? [],
    transcript: {
      entries: input.transcriptEntries ?? [],
    },
  };
}

function deepfake(
  analysis: GeminiAnalysis,
  disposition: Disposition,
  humanReviewRequired: boolean,
  specialistResults: unknown[] = [],
): DeepfakePhase2 {
  return {
    gemini: analysis,
    specialistResults,
    disposition,
    humanReviewRequired,
  };
}

function analytic(
  identity: IdentityPhase1 | null,
  phase2: DeepfakePhase2,
): Analytic {
  return {
    identity_phase1: identity,
    deepfake_phase2: phase2,
    disposition: phase2.disposition,
    humanReviewRequired: phase2.humanReviewRequired,
  };
}

function identity(
  decision: IdentityPhase1["decision"],
  confidence: number,
  referenceVideoQuality: VideoQuality,
  interviewVideoQuality: VideoQuality,
  multiplePeopleDetected: boolean,
  matchingEvidence: unknown[],
  conflictingEvidence: unknown[],
  limitations: string[],
): IdentityPhase1 {
  return {
    decision,
    confidence,
    referenceVideoQuality,
    interviewVideoQuality,
    multiplePeopleDetected,
    matchingEvidence,
    conflictingEvidence,
    limitations,
  };
}

interface RecordingInput {
  roomName: string;
  campaignId: number;
  email: string;
  userId: number;
  campaignRecordId: number;
  participantIdentity: string | null;
  analyticsCompleted: AnalyticsCompleted;
  analytic: Analytic;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  persistedAt?: string;
}

function recording(input: RecordingInput): CampaignRecording {
  const encodedRoom = encodeURIComponent(input.roomName);

  return {
    roomName: input.roomName,
    recordingType: "COMPOSITE",
    campaignId: input.campaignId,
    updatedAt: input.updatedAt ?? "2026-10-24T10:00:00.000Z",
    databaseType: "CAMPAIGN_COMPOSITE_INTERVIEW",
    objectPath: `mock-recordings/${encodedRoom}/composite.mp4`,
    egressId: `egress-mock-${input.userId}`,
    participantIdentity: input.participantIdentity,
    userId: input.userId,
    finalUrl: `${MOCK_MEDIA_BASE}/${encodedRoom}/composite.mp4`,
    status: input.status ?? "PERSISTED",
    attempts: 1,
    lastError: null,
    campaignRecordId: input.campaignRecordId,
    nextCheckAt: "2026-10-25T10:00:00.000Z",
    createdAt: input.createdAt ?? "2026-10-19T09:01:00.000Z",
    persistedAt: input.persistedAt ?? "2026-10-19T09:34:00.000Z",
    parsedCampaignId: String(input.campaignId),
    extractedEmail: input.email,
    campaignAssessments: [],
    analytic: input.analytic,
    analyticsCompleted: input.analyticsCompleted,
  };
}

const amaraIdentity = identity(
  "PASS",
  0.97,
  "GOOD",
  "GOOD",
  false,
  [
    "Reference and interview face embeddings remain within the configured similarity threshold.",
    "No additional face tracks were detected during the interview.",
  ],
  [],
  [],
);

const amaraDeepfake = deepfake(
  gemini({
    overallRisk: "LOW",
    syntheticVideo: risk("LOW", 0.91, [
      observation(
        "00:00:00",
        "Gemini",
        "Video synthesis",
        "No temporal or spatial synthesis artifacts were observed in sampled frames.",
      ),
    ]),
    personContinuity: risk("LOW", 0.94, [
      observation(
        "00:01:40",
        "Gemini",
        "Identity continuity",
        "Facial landmarks and clothing remained consistent across the session.",
      ),
    ]),
    audioVideoConsistency: risk("LOW", 0.9),
    possibleOffScreenAssistance: risk("LOW", 0.88),
    limitations: ["Analysis is based on the processed composite recording."],
    transcriptEntries: [
      {
        timestamp: "00:00:08",
        speaker: "Interviewer",
        text: "Welcome, Amara. Let's begin with a short overview of your recent platform work.",
        videoUrl: `${MOCK_MEDIA_BASE}/amara-interview-000008.mp4`,
      },
      {
        timestamp: "00:00:24",
        speaker: "Amara Okafor",
        text: "Thanks. I led the migration of our candidate review workflow to a signal-based frontend architecture.",
        videoUrl: `${MOCK_MEDIA_BASE}/amara-interview-000024.mp4`,
      },
      {
        timestamp: "00:01:12",
        speaker: "Interviewer",
        text: "How did you measure the impact of that migration?",
        videoUrl: "",
      },
      {
        timestamp: "00:01:28",
        speaker: "Amara Okafor",
        text: "We tracked review latency, render stability and the number of manual escalations per week.",
        videoUrl: `${MOCK_MEDIA_BASE}/amara-interview-000128.mp4`,
      },
      {
        timestamp: "00:02:05",
        speaker: "Amara Okafor",
        text: "The largest improvement came from removing repeated state synchronization between the review queue and the detail drawer.",
        videoUrl: "",
      },
    ],
  }),
  "PASS_WITH_LOW_RISK",
  false,
);

const dmitriPhase2 = deepfake(
  gemini({
    overallRisk: "MEDIUM",
    syntheticVideo: risk("LOW", 0.55),
    personContinuity: risk("MEDIUM", 0.61, [
      observation(
        "00:02:10",
        "Gemini",
        "Framing",
        "The candidate moved outside the calibrated center frame for a short interval.",
      ),
    ]),
    audioVideoConsistency: risk("LOW", 0.52),
    possibleOffScreenAssistance: risk("LOW", 0.44),
    limitations: ["Automated analysis is still in progress for this recording."],
  }),
  "REVIEW_REQUIRED",
  true,
);

const amaraSecondIdentity = identity(
  "INCONCLUSIVE",
  0.66,
  "POOR",
  "GOOD",
  false,
  ["Face similarity remains within range for the clearest sections of the interview."],
  ["Lighting variation reduces comparison confidence in two segments."],
  ["The reference video contains several low-light frames."],
);

const amaraSecondDeepfake = deepfake(
  gemini({
    overallRisk: "HIGH",
    syntheticVideo: risk("HIGH", 0.89, [
      observation(
        "00:03:12",
        "Gemini",
        "Synthetic artifacts",
        "Frame-level variance suggests possible synthesis around the three-minute mark.",
      ),
      observation(
        "00:03:28",
        "Specialist model",
        "Temporal consistency",
        "Facial texture changes are inconsistent with the surrounding footage.",
      ),
    ]),
    personContinuity: risk("MEDIUM", 0.72, [
      observation(
        "00:03:20",
        "Gemini",
        "Identity continuity",
        "Jawline geometry shifts briefly during a rapid head turn.",
      ),
    ]),
    audioVideoConsistency: risk("MEDIUM", 0.68, [
      observation(
        "00:04:02",
        "Gemini",
        "Audio alignment",
        "Speech and lip movement are offset beyond the expected tolerance for several frames.",
      ),
    ]),
    possibleOffScreenAssistance: risk("HIGH", 0.81, [
      observation(
        "00:07:05",
        "Audio analysis",
        "Off-screen audio",
        "A second voice-like signal is present at low volume near the right channel.",
      ),
    ]),
    suspiciousTimeRanges: ["00:03:10 - 00:03:42", "00:07:05 - 00:07:20"],
    limitations: [
      "Compression artifacts reduce frame-level certainty.",
      "Audio analysis excludes background noise above 65 dB.",
    ],
    transcriptEntries: [
      {
        timestamp: "00:02:54",
        speaker: "Interviewer",
        text: "Can you walk me through the trade-offs you considered?",
        videoUrl: `${MOCK_MEDIA_BASE}/amara-second-000254.mp4`,
      },
      {
        timestamp: "00:03:12",
        speaker: "Amara Okafor",
        text: "The main trade-off was between delivery speed and keeping the review surface predictable.",
        videoUrl: `${MOCK_MEDIA_BASE}/amara-second-000312.mp4`,
      },
      {
        timestamp: "00:03:44",
        speaker: "Interviewer",
        text: "What would you change if you started again?",
        videoUrl: "",
      },
      {
        timestamp: "00:04:01",
        speaker: "Amara Okafor",
        text: "I would establish the audit events earlier so the UI could consume a single source of truth.",
        videoUrl: `${MOCK_MEDIA_BASE}/amara-second-000401.mp4`,
      },
    ],
  }),
  "REVIEW_REQUIRED",
  true,
  [
    "Specialist model returned a high synthetic-video probability for segment 00:03:10-00:03:42.",
  ],
);

const priyaIdentity = identity(
  "PASS",
  0.95,
  "GOOD",
  "GOOD",
  false,
  ["Reference and interview frames show stable facial geometry across the session."],
  [],
  [],
);

const priyaDeepfake = deepfake(
  gemini({
    overallRisk: "LOW",
    syntheticVideo: risk("LOW", 0.93),
    personContinuity: risk("LOW", 0.96, [
      observation(
        "00:02:02",
        "Gemini",
        "Identity continuity",
        "No meaningful changes in facial structure or appearance were detected.",
      ),
    ]),
    audioVideoConsistency: risk("LOW", 0.9),
    possibleOffScreenAssistance: risk("LOW", 0.86),
    transcriptEntries: [
      {
        timestamp: "00:00:05",
        speaker: "Interviewer",
        text: "Tell me about a dashboard you built for an operational team.",
        videoUrl: `${MOCK_MEDIA_BASE}/priya-interview-000005.mp4`,
      },
      {
        timestamp: "00:00:31",
        speaker: "Priya Nair",
        text: "I built a queue health dashboard that combined service latency, backlog age and reviewer throughput.",
        videoUrl: `${MOCK_MEDIA_BASE}/priya-interview-000031.mp4`,
      },
      {
        timestamp: "00:01:14",
        speaker: "Priya Nair",
        text: "The difficult part was making the definitions of each metric visible to both operations and engineering.",
        videoUrl: "",
      },
      {
        timestamp: "00:02:03",
        speaker: "Interviewer",
        text: "How did you validate that the metrics were trusted?",
        videoUrl: `${MOCK_MEDIA_BASE}/priya-interview-000203.mp4`,
      },
      {
        timestamp: "00:02:20",
        speaker: "Priya Nair",
        text: "We compared the dashboard against weekly manual reconciliations and documented every reconciliation gap.",
        videoUrl: `${MOCK_MEDIA_BASE}/priya-interview-000220.mp4`,
      },
      {
        timestamp: "00:03:08",
        speaker: "Priya Nair",
        text: "After the first month, the operations team was using it as the primary handoff surface.",
        videoUrl: "",
      },
    ],
  }),
  "PASS_WITH_LOW_RISK",
  false,
);

const lucasPhase2 = deepfake(
  gemini({
    overallRisk: "MEDIUM",
    syntheticVideo: risk("LOW", 0.5),
    personContinuity: risk("MEDIUM", 0.64, [
      observation(
        "00:01:36",
        "Proctoring",
        "Framing",
        "The candidate briefly leaves the center of the calibrated frame.",
      ),
    ]),
    audioVideoConsistency: risk("LOW", 0.49),
    possibleOffScreenAssistance: risk("MEDIUM", 0.62, [
      observation(
        "00:04:18",
        "Audio analysis",
        "Off-screen audio",
        "Audio contains a second voice-like signal near the four-minute mark.",
      ),
    ]),
    suspiciousTimeRanges: ["00:04:15 - 00:04:26"],
    limitations: ["Only partial analysis is available for this recording."],
  }),
  "REVIEW_REQUIRED",
  true,
);

const sofiaIdentity = identity(
  "FAIL",
  0.88,
  "GOOD",
  "POOR",
  true,
  [],
  ["Multiple face tracks were detected during the interview."],
  ["The interview feed contains overlapping faces in several sections."],
);

const sofiaDeepfake = deepfake(
  gemini({
    overallRisk: "HIGH",
    syntheticVideo: risk("MEDIUM", 0.73, [
      observation(
        "00:01:58",
        "Gemini",
        "Synthetic artifacts",
        "Texture inconsistencies appear in a short segment after a scene change.",
      ),
    ]),
    personContinuity: risk("HIGH", 0.91, [
      observation(
        "00:02:12",
        "Gemini",
        "Identity continuity",
        "Facial proportions change noticeably between consecutive frames.",
      ),
      observation(
        "00:02:40",
        "Proctoring",
        "Multiple people",
        "A second face is visible at the edge of the frame.",
      ),
    ]),
    audioVideoConsistency: risk("MEDIUM", 0.7),
    possibleOffScreenAssistance: risk("HIGH", 0.84, [
      observation(
        "00:02:46",
        "Audio analysis",
        "Off-screen audio",
        "A sustained second voice is detected behind the candidate's speech.",
      ),
    ]),
    suspiciousTimeRanges: ["00:02:10 - 00:02:58", "00:05:04 - 00:05:19"],
    limitations: [
      "The interview feed contains overlapping faces.",
      "Audio separation is less reliable during simultaneous speech.",
    ],
    transcriptEntries: [
      {
        timestamp: "00:02:02",
        speaker: "Interviewer",
        text: "Describe how you would structure a customer escalation review.",
        videoUrl: `${MOCK_MEDIA_BASE}/sofia-interview-000202.mp4`,
      },
      {
        timestamp: "00:02:24",
        speaker: "Sofia Reyes",
        text: "I would start by separating the customer impact from the internal process failure.",
        videoUrl: `${MOCK_MEDIA_BASE}/sofia-interview-000224.mp4`,
      },
      {
        timestamp: "00:02:51",
        speaker: "Sofia Reyes",
        text: "Then I would assign a single owner for the remediation timeline and publish a follow-up date.",
        videoUrl: "",
      },
    ],
  }),
  "REVIEW_REQUIRED",
  true,
  [
    {
      result: "Synthetic-video specialist flagged segment 00:02:40-00:03:05.",
      confidence: 0.87,
    },
  ],
);

const noahIdentity = identity(
  "PASS",
  0.9,
  "GOOD",
  "GOOD",
  false,
  ["Face similarity remained within the expected range throughout the interview."],
  [],
  [],
);

const noahDeepfake = deepfake(
  gemini({
    overallRisk: "LOW",
    syntheticVideo: risk("LOW", 0.88),
    personContinuity: risk("LOW", 0.92),
    audioVideoConsistency: risk("MEDIUM", 0.58, [
      observation(
        "00:03:14",
        "Gemini",
        "Audio alignment",
        "Lip movement and speech diverge slightly during a fast response.",
      ),
    ]),
    possibleOffScreenAssistance: risk("LOW", 0.83),
    transcriptEntries: [
      {
        timestamp: "00:00:07",
        speaker: "Interviewer",
        text: "What does a healthy customer escalation process look like to you?",
        videoUrl: `${MOCK_MEDIA_BASE}/noah-interview-000007.mp4`,
      },
      {
        timestamp: "00:00:33",
        speaker: "Noah Williams",
        text: "It starts with a clear severity model and a named owner for every open action.",
        videoUrl: `${MOCK_MEDIA_BASE}/noah-interview-000033.mp4`,
      },
      {
        timestamp: "00:01:28",
        speaker: "Noah Williams",
        text: "The process also needs a visible decision log so the customer does not have to repeat context.",
        videoUrl: "",
      },
      {
        timestamp: "00:02:12",
        speaker: "Interviewer",
        text: "How would you measure whether it is working?",
        videoUrl: `${MOCK_MEDIA_BASE}/noah-interview-000212.mp4`,
      },
    ],
  }),
  "REVIEW_REQUIRED",
  true,
);

const chenPhase2 = deepfake(
  gemini({
    overallRisk: "LOW",
    syntheticVideo: risk("LOW", 0.48),
    personContinuity: risk("MEDIUM", 0.54),
    audioVideoConsistency: risk("LOW", 0.46),
    possibleOffScreenAssistance: risk("LOW", 0.42),
    limitations: ["Analysis is continuing for the remaining interview segments."],
  }),
  "REVIEW_REQUIRED",
  true,
);

const mariamIdentity = identity(
  "INCONCLUSIVE",
  0.59,
  "UNKNOWN",
  "GOOD",
  false,
  [],
  ["Reference frame quality is insufficient for a conclusive comparison."],
  ["Reference video quality is unknown."],
);

const mariamDeepfake = deepfake(
  gemini({
    overallRisk: "MEDIUM",
    syntheticVideo: risk("LOW", 0.69),
    personContinuity: risk("MEDIUM", 0.63, [
      observation(
        "00:02:34",
        "Gemini",
        "Identity continuity",
        "Minor facial landmark drift appears when the candidate turns toward a second monitor.",
      ),
    ]),
    audioVideoConsistency: risk("LOW", 0.71),
    possibleOffScreenAssistance: risk("MEDIUM", 0.57, [
      observation(
        "00:06:18",
        "Audio analysis",
        "Off-screen audio",
        "Keyboard activity is audible near a response that references external notes.",
      ),
    ]),
    limitations: ["Identity comparison is limited by the reference video quality."],
    transcriptEntries: [
      {
        timestamp: "00:01:44",
        speaker: "Interviewer",
        text: "What signals tell you a customer account needs a different support motion?",
        videoUrl: `${MOCK_MEDIA_BASE}/mariam-interview-000144.mp4`,
      },
      {
        timestamp: "00:02:10",
        speaker: "Mariam Haddad",
        text: "I look at unresolved dependencies, repeated contacts and whether the account has a clear executive sponsor.",
        videoUrl: `${MOCK_MEDIA_BASE}/mariam-interview-000210.mp4`,
      },
      {
        timestamp: "00:06:21",
        speaker: "Mariam Haddad",
        text: "If the pattern continues, I would bring the account into a structured recovery review.",
        videoUrl: "",
      },
    ],
  }),
  "REVIEW_REQUIRED",
  true,
);

const toroIdentity = identity(
  "PASS",
  0.96,
  "GOOD",
  "GOOD",
  false,
  ["Reference and interview face embeddings are strongly aligned."],
  [],
  [],
);

const toroDeepfake = deepfake(
  gemini({
    overallRisk: "LOW",
    syntheticVideo: risk("LOW", 0.92, [
      observation(
        "00:00:00",
        "Gemini",
        "Video synthesis",
        "No synthetic-video indicators were found in the sampled frames.",
      ),
    ]),
    personContinuity: risk("LOW", 0.95),
    audioVideoConsistency: risk("LOW", 0.91),
    possibleOffScreenAssistance: risk("LOW", 0.87),
    transcriptEntries: [
      {
        timestamp: "00:00:06",
        speaker: "Interviewer",
        text: "Walk me through a frontend system you designed from scratch.",
        videoUrl: `${MOCK_MEDIA_BASE}/toro-interview-000006.mp4`,
      },
      {
        timestamp: "00:00:29",
        speaker: "Toro Adeyemi",
        text: "I designed a review workspace that separated evidence loading from the interaction state.",
        videoUrl: `${MOCK_MEDIA_BASE}/toro-interview-000029.mp4`,
      },
      {
        timestamp: "00:01:11",
        speaker: "Toro Adeyemi",
        text: "That let us prefetch transcripts while keeping the visible tab state in the URL.",
        videoUrl: "",
      },
      {
        timestamp: "00:02:08",
        speaker: "Interviewer",
        text: "What did you do to keep the experience responsive?",
        videoUrl: `${MOCK_MEDIA_BASE}/toro-interview-000208.mp4`,
      },
      {
        timestamp: "00:02:25",
        speaker: "Toro Adeyemi",
        text: "We used skeletons for slow panels and kept the primary evidence actions independent of the data refresh.",
        videoUrl: `${MOCK_MEDIA_BASE}/toro-interview-000225.mp4`,
      },
    ],
  }),
  "PASS_WITH_LOW_RISK",
  false,
);

const juliaPhase2 = deepfake(
  gemini({
    overallRisk: "MEDIUM",
    syntheticVideo: risk("UNKNOWN", 0.4),
    personContinuity: risk("UNKNOWN", 0.35),
    audioVideoConsistency: risk("UNKNOWN", 0.3),
    possibleOffScreenAssistance: risk("UNKNOWN", 0.3),
    limitations: ["Proctoring analysis is queued and has not completed."],
  }),
  "REVIEW_REQUIRED",
  true,
);

const toroSecondIdentity = identity(
  "FAIL",
  0.84,
  "POOR",
  "POOR",
  true,
  [],
  [
    "Face tracking indicates more than one person in the interview frame.",
    "The candidate's facial geometry changes between adjacent segments.",
  ],
  ["Both reference and interview videos contain low-quality frames."],
);

const toroSecondDeepfake = deepfake(
  gemini({
    overallRisk: "HIGH",
    syntheticVideo: risk("HIGH", 0.87, [
      observation(
        "00:01:04",
        "Gemini",
        "Synthetic artifacts",
        "Frame blending and texture warping are visible near the first response.",
      ),
    ]),
    personContinuity: risk("HIGH", 0.9, [
      observation(
        "00:01:18",
        "Gemini",
        "Identity continuity",
        "Facial proportions shift sharply between consecutive segments.",
      ),
    ]),
    audioVideoConsistency: risk("HIGH", 0.79, [
      observation(
        "00:01:32",
        "Audio analysis",
        "Audio alignment",
        "Speech timing does not align with visible mouth movement.",
      ),
    ]),
    possibleOffScreenAssistance: risk("HIGH", 0.82, [
      observation(
        "00:01:44",
        "Audio analysis",
        "Off-screen audio",
        "A second speaker is audible during a technical explanation.",
      ),
    ]),
    suspiciousTimeRanges: ["00:01:02 - 00:01:52"],
    limitations: [
      "Low-quality source frames reduce confidence in exact artifact boundaries.",
      "Audio separation is limited when both voices overlap.",
    ],
    transcriptEntries: [
      {
        timestamp: "00:01:05",
        speaker: "Interviewer",
        text: "Explain how you would debug a rendering issue that only appears in production.",
        videoUrl: `${MOCK_MEDIA_BASE}/toro-second-000105.mp4`,
      },
      {
        timestamp: "00:01:23",
        speaker: "Toro Adeyemi",
        text: "I would first compare the production trace against a local replay and isolate the state transition.",
        videoUrl: `${MOCK_MEDIA_BASE}/toro-second-000123.mp4`,
      },
    ],
  }),
  "REVIEW_REQUIRED",
  true,
  [
    {
      result: "Identity specialist detected multiple face tracks.",
      confidence: 0.9,
    },
    "Audio specialist flagged overlapping speakers in segment 00:01:44-00:01:52.",
  ],
);

export const MOCK_ROOM_RECORDINGS: CampaignRecordingsResponse = [
  recording({
    roomName: MOCK_ROOM_NAMES.amaraMain,
    campaignId: 119,
    email: "amara.okafor@example.com",
    userId: 9101,
    campaignRecordId: 5001,
    participantIdentity: "Amara Okafor",
    analyticsCompleted: "Y",
    analytic: analytic(amaraIdentity, amaraDeepfake),
  }),
  recording({
    roomName: MOCK_ROOM_NAMES.dmitri,
    campaignId: 119,
    email: "dmitri.volkov@example.com",
    userId: 9102,
    campaignRecordId: 5002,
    participantIdentity: null,
    analyticsCompleted: "N",
    analytic: analytic(null, dmitriPhase2),
  }),
  recording({
    roomName: MOCK_ROOM_NAMES.amaraSecond,
    campaignId: 119,
    email: "amara.okafor@example.com",
    userId: 9103,
    campaignRecordId: 5003,
    participantIdentity: "Amara Okafor",
    analyticsCompleted: "Y",
    analytic: analytic(amaraSecondIdentity, amaraSecondDeepfake),
  }),
  recording({
    roomName: MOCK_ROOM_NAMES.priya,
    campaignId: 120,
    email: "priya.nair@example.com",
    userId: 9201,
    campaignRecordId: 5101,
    participantIdentity: "Priya Nair",
    analyticsCompleted: "Y",
    analytic: analytic(priyaIdentity, priyaDeepfake),
  }),
  recording({
    roomName: MOCK_ROOM_NAMES.lucas,
    campaignId: 120,
    email: "lucas.moreau@example.com",
    userId: 9202,
    campaignRecordId: 5102,
    participantIdentity: null,
    analyticsCompleted: "N",
    analytic: analytic(null, lucasPhase2),
  }),
  recording({
    roomName: MOCK_ROOM_NAMES.sofia,
    campaignId: 120,
    email: "sofia.reyes@example.com",
    userId: 9203,
    campaignRecordId: 5103,
    participantIdentity: "Sofia Reyes",
    analyticsCompleted: "Y",
    analytic: analytic(sofiaIdentity, sofiaDeepfake),
  }),
  recording({
    roomName: MOCK_ROOM_NAMES.noah,
    campaignId: 122,
    email: "noah.williams@example.com",
    userId: 9301,
    campaignRecordId: 5201,
    participantIdentity: "Noah Williams",
    analyticsCompleted: "Y",
    analytic: analytic(noahIdentity, noahDeepfake),
  }),
  recording({
    roomName: MOCK_ROOM_NAMES.chen,
    campaignId: 122,
    email: "chen.wei@example.com",
    userId: 9302,
    campaignRecordId: 5202,
    participantIdentity: "Chen Wei",
    analyticsCompleted: "N",
    analytic: analytic(null, chenPhase2),
  }),
  recording({
    roomName: MOCK_ROOM_NAMES.mariam,
    campaignId: 122,
    email: "mariam.haddad@example.com",
    userId: 9303,
    campaignRecordId: 5203,
    participantIdentity: "Mariam Haddad",
    analyticsCompleted: "Y",
    analytic: analytic(mariamIdentity, mariamDeepfake),
  }),
  recording({
    roomName: MOCK_ROOM_NAMES.toroMain,
    campaignId: 123,
    email: "toro29k@gmail.com",
    userId: 9401,
    campaignRecordId: 5301,
    participantIdentity: "Toro Adeyemi",
    analyticsCompleted: "Y",
    analytic: analytic(toroIdentity, toroDeepfake),
  }),
  recording({
    roomName: MOCK_ROOM_NAMES.julia,
    campaignId: 123,
    email: "julia.kowalski@example.com",
    userId: 9402,
    campaignRecordId: 5302,
    participantIdentity: "Julia Kowalski",
    analyticsCompleted: "N",
    status: "PROCESSING",
    analytic: analytic(null, juliaPhase2),
  }),
  recording({
    roomName: MOCK_ROOM_NAMES.toroSecond,
    campaignId: 123,
    email: "toro29k@gmail.com",
    userId: 9403,
    campaignRecordId: 5303,
    participantIdentity: "Toro Adeyemi",
    analyticsCompleted: "Y",
    analytic: analytic(toroSecondIdentity, toroSecondDeepfake),
  }),
];
