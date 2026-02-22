// services/screeningEngine.js

export function screenResume({ resume, job, matchResult }) {
  const reasons = [];

  const {
    skills: candidateSkills = [],
    experience: candidateExp = 0,
  } = resume;

  const {
    skillsRequired = [],
    experience: requiredExp = 0,
    mandatorySkills = [], // optional future upgrade
  } = job;

  const {
    matchPercentage,
    missingSkills = [],
  } = matchResult;

  /* ---------------- RULE 1: Mandatory Skills ---------------- */
  if (mandatorySkills.length > 0) {
    const missingMandatory = mandatorySkills.filter(
      (skill) => !candidateSkills.includes(skill)
    );

    if (missingMandatory.length > 0) {
      return {
        status: "REJECTED",
        score: matchPercentage,
        reasons: missingMandatory.map(
          (s) => `Missing mandatory skill: ${s}`
        ),
      };
    }
  }

  /* ---------------- RULE 2: Experience Threshold ---------------- */
  if (candidateExp < requiredExp) {
    reasons.push(
      `Experience required: ${requiredExp} yrs, found: ${candidateExp} yrs`
    );
  }

  /* ---------------- RULE 3: Match Percentage ---------------- */
  if (matchPercentage < 40) {
    reasons.push("Overall skill match below minimum threshold (40%)");
  }

  /* ---------------- FINAL DECISION ---------------- */
  if (reasons.length > 0) {
    return {
      status: "REJECTED",
      score: matchPercentage,
      reasons,
    };
  }

  if (matchPercentage >= 75) {
    return {
      status: "RECOMMENDED",
      score: matchPercentage,
      reasons: ["Strong overall match"],
    };
  }

  return {
    status: "SHORTLISTED",
    score: matchPercentage,
    reasons: ["Meets basic screening criteria"],
  };
}
