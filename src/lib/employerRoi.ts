export type RoiInputs = { roles: number; applicants: number; minutes: number; rate: number };

/** Share of manual screening time TalentCIR removes (sheet section 16). */
export const SCREENING_SAVED = 0.8;
/** Share of first-round interviews TalentCIR removes (sheet section 16). */
export const INTERVIEWS_AVOIDED = 0.6;
/** Assumed first-round interviews per role before TalentCIR. */
export const FIRST_ROUNDS_PER_ROLE = 12;

export const ROI_DEFAULTS: RoiInputs = { roles: 40, applicants: 300, minutes: 4, rate: 600 };

export const calculateRoi = ({ roles, applicants, minutes, rate }: RoiInputs) => {
  const hoursSaved = Math.round(((roles * applicants * minutes) / 60) * SCREENING_SAVED);
  const interviewsAvoided = Math.round(roles * FIRST_ROUNDS_PER_ROLE * INTERVIEWS_AVOIDED);
  const costSaved = hoursSaved * rate;
  return { hoursSaved, interviewsAvoided, costSaved };
};
