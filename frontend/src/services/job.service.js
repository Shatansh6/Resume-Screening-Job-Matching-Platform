import api from "./api";

// PUBLIC – for All Jobs page
export async function getPublicJobs() {
  const res = await api.get("/jobs");
  return res.data.jobs || [];
}

// USER – recommended jobs
export async function getRecommendedJobs() {
  const res = await api.get("/jobs/recommended");
  return res.data.jobs || [];
}
