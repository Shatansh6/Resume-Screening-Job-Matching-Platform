import api from "./api";

export async function uploadResume(file) {
  const formData = new FormData();

  // 🔥 MUST be "resume" — backend expects this
  formData.append("resume", file);

  const res = await api.post(
    "/users/upload-resume",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}
