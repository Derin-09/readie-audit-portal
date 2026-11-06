import type {
  CampaignRecording,
  CampaignRecordingsResponse,
  DeepfakePhase2,
  IdentityPhase1,
  Transcript,
} from "../types/room";

export function getPrimaryRecording(
  recordings: CampaignRecordingsResponse,
): CampaignRecording | null {
  const persistedComposite = recordings.find(
    (recording) =>
      recording.recordingType === "COMPOSITE" &&
      recording.analyticsCompleted === "Y",
  );

  if (persistedComposite) {
    return persistedComposite;
  }

  const analyticsComplete = recordings.find(
    (recording) => recording.analyticsCompleted === "Y",
  );

  if (analyticsComplete) {
    return analyticsComplete;
  }

  const composite = recordings.find(
    (recording) => recording.recordingType === "COMPOSITE",
  );

  return composite ?? recordings[0] ?? null;
}

export function getIdentityPhase1(
  recording: CampaignRecording,
): IdentityPhase1 | null {
  return recording.analytic?.identity_phase1 ?? null;
}

export function getDeepfakePhase2(
  recording: CampaignRecording,
): DeepfakePhase2 | null {
  return recording.analytic?.deepfake_phase2 ?? null;
}

export function getTranscript(recording: CampaignRecording): Transcript | null {
  return recording.analytic?.deepfake_phase2?.gemini?.transcript ?? null;
}

export function getRoomCandidateLabel(recording: CampaignRecording): string {
  return (
    recording.participantIdentity?.trim() ||
    recording.extractedEmail?.trim() ||
    "Candidate record"
  );
}

export function getRoomCandidateEmail(recording: CampaignRecording): string {
  return recording.extractedEmail?.trim() || "Email not available";
}

export function getRoomDisposition(
  recording: CampaignRecording,
): string | null {
  return (
    recording.analytic?.disposition ??
    recording.analytic?.deepfake_phase2?.disposition ??
    null
  );
}

export function getRoomHumanReviewRequired(
  recording: CampaignRecording,
): boolean | null {
  const analyticReview = recording.analytic?.humanReviewRequired;
  const deepfakeReview = recording.analytic?.deepfake_phase2?.humanReviewRequired;

  return analyticReview ?? deepfakeReview ?? null;
}
