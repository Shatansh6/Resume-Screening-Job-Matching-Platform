import { SKILLS } from "./skillList.js";

export const extractSkills = (text) => {
  const found = new Set();
  for (const skill of SKILLS) {
    const re = new RegExp(`\\b${skill}\\b`, "i");
    if (re.test(text)) found.add(skill);
  }
  return [...found];
};
