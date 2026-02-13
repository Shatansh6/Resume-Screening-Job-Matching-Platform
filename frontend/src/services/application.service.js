import api from "./api";
import { API_ROUTES } from "../constants/apiRoutes";

export async function applyToJob(jobId) {
  const res = await api.post(API_ROUTES.APPLY_JOB, { jobId });
  return res.data.data;
}

export async function getMyApplications() {
  const res = await api.get(API_ROUTES.USER_APPLICATIONS);
  return res.data.data || [];
}

export async function getApplicantsByJob(jobId) {
  const res = await api.get(`${API_ROUTES.ADMIN_APPLICANTS}/${jobId}`);
  return res.data.data || [];
}

export async function updateApplicationStatus(applicationId, status) {
  const res = await api.patch(
    `/admin/applications/${applicationId}/status`,
    { status }
  );
  return res.data.data;
}
