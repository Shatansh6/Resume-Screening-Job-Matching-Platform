import { normalizeSkill } from "./skillNormalizer.js";

export function calculateMatch(userSkills = [], jobSkills = []) {
  // Normalize & deduplicate user skills
  const normalizedUserSkills = new Set(
    userSkills
      .map(normalizeSkill)
      .filter(Boolean)
  );

  // Normalize job required skills
  const normalizedJobSkills = jobSkills
    .map(normalizeSkill)
    .filter(Boolean);

  const matchedSkills = [];
  const missingSkills = [];

  for (const skill of normalizedJobSkills) {
    let matched = false;

    for (const userSkill of normalizedUserSkills) {
      // Exact OR partial match
      if (
        userSkill === skill ||
        userSkill.includes(skill) ||
        skill.includes(userSkill)
      ) {
        matched = true;
        matchedSkills.push(skill);
        break;
      }
    }

    if (!matched) {
      missingSkills.push(skill);
    }
  }

  const matchPercentage =
    normalizedJobSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length / normalizedJobSkills.length) * 100
        );

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
  };
}
