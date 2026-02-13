const SKILL_SYNONYMS = {
  js: "javascript",
  javascript: "javascript",

  node: "nodejs",
  "node.js": "nodejs",
  nodejs: "nodejs",

  reactjs: "react",
  react: "react",

  mongo: "mongodb",
  mongodb: "mongodb",

  css3: "css",
  html5: "html",

  expressjs: "express",
  express: "express",

  sql: "sql",
  mysql: "sql",
  postgresql: "sql",

  git: "git",
  github: "git",

  jwt: "authentication",
  auth: "authentication",
  authentication: "authentication",
};

export function normalizeSkill(skill) {
  if (!skill) return null;

  const cleaned = skill
    .toLowerCase()
    .replace(/[^a-z0-9.+]/g, "")
    .trim();

  return SKILL_SYNONYMS[cleaned] || cleaned;
}
